use axum::body::Bytes;
use axum::extract::{Multipart, Query, State};
use axum::Json;
use serde::Deserialize;
use std::path::PathBuf;
use tokio::fs;

use crate::auth::AuthUser;
use crate::error::{AppError, Result};
use crate::state::AppState;

fn uploads_dir(st: &crate::state::AppState) -> PathBuf {
    PathBuf::from(&st.cfg.uploads_dir)
}

fn is_image(name: &str) -> bool {
    matches!(
        name.rsplit('.').next().unwrap_or("").to_ascii_lowercase().as_str(),
        "jpg" | "jpeg" | "png" | "gif" | "webp" | "svg"
    )
}

fn safe_filename(raw: &str) -> Option<String> {
    let name = raw
        .split(['/', '\\'])
        .last()?
        .chars()
        .filter(|c| c.is_alphanumeric() || "-_.".contains(*c))
        .collect::<String>();
    if name.is_empty() || !is_image(&name) { None } else { Some(name) }
}

pub async fn list(State(st): State<AppState>, AuthUser(_): AuthUser) -> Result<Json<Vec<String>>> {
    let dir = uploads_dir(&st);
    let mut entries = match fs::read_dir(&dir).await {
        Ok(e) => e,
        Err(_) => return Ok(Json(vec![])),
    };
    let mut files = Vec::new();
    while let Ok(Some(entry)) = entries.next_entry().await {
        if let Some(name) = entry.file_name().to_str().map(str::to_string) {
            if is_image(&name) {
                files.push(format!("/uploads/{name}"));
            }
        }
    }
    files.sort();
    Ok(Json(files))
}

pub async fn upload(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    mut multipart: Multipart,
) -> Result<Json<serde_json::Value>> {
    let dir = uploads_dir(&st);
    fs::create_dir_all(&dir).await?;

    let mut saved: Vec<String> = Vec::new();

    while let Ok(Some(field)) = multipart.next_field().await {
        let raw_name = field.file_name().unwrap_or("upload").to_string();
        let filename = safe_filename(&raw_name)
            .ok_or_else(|| AppError::BadRequest("unsupported file type".into()))?;

        let data: Bytes = field
            .bytes()
            .await
            .map_err(|e| AppError::BadRequest(e.to_string()))?;
        let path = dir.join(&filename);
        fs::write(&path, &data).await?;
        saved.push(format!("/uploads/{filename}"));
    }

    if saved.is_empty() {
        return Err(AppError::BadRequest("no file received".into()));
    }
    Ok(Json(serde_json::json!({ "urls": saved })))
}

#[derive(Deserialize)]
pub struct DeleteQuery {
    pub filename: String,
}

pub async fn delete(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Query(q): Query<DeleteQuery>,
) -> Result<Json<serde_json::Value>> {
    let filename = safe_filename(&q.filename)
        .ok_or_else(|| AppError::BadRequest("invalid filename".into()))?;
    let path = uploads_dir(&st).join(filename);
    match fs::remove_file(&path).await {
        Ok(_) => Ok(Json(serde_json::json!({ "ok": true }))),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Err(AppError::NotFound),
        Err(e) => Err(AppError::from(e)),
    }
}
