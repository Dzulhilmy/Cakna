use axum::extract::{Path, State};
use axum::Json;
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;

use crate::auth::session::AuthUser;
use crate::error::AppError;
use crate::state::AppState;

// ── Public (secret-only) proxies ─────────────────────────────────────────────

pub async fn site(State(st): State<AppState>) -> Json<Value> {
    let raw = proxy_public(&st, "/api/site", serde_json::json!({})).await;
    // Hub API wraps the content as { content: {...} }; mobile consumers expect the
    // inner object directly so they can access fields like csrPage, sectionOrder, etc.
    let content = raw
        .get("content")
        .and_then(|v| v.as_object())
        .map(|o| Value::Object(o.clone()))
        .unwrap_or(raw);
    Json(content)
}

pub async fn programs(State(st): State<AppState>) -> Json<Value> {
    Json(proxy_public(&st, "/api/programs", serde_json::json!([])).await)
}

async fn proxy_public(st: &AppState, path: &str, fallback: Value) -> Value {
    if st.cfg.hub_url.is_empty() {
        return fallback;
    }
    let url = format!("{}{}", st.cfg.hub_url, path);
    let resp = match st
        .http
        .get(&url)
        .header("X-Hub-Secret", &st.cfg.hub_secret)
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => {
            tracing::warn!("hub proxy {path} request failed: {e}");
            return fallback;
        }
    };
    if !resp.status().is_success() {
        tracing::warn!("hub proxy {path} returned {}", resp.status());
        return fallback;
    }
    match resp.json::<Value>().await {
        Ok(v) => v,
        Err(e) => {
            tracing::warn!("hub proxy {path} parse error: {e}");
            fallback
        }
    }
}

// ── Hub user resolution ───────────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
struct HubUser {
    id: Uuid,
    email: String,
    name: String,
    role: String,
    branch: String,
    status: String,
}

/// Find-or-create a hub_user for the given Cakna identity.
async fn resolve_hub(
    st: &AppState,
    email: &str,
    name: &str,
) -> Result<HubUser, AppError> {
    if st.cfg.hub_url.is_empty() {
        return Err(AppError::Upstream("hub not configured".into()));
    }
    let url = format!("{}/api/users/resolve", st.cfg.hub_url);
    let resp = st
        .http
        .post(&url)
        .header("X-Hub-Secret", &st.cfg.hub_secret)
        .json(&serde_json::json!({ "email": email, "name": name }))
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("hub resolve: {e}")))?;
    if !resp.status().is_success() {
        return Err(AppError::Upstream(format!(
            "hub resolve returned {}",
            resp.status()
        )));
    }
    resp.json::<HubUser>()
        .await
        .map_err(|e| AppError::Upstream(format!("hub resolve parse: {e}")))
}

/// GET hub-server path with authenticated hub-user headers.
async fn hub_get(
    st: &AppState,
    hu: &HubUser,
    path: &str,
) -> Result<Value, AppError> {
    let url = format!("{}{}", st.cfg.hub_url, path);
    let resp = st
        .http
        .get(&url)
        .header("X-Hub-Secret", &st.cfg.hub_secret)
        .header("x-hub-user-id", hu.id.to_string())
        .header("x-hub-user-email", &hu.email)
        .header("x-hub-user-name", &hu.name)
        .header("x-hub-user-role", &hu.role)
        .header("x-hub-user-branch", &hu.branch)
        .header("x-hub-user-status", &hu.status)
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("hub GET {path}: {e}")))?;
    let status = resp.status();
    if !status.is_success() {
        return Err(if status.as_u16() == 404 {
            AppError::NotFound
        } else {
            AppError::Upstream(format!("hub GET {path}: {status}"))
        });
    }
    resp.json::<Value>()
        .await
        .map_err(|e| AppError::Upstream(format!("hub GET {path} parse: {e}")))
}

/// POST hub-server path with authenticated hub-user headers.
async fn hub_post(
    st: &AppState,
    hu: &HubUser,
    path: &str,
    body: Value,
) -> Result<Value, AppError> {
    let url = format!("{}{}", st.cfg.hub_url, path);
    let resp = st
        .http
        .post(&url)
        .header("X-Hub-Secret", &st.cfg.hub_secret)
        .header("x-hub-user-id", hu.id.to_string())
        .header("x-hub-user-email", &hu.email)
        .header("x-hub-user-name", &hu.name)
        .header("x-hub-user-role", &hu.role)
        .header("x-hub-user-branch", &hu.branch)
        .header("x-hub-user-status", &hu.status)
        .json(&body)
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("hub POST {path}: {e}")))?;
    let status = resp.status();
    if !status.is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(AppError::Upstream(format!(
            "hub POST {path}: {status} {text}"
        )));
    }
    resp.json::<Value>()
        .await
        .map_err(|e| AppError::Upstream(format!("hub POST {path} parse: {e}")))
}

// ── Authenticated route handlers ──────────────────────────────────────────────

pub async fn submit_funding(
    State(st): State<AppState>,
    user: AuthUser,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let name = user.name.as_deref().unwrap_or("");
    let hu = resolve_hub(&st, &user.email, name).await?;
    let v = hub_post(&st, &hu, "/api/funding", body).await?;
    Ok(Json(v))
}

pub async fn my_funding(
    State(st): State<AppState>,
    user: AuthUser,
) -> Result<Json<Value>, AppError> {
    let name = user.name.as_deref().unwrap_or("");
    let hu = resolve_hub(&st, &user.email, name).await?;
    let all = hub_get(&st, &hu, "/api/funding").await?;
    let uid = hu.id.to_string();
    // hub GET /api/funding returns { apps: [...], logs: [...] }
    let apps = all
        .get("apps")
        .and_then(|v| v.as_array())
        .cloned()
        .unwrap_or_default();
    let mine: Vec<Value> = apps
        .into_iter()
        .filter(|item| {
            item.get("submitted_by_id")
                .and_then(|v| v.as_str())
                .map(|s| s == uid)
                .unwrap_or(false)
        })
        .collect();
    Ok(Json(Value::Array(mine)))
}

pub async fn notifications(
    State(st): State<AppState>,
    user: AuthUser,
) -> Result<Json<Value>, AppError> {
    let name = user.name.as_deref().unwrap_or("");
    let hu = resolve_hub(&st, &user.email, name).await?;
    let v = hub_get(&st, &hu, "/api/notifications").await?;
    Ok(Json(v))
}

pub async fn events(
    State(st): State<AppState>,
    user: AuthUser,
) -> Result<Json<Value>, AppError> {
    let name = user.name.as_deref().unwrap_or("");
    let hu = resolve_hub(&st, &user.email, name).await?;
    let v = hub_get(&st, &hu, "/api/events").await?;
    Ok(Json(v))
}

pub async fn notices(
    State(st): State<AppState>,
    user: AuthUser,
) -> Result<Json<Value>, AppError> {
    let name = user.name.as_deref().unwrap_or("");
    let hu = resolve_hub(&st, &user.email, name).await?;
    let v = hub_get(&st, &hu, "/api/notices").await?;
    Ok(Json(v))
}

pub async fn mark_notice_read(
    State(st): State<AppState>,
    user: AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<Value>, AppError> {
    let name = user.name.as_deref().unwrap_or("");
    let hu = resolve_hub(&st, &user.email, name).await?;
    let path = format!("/api/notices/{id}/read");
    let v = hub_post(&st, &hu, &path, serde_json::json!({})).await?;
    Ok(Json(v))
}
