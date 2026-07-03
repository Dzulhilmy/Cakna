use crate::error::AppError;
use crate::state::AppState;
use axum::extract::FromRequestParts;
use axum::http::header::COOKIE;
use axum::http::request::Parts;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use rand::RngCore;
use sha2::{Digest, Sha256};
use time::{Duration, OffsetDateTime};
use uuid::Uuid;

pub const COOKIE_NAME: &str = "cakna_session";

pub fn new_token() -> String {
    let mut bytes = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut bytes);
    URL_SAFE_NO_PAD.encode(bytes)
}

pub fn hash_token(token: &str) -> Vec<u8> {
    Sha256::digest(token.as_bytes()).to_vec()
}

pub fn set_cookie(token: &str, ttl_days: i64, secure: bool) -> String {
    format!(
        "{COOKIE_NAME}={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={}{}",
        ttl_days * 86400,
        if secure { "; Secure" } else { "" }
    )
}

pub fn clear_cookie(secure: bool) -> String {
    format!(
        "{COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0{}",
        if secure { "; Secure" } else { "" }
    )
}

pub fn cookie_value(headers: &axum::http::HeaderMap) -> Option<String> {
    let header = headers.get(COOKIE)?.to_str().ok()?;
    header.split(';').find_map(|kv| {
        let (k, v) = kv.trim().split_once('=')?;
        (k == COOKIE_NAME).then(|| v.to_string())
    })
}

pub async fn create(st: &AppState, user_id: Uuid) -> Result<String, AppError> {
    let token = new_token();
    let expires = OffsetDateTime::now_utc() + Duration::days(st.cfg.session_ttl_days);
    sqlx::query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)")
        .bind(hash_token(&token))
        .bind(user_id)
        .bind(expires)
        .execute(&st.pool)
        .await?;
    Ok(token)
}

pub async fn destroy(st: &AppState, token: &str) -> Result<(), AppError> {
    sqlx::query("DELETE FROM sessions WHERE token_hash = $1")
        .bind(hash_token(token))
        .execute(&st.pool)
        .await?;
    Ok(())
}

/// Authenticated user extractor: opaque cookie token -> sessions join users.
/// Sliding expiry: refreshed when more than half the TTL has elapsed.
pub struct AuthUser {
    pub id: Uuid,
    pub email: String,
}

#[axum::async_trait]
impl FromRequestParts<AppState> for AuthUser {
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, st: &AppState) -> Result<Self, Self::Rejection> {
        let token = cookie_value(&parts.headers).ok_or(AppError::Unauthorized)?;
        let token_hash = hash_token(&token);
        let row = sqlx::query_as::<_, (Uuid, String, OffsetDateTime)>(
            "SELECT u.id, u.email::text, s.expires_at FROM sessions s \
             JOIN users u ON u.id = s.user_id \
             WHERE s.token_hash = $1 AND s.expires_at > now()",
        )
        .bind(&token_hash)
        .fetch_optional(&st.pool)
        .await?
        .ok_or(AppError::Unauthorized)?;

        let (id, email, expires_at) = row;
        let ttl = Duration::days(st.cfg.session_ttl_days);
        if expires_at - OffsetDateTime::now_utc() < ttl / 2 {
            sqlx::query("UPDATE sessions SET expires_at = now() + $2 WHERE token_hash = $1")
                .bind(&token_hash)
                .bind(ttl)
                .execute(&st.pool)
                .await?;
        }
        Ok(AuthUser { id, email })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn token_roundtrip() {
        let t = new_token();
        assert!(t.len() >= 42);
        assert_eq!(hash_token(&t).len(), 32);
        assert_ne!(new_token(), t);
    }

    #[test]
    fn cookie_format() {
        let c = set_cookie("abc", 30, true);
        assert!(c.contains("cakna_session=abc"));
        assert!(c.contains("HttpOnly"));
        assert!(c.contains("Secure"));
        assert!(!set_cookie("abc", 30, false).contains("Secure"));
    }
}
