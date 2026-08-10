//! QCXIS OpenID Connect — OAuth 2.1 Authorization Code + PKCE (S256).
//!
//! The code exchange runs server-side because QCXIS locks browser CORS to its
//! own origin. Works as either a confidential client (client_secret_basic) or a
//! public PKCE client (no secret; the code_verifier is the proof).
//!
//! Ported from the Node implementation with three deliberate changes, each
//! fixing a defect in the original:
//!
//!   1. NONCE IS CHECKED UNCONDITIONALLY. The Node version wrote
//!      `if (payload.nonce && payload.nonce !== saved.nonce)`, so an id_token
//!      that simply omitted the claim sailed through — defeating the replay
//!      protection the nonce exists to provide.
//!   2. EMAIL LINKING REQUIRES `email_verified`. The Node version attached a
//!      QCXIS identity to any local account with a matching address. If the
//!      provider ever emitted an unverified email, that was a takeover path
//!      into an existing password account.
//!   3. PENDING STATE LIVES IN THE DATABASE, not a process-local Map, so the
//!      flow survives a restart and works with more than one app process.

use crate::auth::session;
use crate::error::AppError;
use crate::state::AppState;
use axum::extract::{Query, State};
use axum::http::header::{LOCATION, SET_COOKIE};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use base64::engine::general_purpose::{STANDARD as B64, URL_SAFE_NO_PAD};
use base64::Engine;
use rand::RngCore;
use serde::Deserialize;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use time::{Duration, OffsetDateTime};
use uuid::Uuid;

/// The consent hop must complete within this window.
const PENDING_TTL_MINUTES: i64 = 10;

fn b64url(bytes: &[u8]) -> String {
    URL_SAFE_NO_PAD.encode(bytes)
}

fn random(n: usize) -> Vec<u8> {
    let mut b = vec![0u8; n];
    rand::thread_rng().fill_bytes(&mut b);
    b
}

/// Only same-site relative paths may be returned to — blocks open redirects.
fn safe_next(next: Option<&str>) -> String {
    match next {
        Some(n) if n.starts_with('/') && !n.starts_with("//") => n.to_string(),
        _ => "/mathurat".to_string(),
    }
}

/// Redirect back to the login screen carrying a message.
fn to_login(query: &str) -> Response {
    (
        StatusCode::FOUND,
        [(LOCATION, format!("/auth/login?{query}"))],
    )
        .into_response()
}

fn enc(s: &str) -> String {
    // Minimal query-component escaping — enough for the short Malay messages below.
    s.chars()
        .map(|c| match c {
            'A'..='Z' | 'a'..='z' | '0'..='9' | '-' | '_' | '.' | '~' => c.to_string(),
            ' ' => "+".to_string(),
            _ => c.to_string().bytes().map(|b| format!("%{b:02X}")).collect(),
        })
        .collect()
}

/* ----------------------------------------------------------------- discovery */

#[derive(Debug, Clone, Deserialize)]
pub struct Discovery {
    issuer: String,
    authorization_endpoint: String,
    token_endpoint: String,
    jwks_uri: String,
}

async fn discovery(st: &AppState) -> Result<Discovery, AppError> {
    if let Some(d) = st.oidc.read().await.as_ref() {
        return Ok(d.clone());
    }
    let url = format!(
        "{}/.well-known/openid-configuration",
        st.cfg.qcxis.issuer
    );
    let r = st
        .http
        .get(&url)
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("discovery: {e}")))?;
    if !r.status().is_success() {
        return Err(AppError::Upstream(format!(
            "discovery returned {}",
            r.status()
        )));
    }
    let d: Discovery = r
        .json()
        .await
        .map_err(|e| AppError::Upstream(format!("discovery body: {e}")))?;
    *st.oidc.write().await = Some(d.clone());
    Ok(d)
}

/* ---------------------------------------------------------------- id_token */

