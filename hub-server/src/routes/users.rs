use axum::extract::{Path, State};
use axum::http::HeaderMap;
use axum::Json;
use serde::Deserialize;
use uuid::Uuid;

use crate::auth::{resolve_hub_user, AuthUser, HubUser};
use crate::error::{AppError, Result};
use crate::state::AppState;

pub async fn list(State(st): State<AppState>, AuthUser(_): AuthUser) -> Result<Json<Vec<HubUser>>> {
    let users = sqlx::query_as::<_, HubUser>(
        "SELECT id, email, name, role, branch, status, created_at
         FROM hub_users ORDER BY created_at",
    )
    .fetch_all(&st.pool)
    .await?;
    Ok(Json(users))
}

#[derive(Deserialize)]
pub struct SetRole {
    pub role: String,
}

pub async fn set_role(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<SetRole>,
) -> Result<Json<HubUser>> {
    let valid = ["admin", "reviewer", "pic", "member", "franchisee"];
    if !valid.contains(&body.role.as_str()) {
        return Err(AppError::BadRequest("invalid role".into()));
    }
    let u = sqlx::query_as::<_, HubUser>(
        "UPDATE hub_users SET role = $1 WHERE id = $2
         RETURNING id, email, name, role, branch, status, created_at",
    )
    .bind(&body.role)
    .bind(id)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(u))
}

#[derive(Deserialize)]
pub struct SetStatus {
    pub status: String,
}

pub async fn set_status(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<SetStatus>,
) -> Result<Json<HubUser>> {
    if !["active", "pending"].contains(&body.status.as_str()) {
        return Err(AppError::BadRequest("invalid status".into()));
    }
    let u = sqlx::query_as::<_, HubUser>(
        "UPDATE hub_users SET status = $1 WHERE id = $2
         RETURNING id, email, name, role, branch, status, created_at",
    )
    .bind(&body.status)
    .bind(id)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(u))
}

#[derive(Deserialize)]
pub struct SetDepartment {
    pub department: String,
}

pub async fn set_department(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<SetDepartment>,
) -> Result<Json<HubUser>> {
    let valid = [
        "Finance", "MKTG", "MI", "BOD", "FO", "IT", "QCXIS", "RBE", "Training", "Logistic",
        "Cakna", "",
    ];
    if !valid.contains(&body.department.as_str()) {
        return Err(AppError::BadRequest("invalid department".into()));
    }
    let u = sqlx::query_as::<_, HubUser>(
        "UPDATE hub_users SET branch = $1 WHERE id = $2
         RETURNING id, email, name, role, branch, status, created_at",
    )
    .bind(&body.department)
    .bind(id)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(u))
}

// Called by SvelteKit to upsert a Hub user from a Cakna-verified identity.
// Only requires X-Hub-Secret (no user headers needed — we're resolving the user).
#[derive(Deserialize)]
pub struct ResolveInput {
    pub email: String,
    pub name: String,
}

pub async fn resolve(
    State(st): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<ResolveInput>,
) -> Result<Json<HubUser>> {
    if !st.cfg.internal_secret.is_empty() {
        let secret = headers
            .get("x-hub-secret")
            .and_then(|v| v.to_str().ok())
            .unwrap_or_default();
        if secret != st.cfg.internal_secret {
            return Err(AppError::Unauthorized);
        }
    }
    let user = resolve_hub_user(&st.pool, &body.email, &body.name).await?;
    Ok(Json(user))
}

pub async fn delete(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let rows = sqlx::query("DELETE FROM hub_users WHERE id = $1")
        .bind(id)
        .execute(&st.pool)
        .await?
        .rows_affected();
    if rows == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(serde_json::json!({ "ok": true })))
}
