use axum::extract::{Path, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

use crate::auth::AuthUser;
use crate::error::{AppError, Result};
use crate::state::AppState;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct NotificationRow {
    pub id: Uuid,
    pub created_at: OffsetDateTime,
    #[sqlx(rename = "type")]
    pub notification_type: String,
    pub title: String,
    pub content: String,
    pub callout: String,
    pub audience: String,
    pub created_by_id: Option<String>,
    pub created_by_name: Option<String>,
}

pub async fn list(State(st): State<AppState>, AuthUser(_): AuthUser) -> Result<Json<Vec<NotificationRow>>> {
    let rows = sqlx::query_as::<_, NotificationRow>(
        "SELECT id, created_at, type, title, content, callout, audience,
         created_by_id, created_by_name FROM notifications ORDER BY created_at DESC",
    )
    .fetch_all(&st.pool)
    .await?;
    Ok(Json(rows))
}

#[derive(Deserialize)]
pub struct NotificationInput {
    #[serde(rename = "type")]
    pub notification_type: String,
    pub title: String,
    pub content: String,
    pub callout: String,
    pub audience: String,
}

pub async fn create(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Json(body): Json<NotificationInput>,
) -> Result<Json<NotificationRow>> {
    if actor.role != "admin" {
        return Err(AppError::Forbidden);
    }
    let actor_id = actor.id.to_string();
    let row = sqlx::query_as::<_, NotificationRow>(
        "INSERT INTO notifications (type, title, content, callout, audience,
         created_by_id, created_by_name)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id, created_at, type, title, content, callout, audience,
           created_by_id, created_by_name",
    )
    .bind(&body.notification_type)
    .bind(&body.title)
    .bind(&body.content)
    .bind(&body.callout)
    .bind(&body.audience)
    .bind(&actor_id)
    .bind(&actor.name)
    .fetch_one(&st.pool)
    .await?;
    // Fire-and-forget Telegram push; never block or fail the HTTP response.
    if let (Some(token), Some(chat_id)) = (
        &st.cfg.telegram_bot_token,
        &st.cfg.telegram_chat_id,
    ) {
        let http = st.http.clone();
        let token = token.clone();
        let chat_id = chat_id.clone();
        let row_clone = NotificationRow {
            id: row.id,
            created_at: row.created_at,
            notification_type: row.notification_type.clone(),
            title: row.title.clone(),
            content: row.content.clone(),
            callout: row.callout.clone(),
            audience: row.audience.clone(),
            created_by_id: row.created_by_id.clone(),
            created_by_name: row.created_by_name.clone(),
        };
        tokio::spawn(async move {
            crate::telegram::send_notification(&http, &token, &chat_id, &row_clone).await;
        });
    }

    Ok(Json(row))
}

pub async fn delete(
    State(st): State<AppState>,
    AuthUser(actor): AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    if actor.role != "admin" {
        return Err(AppError::Forbidden);
    }
    let rows = sqlx::query("DELETE FROM notifications WHERE id = $1")
        .bind(id)
        .execute(&st.pool)
        .await?
        .rows_affected();
    if rows == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(serde_json::json!({ "ok": true })))
}