/// Verify the id_token against the provider's JWKS: RS256 signature, issuer,
/// audience and expiry. Returns the claims.
async fn verify_id_token(st: &AppState, d: &Discovery, id_token: &str) -> Result<Value, AppError> {
    use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};

    let header = decode_header(id_token)
        .map_err(|e| AppError::Upstream(format!("id_token header: {e}")))?;
    let kid = header
        .kid
        .ok_or_else(|| AppError::Upstream("id_token has no kid".into()))?;

    let jwks: Value = st
        .http
        .get(&d.jwks_uri)
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("jwks: {e}")))?
        .json()
        .await
        .map_err(|e| AppError::Upstream(format!("jwks body: {e}")))?;

    let key = jwks["keys"]
        .as_array()
        .and_then(|ks| {
            ks.iter()
                .find(|k| k["kid"].as_str() == Some(kid.as_str()))
        })
        .ok_or_else(|| AppError::Upstream(format!("no JWKS key for kid {kid}")))?;

    let (n, e) = (
        key["n"].as_str().unwrap_or_default(),
        key["e"].as_str().unwrap_or_default(),
    );
    let dk = DecodingKey::from_rsa_components(n, e)
        .map_err(|e| AppError::Upstream(format!("jwks key: {e}")))?;

    let mut v = Validation::new(Algorithm::RS256);
    v.set_issuer(&[d.issuer.as_str()]);
    v.set_audience(&[st.cfg.qcxis.client_id.as_str()]);
    // exp is validated by default; leeway stays at the crate default.

    let data = decode::<Value>(id_token, &dk, &v)
        .map_err(|e| AppError::Upstream(format!("id_token invalid: {e}")))?;
    Ok(data.claims)
}

/* -------------------------------------------------------------------- user */

/// Link or create the local account from verified claims.
///
/// Matching order: `qcxis_sub` first (a stable provider identifier), then email
/// — but ONLY when the provider asserts `email_verified`. Without that check an
/// unverified address would be enough to seize an existing password account.
async fn upsert_user(st: &AppState, claims: &Value) -> Result<Uuid, AppError> {
    let sub = claims["sub"]
        .as_str()
        .ok_or_else(|| AppError::Upstream("id_token has no sub".into()))?;
    let email = claims["email"].as_str().map(str::trim).filter(|e| !e.is_empty());
    let name = claims["name"].as_str().map(str::trim).filter(|n| !n.is_empty());
    let email_verified = claims["email_verified"].as_bool().unwrap_or(false);

    let mut tx = st.pool.begin().await?;

    // 1. existing link by subject
    let by_sub: Option<Uuid> = sqlx::query_scalar("SELECT id FROM users WHERE qcxis_sub = $1")
        .bind(sub)
        .fetch_optional(&mut *tx)
        .await?;

    // 2. otherwise adopt a local account with the same VERIFIED address
    let existing = match by_sub {
        Some(id) => Some(id),
        None => match (email, email_verified) {
            (Some(e), true) => {
                sqlx::query_scalar::<_, Uuid>("SELECT id FROM users WHERE email = $1::citext")
                    .bind(e)
                    .fetch_optional(&mut *tx)
                    .await?
            }
            (Some(_), false) => {
                tracing::warn!(
                    "qcxis sub={sub} supplied an unverified email; not linking to an existing account"
                );
                None
            }
            _ => None,
        },
    };

    let id = if let Some(id) = existing {
        sqlx::query(
            "UPDATE users SET qcxis_sub = $1, name = COALESCE($2, name), \
             login_method = 'qcxis', last_login = now() WHERE id = $3",
        )
        .bind(sub)
        .bind(name)
        .bind(id)
        .execute(&mut *tx)
        .await?;
        id
    } else {
        // users.email is NOT NULL, so an id_token without an email cannot create
        // an account. Fail loudly rather than inventing a placeholder address.
        let email = email.ok_or_else(|| {
            AppError::Upstream("id_token carried no email; cannot create an account".into())
        })?;
        sqlx::query_scalar::<_, Uuid>(
            "INSERT INTO users (email, name, qcxis_sub, login_method, last_login) \
             VALUES ($1::citext, $2, $3, 'qcxis', now()) RETURNING id",
        )
        .bind(email)
        .bind(name)
        .bind(sub)
        .fetch_one(&mut *tx)
        .await?
    };

    tx.commit().await?;
    Ok(id)
}

