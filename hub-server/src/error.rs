use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("not found")]
    NotFound,
    #[error("bad request: {0}")]
    BadRequest(String),
    #[error("forbidden")]
    Forbidden,
    #[error("unauthorized")]
    Unauthorized,
    #[error("conflict: {0}")]
    Conflict(String),
    #[error("database: {0}")]
    Db(#[from] sqlx::Error),
    #[error("internal: {0}")]
    Internal(String),
    #[error("io: {0}")]
    Io(#[from] std::io::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg) = match &self {
            AppError::NotFound => (StatusCode::NOT_FOUND, self.to_string()),
            AppError::BadRequest(m) => (StatusCode::BAD_REQUEST, m.clone()),
            AppError::Forbidden => (StatusCode::FORBIDDEN, self.to_string()),
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, self.to_string()),
            AppError::Conflict(m) => (StatusCode::CONFLICT, m.clone()),
            AppError::Db(e) => {
                tracing::error!("db: {e}");
                (StatusCode::INTERNAL_SERVER_ERROR, "database error".into())
            }
            AppError::Internal(m) => {
                tracing::error!("internal: {m}");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".into())
            }
            AppError::Io(e) => {
                tracing::error!("io: {e}");
                (StatusCode::INTERNAL_SERVER_ERROR, "io error".into())
            }
        };
        (status, Json(json!({ "error": msg }))).into_response()
    }
}

pub type Result<T> = std::result::Result<T, AppError>;
