use crate::error::AppError;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use argon2::Argon2;
use scrypt::{scrypt, Params as ScryptParams};

pub fn hash(password: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|h| h.to_string())
        .map_err(|e| AppError::Internal(format!("argon2 hash: {e}")))
}

/// Verify a password against a stored hash, transparently supporting two formats:
///
///   * Argon2id PHC strings (`$argon2id$…`) — what this server writes.
///   * Legacy Node/Express scrypt hashes (`<saltHex>:<hashHex>`) carried over
///     from the cakna.org deployment during the schema migration. A hash in this
///     format that verifies should be upgraded — see [`needs_rehash`].
pub fn verify(password: &str, hash: &str) -> bool {
    if hash.starts_with("$argon2") {
        verify_argon2(password, hash)
    } else if hash.contains(':') {
        verify_legacy_scrypt(password, hash)
    } else {
        false
    }
}

fn verify_argon2(password: &str, hash: &str) -> bool {
    PasswordHash::new(hash)
        .map(|parsed| {
            Argon2::default()
                .verify_password(password.as_bytes(), &parsed)
                .is_ok()
        })
        .unwrap_or(false)
}

/// Legacy hash format, from `legacy/server/server.mjs`:
///
/// ```js
/// const s = crypto.randomBytes(16).toString('hex');       // 32 hex chars
/// return s + ':' + crypto.scryptSync(pw, s, 64).toString('hex');
/// ```
///
/// Two subtleties must be matched exactly or every legacy login silently fails:
///   * The salt handed to scrypt is the 32-character hex STRING as UTF-8 bytes,
///     not the 16 decoded bytes — Node coerces a string salt to a Buffer as-is.
///   * Node's `scryptSync` defaults are N=16384 (log2 = 14), r=8, p=1, keylen=64.
fn verify_legacy_scrypt(password: &str, stored: &str) -> bool {
    let Some((salt_hex, expected_hex)) = stored.split_once(':') else {
        return false;
    };
    let Ok(expected) = hex::decode(expected_hex) else {
        return false;
    };
    if expected.len() != 64 {
        return false;
    }
    let Ok(params) = ScryptParams::new(14, 8, 1, 64) else {
        return false;
    };
    let mut out = [0u8; 64];
    if scrypt(password.as_bytes(), salt_hex.as_bytes(), &params, &mut out).is_err() {
        return false;
    }
    ct_eq(&out, &expected)
}

/// Constant-time byte comparison, mirroring the legacy path's `timingSafeEqual`.
fn ct_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let mut diff = 0u8;
    for (x, y) in a.iter().zip(b) {
        diff |= x ^ y;
    }
    diff == 0
}

/// True when a hash that just verified is NOT in the current Argon2id format and
/// should be rehashed and re-stored. The login handler calls this so each
/// migrated legacy (scrypt) account is upgraded to Argon2id on first sign-in.
pub fn needs_rehash(hash: &str) -> bool {
    !hash.starts_with("$argon2")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_and_verify_roundtrip() {
        let h = hash("secret123").unwrap();
        assert!(verify("secret123", &h));
        assert!(!verify("wrong", &h));
        assert!(!needs_rehash(&h));
    }

    /// Cross-implementation fixture generated with the exact legacy algorithm:
    ///   node -e 'const c=require("crypto"); const s="0123456789abcdef0123456789abcdef";
    ///            console.log(s+":"+c.scryptSync("test-password-123",s,64).toString("hex"))'
    /// If this ever fails, migrated cakna.org users cannot log in.
    #[test]
    fn verifies_legacy_node_scrypt_hash() {
        let legacy = "0123456789abcdef0123456789abcdef:adc5010e087f548f339d088567e44bce910a436f02a07205624fb707b76d10c28f0761563ae311b011f41b0c5859959e6a2147ed0a92599d589b59fb0917c2ee";
        assert!(verify("test-password-123", legacy), "correct password must verify");
        assert!(!verify("wrong-password", legacy), "wrong password must fail");
        assert!(needs_rehash(legacy), "a legacy scrypt hash must be flagged for rehash");
    }

    #[test]
    fn rejects_malformed_hashes() {
        assert!(!verify("x", ""));
        assert!(!verify("x", "not-a-hash"));
        assert!(!verify("x", "deadbeef:nothex")); // second half not valid hex
        assert!(!verify("x", "abc:")); // empty hash half
        // Right shape, wrong length hash half (not 64 bytes) must not panic.
        assert!(!verify("x", "0123:00112233"));
    }
}
