use super::DATA_KEYS;
use crate::auth::session::AuthUser;
use crate::error::AppError;
use crate::state::AppState;
use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use serde_json::{json, Map, Value};
use sqlx::FromRow;
use time::format_description::well_known::Rfc3339;
use time::OffsetDateTime;

#[derive(FromRow)]
struct Row {
    key: String,
    value: Value,
    updated_at: OffsetDateTime,
}

fn rfc3339(t: OffsetDateTime) -> String {
    t.format(&Rfc3339).unwrap_or_default()
}

#[derive(Deserialize)]
pub struct SinceParam {
    since: Option<String>,
}

pub async fn get_all(
    State(st): State<AppState>,
    user: AuthUser,
    Query(p): Query<SinceParam>,
) -> Result<Json<Value>, AppError> {
    let since = match &p.since {
        Some(s) => Some(
            OffsetDateTime::parse(s, &Rfc3339)
                .map_err(|_| AppError::BadRequest("invalid since timestamp".into()))?,
        ),
        None => None,
    };
    let rows: Vec<Row> = sqlx::query_as(
        "SELECT key, value, updated_at FROM user_data \
         WHERE user_id = $1 AND ($2::timestamptz IS NULL OR updated_at > $2)",
    )
    .bind(user.id)
    .bind(since)
    .fetch_all(&st.pool)
    .await?;

    let mut keys = Map::new();
    for r in rows {
        keys.insert(
            r.key,
            json!({ "value": r.value, "updated_at": rfc3339(r.updated_at) }),
        );
    }
    Ok(Json(json!({ "keys": keys })))
}

async fn upsert(
    st: &AppState,
    user_id: uuid::Uuid,
    key: &str,
    value: &Value,
) -> Result<OffsetDateTime, AppError> {
    if !DATA_KEYS.contains(&key) {
        return Err(AppError::BadRequest(format!("unknown key: {key}")));
    }
    Ok(sqlx::query_scalar(
        "INSERT INTO user_data (user_id, key, value, updated_at) VALUES ($1, $2, $3, now()) \
         ON CONFLICT (user_id, key) DO UPDATE SET value = $3, updated_at = now() \
         RETURNING updated_at",
    )
    .bind(user_id)
    .bind(key)
    .bind(value)
    .fetch_one(&st.pool)
    .await?)
}

pub async fn put_key(
    State(st): State<AppState>,
    user: AuthUser,
    Path(key): Path<String>,
    Json(value): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let updated = upsert(&st, user.id, &key, &value).await?;
    Ok(Json(json!({ "key": key, "updated_at": rfc3339(updated) })))
}

#[derive(Deserialize)]
pub struct BatchItem {
    key: String,
    value: Value,
}

pub async fn put_batch(
    State(st): State<AppState>,
    user: AuthUser,
    Json(items): Json<Vec<BatchItem>>,
) -> Result<Json<Value>, AppError> {
    for item in &items {
        if !DATA_KEYS.contains(&item.key.as_str()) {
            return Err(AppError::BadRequest(format!("unknown key: {}", item.key)));
        }
    }
    let mut tx = st.pool.begin().await?;
    let mut out = Map::new();
    for item in &items {
        let updated: OffsetDateTime = sqlx::query_scalar(
            "INSERT INTO user_data (user_id, key, value, updated_at) VALUES ($1, $2, $3, now()) \
             ON CONFLICT (user_id, key) DO UPDATE SET value = $3, updated_at = now() \
             RETURNING updated_at",
        )
        .bind(user.id)
        .bind(&item.key)
        .bind(&item.value)
        .fetch_one(&mut *tx)
        .await?;
        out.insert(item.key.clone(), Value::String(rfc3339(updated)));
    }
    tx.commit().await?;
    Ok(Json(json!({ "updated": out })))
}

/// Sample-compatible backup envelope (rebranded).
pub async fn export(
    State(st): State<AppState>,
    user: AuthUser,
) -> Result<Json<Value>, AppError> {
    let rows: Vec<Row> = sqlx::query_as(
        "SELECT key, value, updated_at FROM user_data WHERE user_id = $1",
    )
    .bind(user.id)
    .fetch_all(&st.pool)
    .await?;
    let mut out = Map::new();
    out.insert("app".into(), json!("cakna"));
    out.insert("v".into(), json!(1));
    out.insert("exported".into(), json!(rfc3339(OffsetDateTime::now_utc())));
    for key in DATA_KEYS {
        out.insert(key.into(), Value::Null);
    }
    for r in rows {
        out.insert(r.key, r.value);
    }
    Ok(Json(Value::Object(out)))
}