/* ---------------------------------------------------------------- handlers */

#[derive(Deserialize)]
pub struct StartQuery {
    pub next: Option<String>,
    /// Set by the mobile app to receive the session token as a deep-link
    /// (`cakna://auth/done?token=…`) instead of a browser cookie.
    pub mobile: Option<bool>,
}

pub async fn start(State(st): State<AppState>, Query(q): Query<StartQuery>) -> Response {
    if !st.cfg.qcxis.configured() {
        return to_login("sso=unconfigured");
    }
    let d = match discovery(&st).await {
        Ok(d) => d,
        Err(e) => {
            tracing::error!("sso/start discovery: {e}");
            return to_login(&format!("error={}", enc("SSO tidak tersedia buat masa ini")));
        }
    };

    let verifier = b64url(&random(32));
    let challenge = b64url(&Sha256::digest(verifier.as_bytes()));
    let state = b64url(&random(24));
    let nonce = b64url(&random(16));

    // Opportunistic sweep, then record this attempt.
    let expires = OffsetDateTime::now_utc() + Duration::minutes(PENDING_TTL_MINUTES);
    let stored = async {
        sqlx::query("DELETE FROM sso_pending WHERE expires_at < now()")
            .execute(&st.pool)
            .await?;
        sqlx::query(
            "INSERT INTO sso_pending (state, code_verifier, nonce, next_path, mobile, expires_at) \
             VALUES ($1, $2, $3, $4, $5, $6)",
        )
        .bind(&state)
        .bind(&verifier)
        .bind(&nonce)
        .bind(safe_next(q.next.as_deref()))
        .bind(q.mobile.unwrap_or(false))
        .bind(expires)
        .execute(&st.pool)
        .await
    }
    .await;
    if let Err(e) = stored {
        tracing::error!("sso/start persist: {e}");
        return to_login(&format!("error={}", enc("SSO tidak tersedia buat masa ini")));
    }

    let url = format!(
        "{}?response_type=code&client_id={}&redirect_uri={}&scope={}&state={}&code_challenge={}&code_challenge_method=S256&nonce={}",
        d.authorization_endpoint,
        enc(&st.cfg.qcxis.client_id),
        enc(&st.cfg.qcxis.redirect_uri),
        enc(&st.cfg.qcxis.scope),
        enc(&state),
        enc(&challenge),
        enc(&nonce),
    );
    (StatusCode::FOUND, [(LOCATION, url)]).into_response()
}

#[derive(Deserialize)]
pub struct CallbackQuery {
    pub code: Option<String>,
    pub state: Option<String>,
    pub error: Option<String>,
}

pub async fn callback(State(st): State<AppState>, Query(q): Query<CallbackQuery>) -> Response {
    if let Some(err) = q.error.as_deref() {
        tracing::warn!("sso/callback provider error: {err}");
        return to_login(&format!("error={}", enc(err)));
    }
    let (Some(code), Some(state)) = (q.code.as_deref(), q.state.as_deref()) else {
        return to_login(&format!("error={}", enc("Sesi log masuk tamat, cuba lagi")));
    };

    // Single-use: consume the pending row, and only accept an unexpired one.
    let saved = sqlx::query_as::<_, (String, String, String, bool)>(
        "DELETE FROM sso_pending WHERE state = $1 AND expires_at > now() \
         RETURNING code_verifier, nonce, next_path, mobile",
    )
    .bind(state)
    .fetch_optional(&st.pool)
    .await;

    let (verifier, nonce, next_path, mobile) = match saved {
        Ok(Some(row)) => row,
        Ok(None) => return to_login(&format!("error={}", enc("Sesi log masuk tamat, cuba lagi"))),
        Err(e) => {
            tracing::error!("sso/callback state lookup: {e}");
            return to_login(&format!("error={}", enc("Log masuk QCXIS gagal, cuba lagi")));
        }
    };

    match exchange_and_sign_in(&st, code, &verifier, &nonce).await {
        Ok(token) => {
            if mobile {
                // Mobile flow: hand the session token back as a deep link.
                // The app (flutter_web_auth_2) intercepts the cakna:// scheme,
                // stores the token, and calls /api/auth/me for the user info.
                let deep = format!("cakna://auth/done?token={token}");
                return (StatusCode::FOUND, [(LOCATION, deep)]).into_response();
            }
            let cookie =
                session::set_cookie(&token, st.cfg.session_ttl_days, st.cfg.cookie_secure);
            let mut res = (StatusCode::FOUND, [(LOCATION, next_path)]).into_response();
            match cookie.parse() {
                Ok(v) => {
                    res.headers_mut().insert(SET_COOKIE, v);
                    res
                }
                Err(e) => {
                    tracing::error!("sso/callback cookie header: {e}");
                    to_login(&format!("error={}", enc("Log masuk QCXIS gagal, cuba lagi")))
                }
            }
        }
        Err(e) => {
            tracing::error!("sso/callback: {e}");
            to_login(&format!("error={}", enc("Log masuk QCXIS gagal, cuba lagi")))
        }
    }
}

