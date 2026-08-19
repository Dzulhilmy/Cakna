use axum::extract::{FromRequestParts, State};
use axum::http::{request::Parts, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::{async_trait, Json};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use crate::error::{AppError, Result};
use crate::state::AppState;

// ── Hub user ──────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct HubUser {
    pub id: Uuid,
    pub email: String,
    pub name: String,
    pub role: String,
    pub branch: String,
    pub status: String,
    pub created_at: time::OffsetDateTime,
}

// ── Identity from Cakna API ───────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
pub struct CaknaMe {
    pub email: String,
    pub name: String,
}

pub async fn check_cakna_session(
    state: &AppState,
    cookie: &str,
) -> Option<CaknaMe> {
    let res = state
        .http
        .get(format!("{}/api/auth/me", state.cfg.cakna_api_url))
        .header("cookie", cookie)
        .send()
        .await
        .ok()?;
    if !res.status().is_success() {
        return None;
    }
    res.json::<CaknaMe>().await.ok()
}

/// Find or create a Hub user from a Cakna identity.
pub async fn resolve_hub_user(
    pool: &sqlx::PgPool,
    email: &str,
    name: &str,
) -> Result<HubUser> {
    let email = email.trim().to_lowercase();
    let user = sqlx::query_as::<_, HubUser>(
        "SELECT id, email, name, role, branch, status, created_at
         FROM hub_users WHERE email = $1",
    )
    .bind(&email)
    .fetch_optional(pool)
    .await?;

    if let Some(mut u) = user {
        // Sync name if it changed in Cakna
        if !name.is_empty() && u.name != name {
            sqlx::query("UPDATE hub_users SET name = $1 WHERE id = $2")
                .bind(name)
                .bind(u.id)
                .execute(pool)
                .await?;
            u.name = name.to_string();
        }
        return Ok(u);
    }

    // Auto-create as pending member
    let u = sqlx::query_as::<_, HubUser>(
        "INSERT INTO hub_users (email, name, role, branch, status)
         VALUES ($1, $2, 'member', '', 'pending')
         RETURNING id, email, name, role, branch, status, created_at",
    )
    .bind(&email)
    .bind(if name.is_empty() { &email } else { name })
    .fetch_one(pool)
    .await?;
    Ok(u)
}

// ── Shared secret validator ────────────────────────────────────────────────────

pub fn validate_secret(state: &AppState, parts: &Parts) -> std::result::Result<(), Response> {
    if state.cfg.internal_secret.is_empty() {
        return Ok(());
    }
    let secret = parts
        .headers
        .get("x-hub-secret")
        .and_then(|v| v.to_str().ok())
        .unwrap_or_default();
    if secret != state.cfg.internal_secret {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "unauthorized"})),
        )
            .into_response());
    }
    Ok(())
}

// ── Extractor: secret-only (no user headers required, for public read endpoints) ──

pub struct HubSecret;

#[async_trait]
impl FromRequestParts<AppState> for HubSecret {
    type Rejection = Response;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> std::result::Result<Self, Self::Rejection> {
        validate_secret(state, parts)?;
        Ok(HubSecret)
    }
}

// ── Extractor: authenticated Hub user (from trusted internal headers) ─────────

/// SvelteKit server injects these after it has verified the Cakna session.
pub struct AuthUser(pub HubUser);

#[async_trait]
impl FromRequestParts<AppState> for AuthUser {
    type Rejection = Response;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> std::result::Result<Self, Self::Rejection> {
        validate_secret(state, parts)?;

        let get = |name: &str| -> String {
            parts
                .headers
                .get(name)
                .and_then(|v| v.to_str().ok())
                .unwrap_or_default()
                .to_string()
        };

        let id = get("x-hub-user-id");
        let id = Uuid::parse_str(&id).map_err(|_| {
            (
                StatusCode::UNAUTHORIZED,
                Json(json!({"error": "missing user id"})),
            )
                .into_response()
        })?;

        Ok(AuthUser(HubUser {
            id,
            email: get("x-hub-user-email"),
            name: get("x-hub-user-name"),
            role: get("x-hub-user-role"),
            branch: get("x-hub-user-branch"),
            status: get("x-hub-user-status"),
            created_at: time::OffsetDateTime::now_utc(),
        }))
    }
}
