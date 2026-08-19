use axum::extract::{Path, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

use crate::auth::AuthUser;
use crate::error::{AppError, Result};
use crate::state::AppState;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct NoticeRow {
    pub id: Uuid,
    pub created_at: OffsetDateTime,
    pub audience: String,
    pub user_id: Option<Uuid>,
    pub kind: String,
    pub title: String,
    pub body: String,
    pub href: Option<String>,
    pub read_by: Vec<Uuid>,
}

fn audience_for_role(role: &str) -> &'static str {
    match role {
        "admin" => "cakna",
        "reviewer" | "pic" => "dept",
        _ => "franchisee",
    }
}

pub async fn list_for_user(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
) -> Result<Json<Vec<NoticeRow>>> {
    let audience = audience_for_role(&actor.role);
    let rows = if audience == "franchisee" {
        sqlx::query_as::<_, NoticeRow>(
            "SELECT id, created_at, audience, user_id, kind, title, body, href, read_by
             FROM notices
             WHERE audience = $1 AND (user_id IS NULL OR user_id = $2)
             ORDER BY created_at DESC",
        )
        .bind(audience)
        .bind(actor.id)
        .fetch_all(&st.pool)
        .await?
    } else {
        sqlx::query_as::<_, NoticeRow>(
            "SELECT id, created_at, audience, user_id, kind, title, body, href, read_by
             FROM notices WHERE audience = $1 ORDER BY created_at DESC",
        )
        .bind(audience)
        .fetch_all(&st.pool)
        .await?
    };
    Ok(Json(rows))
}

pub async fn mark_read(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let rows = sqlx::query(
        "UPDATE notices SET read_by = array_append(read_by, $1)
         WHERE id = $2 AND NOT ($1 = ANY(read_by))",
    )
    .bind(actor.id)
    .bind(id)
    .execute(&st.pool)
    .await?
    .rows_affected();
    if rows == 0 {
        // Already read or not found — either way return ok
    }
    Ok(Json(serde_json::json!({ "ok": true })))
}

pub async fn mark_all_read(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
) -> Result<Json<serde_json::Value>> {
    let audience = audience_for_role(&actor.role);
    if audience == "franchisee" {
        sqlx::query(
            "UPDATE notices SET read_by = array_append(read_by, $1)
             WHERE audience = 'franchisee'
             AND (user_id IS NULL OR user_id = $2)
             AND NOT ($1 = ANY(read_by))",
        )
        .bind(actor.id)
        .bind(actor.id)
        .execute(&st.pool)
        .await?;
    } else {
        sqlx::query(
            "UPDATE notices SET read_by = array_append(read_by, $1)
             WHERE audience = $2 AND NOT ($1 = ANY(read_by))",
        )
        .bind(actor.id)
        .bind(audience)
        .execute(&st.pool)
        .await?;
    }
    Ok(Json(serde_json::json!({ "ok": true })))
}

// Internal helper — called by other route handlers to create workflow notices.
#[derive(Deserialize)]
pub struct NoticeInput {
    pub audience: String,
    pub user_id: Option<Uuid>,
    pub kind: String,
    pub title: String,
    pub body: String,
    pub href: Option<String>,
}

pub async fn add_internal(pool: &sqlx::PgPool, input: &NoticeInput) -> Result<()> {
    sqlx::query(
        "INSERT INTO notices (audience, user_id, kind, title, body, href)
         VALUES ($1,$2,$3,$4,$5,$6)",
    )
    .bind(&input.audience)
    .bind(input.user_id)
    .bind(&input.kind)
    .bind(&input.title)
    .bind(&input.body)
    .bind(&input.href)
    .execute(pool)
    .await?;
    Ok(())
}

pub async fn add(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Json(body): Json<NoticeInput>,
) -> Result<Json<serde_json::Value>> {
    if actor.role != "admin" {
        return Err(AppError::Forbidden);
    }
    add_internal(&st.pool, &body).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

pub async fn delete(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    if actor.role != "admin" {
        return Err(AppError::Forbidden);
    }
    let rows = sqlx::query("DELETE FROM notices WHERE id = $1")
        .bind(id)
        .execute(&st.pool)
        .await?
        .rows_affected();
    if rows == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(serde_json::json!({ "ok": true })))
}
