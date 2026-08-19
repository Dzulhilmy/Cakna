use axum::extract::{Path, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use slug::slugify;
use time::OffsetDateTime;

use crate::auth::{AuthUser, HubSecret};
use crate::error::{AppError, Result};
use crate::state::AppState;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct ProgramRow {
    pub id: String,
    pub core_id: String,
    pub name: String,
    pub slug: String,
    pub description: String,
    pub image: String,
    pub created_at: OffsetDateTime,
    pub updated_at: OffsetDateTime,
}

const SEL: &str = "SELECT id, core_id, name, slug, description, image, created_at, updated_at \
    FROM programs";

// Static seed data mirroring Cakna Hub cores.ts
const SEED: &[(&str, &[&str])] = &[
    ("assist", &["A Million Smiles"]),
    ("biz", &["MKT Blast", "HSC"]),
    ("circle", &["BMI", "See-Heart"]),
    ("digital", &["Cakna App", "Edu App", "Biz App"]),
    ("edu", &["Edu Maths", "Edu Care", "Edu Lab"]),
    ("future", &["Leadership Program", "SPM Seminar"]),
    ("green", &["Go Green", "Green Cycle", "Green Light"]),
];

pub async fn list(State(st): State<AppState>, HubSecret: HubSecret) -> Result<Json<Vec<ProgramRow>>> {
    let rows = sqlx::query_as::<_, ProgramRow>(&format!("{SEL} ORDER BY core_id, name"))
        .fetch_all(&st.pool)
        .await?;
    Ok(Json(rows))
}

pub async fn seed(State(st): State<AppState>, AuthUser(_): AuthUser) -> Result<Json<serde_json::Value>> {
    let mut inserted = 0u64;
    for (core_id, names) in SEED {
        for name in *names {
            let s = slugify(name);
            let id = format!("{core_id}--{s}");
            let rows = sqlx::query(
                "INSERT INTO programs (id, core_id, name, slug) VALUES ($1,$2,$3,$4)
                 ON CONFLICT (id) DO NOTHING",
            )
            .bind(&id)
            .bind(core_id)
            .bind(name)
            .bind(&s)
            .execute(&st.pool)
            .await?
            .rows_affected();
            inserted += rows;
        }
    }
    Ok(Json(serde_json::json!({ "inserted": inserted })))
}

#[derive(Deserialize)]
pub struct ProgramInput {
    pub core_id: String,
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
}

pub async fn create(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Json(body): Json<ProgramInput>,
) -> Result<Json<ProgramRow>> {
    let name = body.name.trim().to_string();
    if name.is_empty() {
        return Err(AppError::BadRequest("name is required".into()));
    }
    let s = slugify(&name);
    let id = format!("{}--{}", body.core_id, s);
    let row = sqlx::query_as::<_, ProgramRow>(
        "INSERT INTO programs (id, core_id, name, slug, description, image)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO NOTHING
         RETURNING id, core_id, name, slug, description, image, created_at, updated_at",
    )
    .bind(&id)
    .bind(&body.core_id)
    .bind(&name)
    .bind(&s)
    .bind(body.description.as_deref().unwrap_or(""))
    .bind(body.image.as_deref().unwrap_or(""))
    .fetch_optional(&st.pool)
    .await?
    .ok_or_else(|| AppError::Conflict("a program with this name already exists in this core".into()))?;
    Ok(Json(row))
}

pub async fn update(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<String>,
    Json(body): Json<ProgramInput>,
) -> Result<Json<ProgramRow>> {
    let name = body.name.trim().to_string();
    if name.is_empty() {
        return Err(AppError::BadRequest("name is required".into()));
    }
    let s = slugify(&name);
    let row = sqlx::query_as::<_, ProgramRow>(
        "UPDATE programs SET core_id=$1, name=$2, slug=$3, description=$4, image=$5,
         updated_at=now() WHERE id=$6
         RETURNING id, core_id, name, slug, description, image, created_at, updated_at",
    )
    .bind(&body.core_id)
    .bind(&name)
    .bind(&s)
    .bind(body.description.as_deref().unwrap_or(""))
    .bind(body.image.as_deref().unwrap_or(""))
    .bind(&id)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(row))
}

pub async fn delete(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>> {
    let rows = sqlx::query("DELETE FROM programs WHERE id = $1")
        .bind(&id)
        .execute(&st.pool)
        .await?
        .rows_affected();
    if rows == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(serde_json::json!({ "ok": true })))
}
