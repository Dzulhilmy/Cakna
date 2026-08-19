use axum::extract::{Path, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use serde_json::json;
use time::OffsetDateTime;
use uuid::Uuid;

use crate::auth::AuthUser;
use crate::error::{AppError, Result};
use crate::state::AppState;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct FundingRow {
    pub id: Uuid,
    pub reference: String,
    pub created_at: OffsetDateTime,
    pub submitted_by_id: Option<String>,
    pub submitted_by_name: Option<String>,
    pub submitted_by_role: Option<String>,
    pub submitted_by_branch: Option<String>,
    pub status: String,
    pub reviewed_by_id: Option<String>,
    pub reviewed_by_name: Option<String>,
    pub reviewed_at: Option<OffsetDateTime>,
    pub review_note: String,
    pub cawangan: String,
    pub nama_francaisi: String,
    pub ajk: String,
    pub kluster: String,
    pub nama_program: String,
    pub tarikh: String,
    pub lokasi: String,
    pub penerangan: String,
    pub jumlah_peserta: String,
    pub kategori_penerima: String,
    pub nama_komuniti: String,
    pub jumlah_perbelanjaan: f64,
    pub sumber_dana: String,
    pub pautan_gambar: String,
    pub impak: String,
    pub cadangan: String,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct ReviewLogRow {
    pub id: Uuid,
    pub application_id: Uuid,
    pub stage: String,
    pub decision: String,
    pub by_name: String,
    pub by_role: String,
    pub at: OffsetDateTime,
    pub note: String,
}

const APP_SELECT: &str = "SELECT id, reference, created_at, submitted_by_id, submitted_by_name,
    submitted_by_role, submitted_by_branch, status, reviewed_by_id, reviewed_by_name,
    reviewed_at, review_note, cawangan, nama_francaisi, ajk, kluster, nama_program, tarikh,
    lokasi, penerangan, jumlah_peserta, kategori_penerima, nama_komuniti,
    jumlah_perbelanjaan::float8 as jumlah_perbelanjaan,
    sumber_dana, pautan_gambar, impak, cadangan FROM funding_applications";

fn next_reference(count: i64) -> String {
    let year = time::OffsetDateTime::now_utc().year();
    format!("HCQC/{}/{:04}", year, count + 1)
}

pub async fn list(State(st): State<AppState>, AuthUser(_): AuthUser) -> Result<Json<serde_json::Value>> {
    let apps = sqlx::query_as::<_, FundingRow>(&format!("{APP_SELECT} ORDER BY created_at DESC"))
        .fetch_all(&st.pool)
        .await?;
    let logs = sqlx::query_as::<_, ReviewLogRow>(
        "SELECT id, application_id, stage, decision, by_name, by_role, at, note \
         FROM funding_review_log ORDER BY at",
    )
    .fetch_all(&st.pool)
    .await?;
    Ok(Json(json!({ "apps": apps, "logs": logs })))
}

pub async fn get(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let app = sqlx::query_as::<_, FundingRow>(&format!("{APP_SELECT} WHERE id = $1"))
        .bind(id)
        .fetch_optional(&st.pool)
        .await?
        .ok_or(AppError::NotFound)?;
    let logs = sqlx::query_as::<_, ReviewLogRow>(
        "SELECT id, application_id, stage, decision, by_name, by_role, at, note \
         FROM funding_review_log WHERE application_id = $1 ORDER BY at",
    )
    .bind(id)
    .fetch_all(&st.pool)
    .await?;
    Ok(Json(json!({ "app": app, "logs": logs })))
}

#[derive(Deserialize)]
pub struct CreateInput {
    pub cawangan: String,
    pub nama_francaisi: String,
    pub ajk: String,
    pub kluster: String,
    pub nama_program: String,
    pub tarikh: String,
    pub lokasi: String,
    pub penerangan: String,
    pub jumlah_peserta: String,
    pub kategori_penerima: String,
    pub nama_komuniti: String,
    pub jumlah_perbelanjaan: f64,
    pub sumber_dana: String,
    pub pautan_gambar: String,
    pub impak: String,
    pub cadangan: String,
}

pub async fn create(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Json(body): Json<CreateInput>,
) -> Result<Json<serde_json::Value>> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM funding_applications")
        .fetch_one(&st.pool)
        .await?;
    let reference = next_reference(count);
    let actor_id = actor.id.to_string();

    let app = sqlx::query_as::<_, FundingRow>(
        &format!("INSERT INTO funding_applications
         (reference, submitted_by_id, submitted_by_name, submitted_by_role, submitted_by_branch,
          cawangan, nama_francaisi, ajk, kluster, nama_program, tarikh, lokasi, penerangan,
          jumlah_peserta, kategori_penerima, nama_komuniti, jumlah_perbelanjaan, sumber_dana,
          pautan_gambar, impak, cadangan)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         RETURNING id, reference, created_at, submitted_by_id, submitted_by_name,
           submitted_by_role, submitted_by_branch, status, reviewed_by_id, reviewed_by_name,
           reviewed_at, review_note, cawangan, nama_francaisi, ajk, kluster, nama_program, tarikh,
           lokasi, penerangan, jumlah_peserta, kategori_penerima, nama_komuniti,
           jumlah_perbelanjaan::float8 as jumlah_perbelanjaan,
           sumber_dana, pautan_gambar, impak, cadangan"),
    )
    .bind(&reference)
    .bind(&actor_id)
    .bind(&actor.name)
    .bind(&actor.role)
    .bind(&actor.branch)
    .bind(&body.cawangan)
    .bind(&body.nama_francaisi)
    .bind(&body.ajk)
    .bind(&body.kluster)
    .bind(&body.nama_program)
    .bind(&body.tarikh)
    .bind(&body.lokasi)
    .bind(&body.penerangan)
    .bind(&body.jumlah_peserta)
    .bind(&body.kategori_penerima)
    .bind(&body.nama_komuniti)
    .bind(body.jumlah_perbelanjaan)
    .bind(&body.sumber_dana)
    .bind(&body.pautan_gambar)
    .bind(&body.impak)
    .bind(&body.cadangan)
    .fetch_one(&st.pool)
    .await?;

    sqlx::query(
        "INSERT INTO funding_review_log (application_id, stage, decision, by_name, by_role, note)
         VALUES ($1, 'submit', 'submitted', $2, $3, '')",
    )
    .bind(app.id)
    .bind(&actor.name)
    .bind(&actor.role)
    .execute(&st.pool)
    .await?;

    Ok(Json(json!({ "app": app })))
}

#[derive(Deserialize)]
pub struct ReviewInput {
    pub decision: String,
    pub note: String,
}

pub async fn review(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<ReviewInput>,
) -> Result<Json<serde_json::Value>> {
    if !["approved", "needs_revision"].contains(&body.decision.as_str()) {
        return Err(AppError::BadRequest("invalid decision".into()));
    }

    let app = sqlx::query_as::<_, FundingRow>(&format!("{APP_SELECT} WHERE id = $1"))
        .bind(id)
        .fetch_optional(&st.pool)
        .await?
        .ok_or(AppError::NotFound)?;

    let stage = match app.status.as_str() {
        "pending_dept" => "dept",
        "pending_cakna" => "cakna",
        _ => return Err(AppError::BadRequest("application is not reviewable".into())),
    };

    let allowed = match stage {
        "cakna" => actor.role == "admin",
        _ => actor.role == "reviewer" || actor.role == "admin",
    };
    if !allowed {
        return Err(AppError::Forbidden);
    }

    let new_status = if body.decision == "needs_revision" {
        "needs_revision"
    } else if stage == "dept" {
        "pending_cakna"
    } else {
        "approved"
    };

    sqlx::query(
        "UPDATE funding_applications SET status=$1, reviewed_by_id=$2, reviewed_by_name=$3,
         reviewed_at=now(), review_note=$4 WHERE id=$5",
    )
    .bind(new_status)
    .bind(actor.id.to_string())
    .bind(&actor.name)
    .bind(&body.note)
    .bind(id)
    .execute(&st.pool)
    .await?;

    sqlx::query(
        "INSERT INTO funding_review_log (application_id, stage, decision, by_name, by_role, note)
         VALUES ($1, $2, $3, $4, $5, $6)",
    )
    .bind(id)
    .bind(stage)
    .bind(&body.decision)
    .bind(&actor.name)
    .bind(&actor.role)
    .bind(&body.note)
    .execute(&st.pool)
    .await?;

    Ok(Json(json!({ "ok": true, "status": new_status })))
}

pub async fn update(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<CreateInput>,
) -> Result<Json<serde_json::Value>> {
    if actor.role != "admin" {
        return Err(AppError::Forbidden);
    }
    let app = sqlx::query_as::<_, FundingRow>(
        &format!("UPDATE funding_applications SET
         cawangan=$1, nama_francaisi=$2, ajk=$3, kluster=$4, nama_program=$5,
         tarikh=$6, lokasi=$7, penerangan=$8, jumlah_peserta=$9,
         kategori_penerima=$10, nama_komuniti=$11, jumlah_perbelanjaan=$12,
         sumber_dana=$13, pautan_gambar=$14, impak=$15, cadangan=$16
         WHERE id=$17
         RETURNING id, reference, created_at, submitted_by_id, submitted_by_name,
           submitted_by_role, submitted_by_branch, status, reviewed_by_id, reviewed_by_name,
           reviewed_at, review_note, cawangan, nama_francaisi, ajk, kluster, nama_program, tarikh,
           lokasi, penerangan, jumlah_peserta, kategori_penerima, nama_komuniti,
           jumlah_perbelanjaan::float8 as jumlah_perbelanjaan,
           sumber_dana, pautan_gambar, impak, cadangan"),
    )
    .bind(&body.cawangan)
    .bind(&body.nama_francaisi)
    .bind(&body.ajk)
    .bind(&body.kluster)
    .bind(&body.nama_program)
    .bind(&body.tarikh)
    .bind(&body.lokasi)
    .bind(&body.penerangan)
    .bind(&body.jumlah_peserta)
    .bind(&body.kategori_penerima)
    .bind(&body.nama_komuniti)
    .bind(body.jumlah_perbelanjaan)
    .bind(&body.sumber_dana)
    .bind(&body.pautan_gambar)
    .bind(&body.impak)
    .bind(&body.cadangan)
    .bind(id)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(json!({ "app": app })))
}

pub async fn delete(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    if actor.role != "admin" {
        return Err(AppError::Forbidden);
    }
    let rows = sqlx::query("DELETE FROM funding_applications WHERE id = $1")
        .bind(id)
        .execute(&st.pool)
        .await?
        .rows_affected();
    if rows == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(json!({ "ok": true })))
}

pub async fn resubmit(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let app = sqlx::query_as::<_, FundingRow>(&format!("{APP_SELECT} WHERE id = $1"))
        .bind(id)
        .fetch_optional(&st.pool)
        .await?
        .ok_or(AppError::NotFound)?;

    if app.status != "needs_revision" {
        return Err(AppError::BadRequest("application is not in needs_revision state".into()));
    }

    let is_owner = app.submitted_by_id.as_deref() == Some(actor.id.to_string().as_str());
    if !is_owner && actor.role != "admin" {
        return Err(AppError::Forbidden);
    }

    sqlx::query("UPDATE funding_applications SET status='pending_dept' WHERE id=$1")
        .bind(id)
        .execute(&st.pool)
        .await?;

    sqlx::query(
        "INSERT INTO funding_review_log (application_id, stage, decision, by_name, by_role, note)
         VALUES ($1, 'submit', 'resubmitted', $2, $3, '')",
    )
    .bind(id)
    .bind(&actor.name)
    .bind(&actor.role)
    .execute(&st.pool)
    .await?;

    Ok(Json(json!({ "ok": true })))
}
