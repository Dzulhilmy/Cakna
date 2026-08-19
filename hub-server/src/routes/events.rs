use axum::extract::{Path, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

use crate::auth::AuthUser;
use crate::error::{AppError, Result};
use crate::state::AppState;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct EventRow {
    pub id: Uuid,
    pub created_at: OffsetDateTime,
    pub submitted_by_id: Option<String>,
    pub submitted_by_name: Option<String>,
    pub submitted_by_role: Option<String>,
    pub submitted_by_branch: Option<String>,
    pub title: String,
    pub kluster: String,
    pub tarikh: String,
    pub lokasi: String,
    pub anjuran: String,
    pub jumlah_peserta: String,
    pub penerangan: String,
    pub images: Vec<String>,
}

const SEL: &str = "SELECT id, created_at, submitted_by_id, submitted_by_name, submitted_by_role, \
    submitted_by_branch, title, kluster, tarikh, lokasi, anjuran, jumlah_peserta, penerangan, images \
    FROM events";

pub async fn list(State(st): State<AppState>, AuthUser(_): AuthUser) -> Result<Json<Vec<EventRow>>> {
    let rows = sqlx::query_as::<_, EventRow>(&format!("{SEL} ORDER BY created_at DESC"))
        .fetch_all(&st.pool)
        .await?;
    Ok(Json(rows))
}

pub async fn get(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<EventRow>> {
    sqlx::query_as::<_, EventRow>(&format!("{SEL} WHERE id = $1"))
        .bind(id)
        .fetch_optional(&st.pool)
        .await?
        .map(Json)
        .ok_or(AppError::NotFound)
}

#[derive(Deserialize)]
pub struct EventInput {
    pub title: String,
    pub kluster: String,
    pub tarikh: String,
    pub lokasi: String,
    pub anjuran: String,
    pub jumlah_peserta: String,
    pub penerangan: String,
    pub images: Vec<String>,
}

pub async fn create(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Json(body): Json<EventInput>,
) -> Result<Json<EventRow>> {
    let actor_id = actor.id.to_string();
    let row = sqlx::query_as::<_, EventRow>(
        "INSERT INTO events (submitted_by_id, submitted_by_name, submitted_by_role,
         submitted_by_branch, title, kluster, tarikh, lokasi, anjuran, jumlah_peserta,
         penerangan, images)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id, created_at, submitted_by_id, submitted_by_name, submitted_by_role,
           submitted_by_branch, title, kluster, tarikh, lokasi, anjuran, jumlah_peserta,
           penerangan, images",
    )
    .bind(&actor_id)
    .bind(&actor.name)
    .bind(&actor.role)
    .bind(&actor.branch)
    .bind(&body.title)
    .bind(&body.kluster)
    .bind(&body.tarikh)
    .bind(&body.lokasi)
    .bind(&body.anjuran)
    .bind(&body.jumlah_peserta)
    .bind(&body.penerangan)
    .bind(&body.images)
    .fetch_one(&st.pool)
    .await?;
    Ok(Json(row))
}

pub async fn update(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<EventInput>,
) -> Result<Json<EventRow>> {
    let row = sqlx::query_as::<_, EventRow>(
        "UPDATE events SET title=$1, kluster=$2, tarikh=$3, lokasi=$4, anjuran=$5,
         jumlah_peserta=$6, penerangan=$7, images=$8 WHERE id=$9
         RETURNING id, created_at, submitted_by_id, submitted_by_name, submitted_by_role,
           submitted_by_branch, title, kluster, tarikh, lokasi, anjuran, jumlah_peserta,
           penerangan, images",
    )
    .bind(&body.title)
    .bind(&body.kluster)
    .bind(&body.tarikh)
    .bind(&body.lokasi)
    .bind(&body.anjuran)
    .bind(&body.jumlah_peserta)
    .bind(&body.penerangan)
    .bind(&body.images)
    .bind(id)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(row))
}

pub async fn delete(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let rows = sqlx::query("DELETE FROM events WHERE id = $1")
        .bind(id)
        .execute(&st.pool)
        .await?
        .rows_affected();
    if rows == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(serde_json::json!({ "ok": true })))
}
