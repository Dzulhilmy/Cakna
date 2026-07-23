use super::{password, session};
use crate::error::AppError;
use crate::state::AppState;
use axum::extract::State;
use axum::http::header::SET_COOKIE;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct Credentials {
    pub email: String,
    pub password: String,
}

fn user_json(id: Uuid, email: &str) -> serde_json::Value {
    json!({ "id": id, "email": email })
}

fn with_session_cookie(st: &AppState, token: &str, status: StatusCode, body: serde_json::Value) -> Response {
    (
        status,
        [(SET_COOKIE, session::set_cookie(token, st.cfg.session_ttl_days, st.cfg.cookie_secure))],
        Json(body),
    )
        .into_response()
}

pub async fn register(
    State(st): State<AppState>,
    Json(creds): Json<Credentials>,
) -> Result<Response, AppError> {
    let email = creds.email.trim().to_lowercase();
    if !email.contains('@') || email.len() < 5 {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    if creds.password.chars().count() < 8 {
        return Err(AppError::BadRequest("password must be at least 8 characters".into()));
    }
    let hash = password::hash(&creds.password)?;
    let id = match sqlx::query_scalar::<_, Uuid>(
        "INSERT INTO users (email, password_hash) VALUES ($1::citext, $2) RETURNING id",
    )
    .bind(&email)
    .bind(&hash)
    .fetch_one(&st.pool)
    .await
    {
        Ok(id) => id,
        Err(sqlx::Error::Database(e)) if e.is_unique_violation() => {
            return Err(AppError::Conflict("email already registered".into()));
        }
        Err(e) => return Err(e.into()),
    };
    let token = session::create(&st, id).await?;
    Ok(with_session_cookie(&st, &token, StatusCode::CREATED, user_json(id, &email)))
}

pub async fn login(
    State(st): State<AppState>,
    Json(creds): Json<Credentials>,
) -> Result<Response, AppError> {
    let email = creds.email.trim().to_lowercase();
    let row = sqlx::query_as::<_, (Uuid, String)>(
        "SELECT id, password_hash FROM users WHERE email = $1::citext",
    )
    .bind(&email)
    .fetch_optional(&st.pool)
    .await?;

    // Verify against a dummy hash on miss so timing doesn't reveal account existence.
    const DUMMY: &str = "$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    let ok = match &row {
        Some((_, hash)) => password::verify(&creds.password, hash),
        None => {
            password::verify(&creds.password, DUMMY);
            false
        }
    };
    if !ok {
        return Err(AppError::Unauthorized);
    }
    let (id, _) = row.unwrap();
    let token = session::create(&st, id).await?;
    Ok(with_session_cookie(&st, &token, StatusCode::OK, user_json(id, &email)))
}

pub async fn logout(State(st): State<AppState>, headers: HeaderMap) -> Result<Response, AppError> {
    if let Some(token) = session::cookie_value(&headers) {
        session::destroy(&st, &token).await?;
    }
    Ok((
        StatusCode::OK,
        [(SET_COOKIE, session::clear_cookie(st.cfg.cookie_secure))],
        Json(json!({ "ok": true })),
    )
        .into_response())
}

/// Permanently delete the signed-in user and all their data (App Store /
/// Play requirement for account-creating apps).
pub async fn delete_account(
    State(st): State<AppState>,
    user: session::AuthUser,
) -> Result<Response, AppError> {
    let mut tx = st.pool.begin().await?;
    sqlx::query("DELETE FROM user_data WHERE user_id = $1")
        .bind(user.id)
        .execute(&mut *tx)
        .await?;
    sqlx::query("DELETE FROM sessions WHERE user_id = $1")
        .bind(user.id)
        .execute(&mut *tx)
        .await?;
    sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(user.id)
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;
    Ok((
        StatusCode::OK,
        [(SET_COOKIE, session::clear_cookie(st.cfg.cookie_secure))],
        Json(json!({ "ok": true })),
    )
        .into_response())
}

pub async fn me(
    State(st): State<AppState>,
    user: session::AuthUser,
) -> Result<Json<serde_json::Value>, AppError> {
    let created: time::OffsetDateTime =
        sqlx::query_scalar("SELECT created_at FROM users WHERE id = $1")
            .bind(user.id)
            .fetch_one(&st.pool)
            .await?;
    Ok(Json(json!({
        "id": user.id,
        "email": user.email,
        "created_at": created.format(&time::format_description::well_known::Rfc3339)
            .map_err(|e| AppError::Internal(e.to_string()))?,
    })))
}