async fn exchange_and_sign_in(
    st: &AppState,
    code: &str,
    verifier: &str,
    nonce: &str,
) -> Result<String, AppError> {
    let d = discovery(st).await?;
    let cfg = &st.cfg.qcxis;

    let mut form = vec![
        ("grant_type", "authorization_code".to_string()),
        ("code", code.to_string()),
        ("redirect_uri", cfg.redirect_uri.clone()),
        ("code_verifier", verifier.to_string()),
    ];
    let mut req = st.http.post(&d.token_endpoint);
    if cfg.client_secret.is_empty() {
        // public PKCE client: identify in the body, the verifier is the proof
        form.push(("client_id", cfg.client_id.clone()));
    } else {
        // confidential client: client_secret_basic
        let basic = B64.encode(format!("{}:{}", cfg.client_id, cfg.client_secret));
        req = req.header("authorization", format!("Basic {basic}"));
    }

    let resp = req
        .form(&form)
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("token request: {e}")))?;
    if !resp.status().is_success() {
        let status = resp.status();
        let body = resp.text().await.unwrap_or_default();
        return Err(AppError::Upstream(format!("token {status}: {body}")));
    }
    let tokens: Value = resp
        .json()
        .await
        .map_err(|e| AppError::Upstream(format!("token body: {e}")))?;
    let id_token = tokens["id_token"]
        .as_str()
        .ok_or_else(|| AppError::Upstream("token response had no id_token".into()))?;

    let claims = verify_id_token(st, &d, id_token).await?;

    // Unconditional — an id_token that omits `nonce` is rejected, not waved through.
    if claims["nonce"].as_str() != Some(nonce) {
        return Err(AppError::Upstream("nonce mismatch".into()));
    }

    let user_id = upsert_user(st, &claims).await?;
    session::create(st, user_id).await
}

pub async fn status(State(st): State<AppState>) -> Json<Value> {
    Json(json!({
        "configured": st.cfg.qcxis.configured(),
        "issuer": st.cfg.qcxis.issuer,
    }))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn safe_next_blocks_open_redirects() {
        assert_eq!(safe_next(Some("/mathurat")), "/mathurat");
        assert_eq!(safe_next(Some("/read/42")), "/read/42");
        assert_eq!(safe_next(Some("//evil.example.com")), "/mathurat");
        assert_eq!(safe_next(Some("https://evil.example.com")), "/mathurat");
        assert_eq!(safe_next(Some("javascript:alert(1)")), "/mathurat");
        assert_eq!(safe_next(None), "/mathurat");
    }

    #[test]
    fn pkce_challenge_is_s256_of_the_verifier() {
        // RFC 7636 appendix B test vector.
        let verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
        let challenge = b64url(&Sha256::digest(verifier.as_bytes()));
        assert_eq!(challenge, "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
    }

    #[test]
    fn encoder_escapes_query_components() {
        assert_eq!(enc("openid profile email"), "openid+profile+email");
        assert_eq!(enc("http://x/cb"), "http%3A%2F%2Fx%2Fcb");
        assert_eq!(enc("abc-123_x.y~z"), "abc-123_x.y~z");
    }
}
