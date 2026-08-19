use axum::extract::State;
use axum::Json;
use serde_json::Value;

use crate::auth::{AuthUser, HubSecret};
use crate::error::Result;
use crate::state::AppState;

pub async fn get(State(st): State<AppState>, HubSecret: HubSecret) -> Result<Json<Value>> {
    let row: Option<(Value,)> = sqlx::query_as("SELECT content FROM site_content WHERE id = 1")
        .fetch_optional(&st.pool)
        .await?;
    Ok(Json(row.map(|r| r.0).unwrap_or(Value::Object(Default::default()))))
}

pub async fn put(
    State(st): State<AppState>,
    AuthUser(_): AuthUser,
    Json(body): Json<Value>,
) -> Result<Json<serde_json::Value>> {
    sqlx::query(
        "INSERT INTO site_content (id, content) VALUES (1, $1)
         ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content",
    )
    .bind(&body)
    .execute(&st.pool)
    .await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}
