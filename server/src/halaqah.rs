//! Halaqah — moderated group audio rooms over a self-hosted LiveKit SFU.
//!
//! Model
//! -----
//! An admin opens a room and becomes its **host**. Any signed-in user may join
//! and listen. The host designates **one participant at a time** to hold the
//! floor. That participant and the host may publish audio; everyone else is
//! subscribe-only. Rooms have a **5-hour limit** — the server auto-closes them
//! if the host hasn't done so within 5 hours of creation.
//!
//! Why permissions are changed server-side
//! ---------------------------------------
//! A LiveKit access token fixes `canPublish` at join time, so promoting someone
//! by minting a new token would force a reconnect and drop their audio. Instead
//! we call LiveKit's `UpdateParticipant` management RPC, which flips publish
//! rights on a live connection. The browser sees a `ParticipantPermissionsChanged`
//! event and starts or stops its microphone accordingly.
//!
//! LiveKit's server API is Twirp over HTTP: a plain JSON POST to
//! `/twirp/livekit.RoomService/<Method>` authenticated with a short-lived JWT
//! carrying a `roomAdmin` grant.

use crate::admin::AdminUser;
use crate::auth::session::AuthUser;
use crate::error::AppError;
use crate::state::AppState;
use axum::extract::{Path, State};
use axum::Json;
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use time::OffsetDateTime;
use uuid::Uuid;

/* --------------------------------------------------------------- token mint */

/// The `video` grant inside a LiveKit access token.
#[derive(Debug, Serialize)]
struct VideoGrant {
    room: String,
    #[serde(rename = "roomJoin")]
    room_join: bool,
    #[serde(rename = "canPublish")]
    can_publish: bool,
    #[serde(rename = "canSubscribe")]
    can_subscribe: bool,
    #[serde(rename = "canPublishData")]
    can_publish_data: bool,
    /// Grants the management API (UpdateParticipant, etc.) for this room.
    #[serde(rename = "roomAdmin", skip_serializing_if = "std::ops::Not::not")]
    room_admin: bool,
    #[serde(rename = "roomCreate", skip_serializing_if = "std::ops::Not::not")]
    room_create: bool,
}

#[derive(Debug, Serialize)]
struct AccessClaims {
    iss: String,
    sub: String,
    nbf: i64,
    exp: i64,
    name: String,
    video: VideoGrant,
}

fn mint(st: &AppState, identity: &str, name: &str, grant: VideoGrant) -> Result<String, AppError> {
    let lk = &st.cfg.livekit;
    if !lk.configured() {
        return Err(AppError::Internal("LiveKit is not configured".into()));
    }
    let now = OffsetDateTime::now_utc().unix_timestamp();
    let claims = AccessClaims {
        iss: lk.api_key.clone(),
        sub: identity.to_string(),
        nbf: now - 10, // small skew allowance
        exp: now + lk.token_ttl_minutes * 60,
        name: name.to_string(),
        video: grant,
    };
    encode(
        &Header::new(Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(lk.api_secret.as_bytes()),
    )
    .map_err(|e| AppError::Internal(format!("livekit token: {e}")))
}

/// A token for the management API — room-scoped admin, valid briefly.
fn mint_admin(st: &AppState, room: &str) -> Result<String, AppError> {
    mint(
        st,
        "cakna-server",
        "Cakna",
        VideoGrant {
            room: room.to_string(),
            room_join: false,
            can_publish: false,
            can_subscribe: false,
            can_publish_data: false,
            room_admin: true,
            room_create: true,
        },
    )
}

/// Call a LiveKit RoomService method (Twirp: JSON POST, bearer auth).
async fn room_service(
    st: &AppState,
    room: &str,
    method: &str,
    body: Value,
) -> Result<Value, AppError> {
    let token = mint_admin(st, room)?;
    let url = format!(
        "{}/twirp/livekit.RoomService/{method}",
        st.cfg.livekit.api_url.trim_end_matches('/')
    );
    let resp = st
        .http
        .post(&url)
        .bearer_auth(token)
        .json(&body)
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("livekit {method}: {e}")))?;
    let status = resp.status();
    let text = resp.text().await.unwrap_or_default();
    if !status.is_success() {
        return Err(AppError::Upstream(format!(
            "livekit {method} {status}: {text}"
        )));
    }
    Ok(serde_json::from_str(&text).unwrap_or_else(|_| json!({})))
}

/* -------------------------------------------------------------------- rooms */

struct Room {
    id: Uuid,
    slug: String,
    title: String,
    host_id: Uuid,
    speaker_id: Option<Uuid>,
    page: i32,
    share: Option<Value>,
}

async fn load(st: &AppState, slug: &str) -> Result<Room, AppError> {
    sqlx::query_as::<_, (Uuid, String, String, Uuid, Option<Uuid>, i32, Option<Value>)>(
        "SELECT id, slug, title, host_id, speaker_id, page, share FROM halaqah_rooms \
         WHERE slug = $1 AND closed_at IS NULL AND created_at >= NOW() - INTERVAL '5 hours'",
    )
    .bind(slug)
    .fetch_optional(&st.pool)
    .await?
    .map(|(id, slug, title, host_id, speaker_id, page, share)| Room {
        id,
        slug,
        title,
        host_id,
        speaker_id,
        page,
        share,
    })
    .ok_or(AppError::NotFound)
}

/// Publish the room's shared state (who holds the floor, which page) to every
/// participant via LiveKit room metadata.
///
/// Always writes BOTH fields from the current database row: writing only the one
/// that changed would clobber the other, since metadata is replaced wholesale.
/// Late joiners read this on connect, so it is the durable copy — live page turns
/// also go over the data channel for immediacy.
async fn publish_state(
    st: &AppState,
    room: &Room,
    speaker_id: Option<Uuid>,
    page: i32,
    share: Option<&Value>,
) {
    let meta = json!({ "speaker_id": speaker_id, "page": page, "share": share }).to_string();
    if let Err(e) = room_service(
        st,
        &room.slug,
        "UpdateRoomMetadata",
        json!({ "room": room.slug, "metadata": meta }),
    )
    .await
    {
        tracing::warn!("halaqah: metadata publish failed for {}: {e}", room.slug);
    }
}

/// Slugify a title, then suffix a short random tail so two rooms of the same
/// name never collide on the UNIQUE index.
fn slugify(title: &str) -> String {
    let base: String = title
        .to_lowercase()
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-");
    let base = if base.is_empty() { "halaqah".into() } else { base };
    let tail: String = Uuid::new_v4().simple().to_string().chars().take(6).collect();
    format!("{}-{tail}", base.chars().take(40).collect::<String>())
}

#[derive(Deserialize)]
pub struct CreateRoom {
    pub title: String,
}

/// Open a room. Admin only — see DECISIONS/README on who may host.
pub async fn create(
    State(st): State<AppState>,
    AdminUser(host): AdminUser,
    Json(body): Json<CreateRoom>,
) -> Result<Json<Value>, AppError> {
    let title = body.title.trim();
    if title.is_empty() || title.chars().count() > 80 {
        return Err(AppError::BadRequest("title must be 1–80 characters".into()));
    }
    let slug = slugify(title);

    // Create the room in LiveKit with no timeouts: `empty_timeout` is how long an
    // empty room lingers before LiveKit reaps it. 0 would mean "use the default"
    // (5 min), so set it very high — the room ends when the host says so.
    room_service(
        &st,
        &slug,
        "CreateRoom",
        json!({ "name": slug, "empty_timeout": 60 * 60 * 24 * 365u32, "max_participants": 200 }),
    )
    .await?;

    let id = sqlx::query_scalar::<_, Uuid>(
        "INSERT INTO halaqah_rooms (slug, title, host_id) VALUES ($1, $2, $3) RETURNING id",
    )
    .bind(&slug)
    .bind(title)
    .bind(host.id)
    .fetch_one(&st.pool)
    .await?;

    Ok(Json(json!({ "id": id, "slug": slug, "title": title })))
}

/// Open rooms, newest first. Any signed-in user may see them.
pub async fn list(State(st): State<AppState>, _u: AuthUser) -> Result<Json<Value>, AppError> {
    let rows = sqlx::query_as::<_, (Uuid, String, String, Option<String>, Option<String>, OffsetDateTime)>(
        "SELECT r.id, r.slug, r.title, h.name, s.name, r.created_at \
         FROM halaqah_rooms r \
         JOIN users h ON h.id = r.host_id \
         LEFT JOIN users s ON s.id = r.speaker_id \
         WHERE r.closed_at IS NULL AND r.created_at >= NOW() - INTERVAL '5 hours' ORDER BY r.created_at DESC",
    )
    .fetch_all(&st.pool)
    .await?;

    let rooms: Vec<Value> = rows
        .into_iter()
        .map(|(id, slug, title, host, speaker, created)| {
            json!({
                "id": id, "slug": slug, "title": title,
                "host": host, "speaker": speaker,
                "created_at": created.unix_timestamp(),
            })
        })
        .collect();
    Ok(Json(json!({ "rooms": rooms, "livekit_configured": st.cfg.livekit.configured() })))
}

/// Join: returns the LiveKit URL and an access token scoped to this user's role.
/// The host and the current speaker may publish; everyone else listens.
pub async fn join(
    State(st): State<AppState>,
    Path(slug): Path<String>,
    user: AuthUser,
) -> Result<Json<Value>, AppError> {
    let room = load(&st, &slug).await?;
    let is_host = room.host_id == user.id;
    let is_speaker = room.speaker_id == Some(user.id);
    let display = user.name.clone().unwrap_or_else(|| user.email.clone());

    let token = mint(
        &st,
        &user.id.to_string(),
        &display,
        VideoGrant {
            room: room.slug.clone(),
            room_join: true,
            can_publish: is_host || is_speaker,
            can_subscribe: true,
            can_publish_data: true,
            // The host gets room admin so the client could mute locally; the
            // authoritative permission changes still go through our API.
            room_admin: is_host,
            room_create: false,
        },
    )?;

    Ok(Json(json!({
        "url": st.cfg.livekit.url,
        "token": token,
        "identity": user.id,
        "name": display,
        "room": { "id": room.id, "slug": room.slug, "title": room.title },
        "role": if is_host { "host" } else if is_speaker { "speaker" } else { "listener" },
        "speaker_id": room.speaker_id,
        "page": room.page,
        "share": room.share,
    })))
}

#[derive(Deserialize)]
pub struct SetSpeaker {
    /// `None` clears the floor — nobody but the host may speak.
    pub user_id: Option<Uuid>,
}

/// Give the floor to one participant (or take it back). Host only.
///
/// Applies the change to the live LiveKit session so nobody has to reconnect:
/// the previous speaker loses publish rights, the new one gains them.
pub async fn set_speaker(
    State(st): State<AppState>,
    Path(slug): Path<String>,
    user: AuthUser,
    Json(body): Json<SetSpeaker>,
) -> Result<Json<Value>, AppError> {
    let room = load(&st, &slug).await?;
    if room.host_id != user.id {
        return Err(AppError::Forbidden);
    }
    if body.user_id == Some(room.host_id) {
        return Err(AppError::BadRequest(
            "the host already holds publish rights".into(),
        ));
    }

    // Demote whoever held the floor before.
    if let Some(prev) = room.speaker_id {
        if Some(prev) != body.user_id {
            let _ = set_publish(&st, &room.slug, prev, false).await;
        }
    }
    // Promote the new speaker.
    if let Some(next) = body.user_id {
        set_publish(&st, &room.slug, next, true).await?;
    }

    sqlx::query("UPDATE halaqah_rooms SET speaker_id = $1 WHERE id = $2")
        .bind(body.user_id)
        .bind(room.id)
        .execute(&st.pool)
        .await?;

    // Broadcast who holds the floor. `ParticipantPermissionsChanged` only tells a
    // client about ITSELF, so without this every other participant's UI would still
    // show the previous speaker. Metadata also reaches late joiners.
    publish_state(&st, &room, body.user_id, room.page, room.share.as_ref()).await;

    Ok(Json(json!({ "ok": true, "speaker_id": body.user_id })))
}

/// Flip publish rights on a live participant.
///
/// A participant who has not joined yet is not an error: their token is minted
/// at join time from the stored `speaker_id`, so the state still converges.
async fn set_publish(
    st: &AppState,
    slug: &str,
    user_id: Uuid,
    can_publish: bool,
) -> Result<(), AppError> {
    let res = room_service(
        st,
        slug,
        "UpdateParticipant",
        json!({
            "room": slug,
            "identity": user_id.to_string(),
            "permission": {
                "canSubscribe": true,
                "canPublish": can_publish,
                "canPublishData": true,
            }
        }),
    )
    .await;
    match res {
        Ok(_) => Ok(()),
        Err(e) => {
            tracing::info!("halaqah: could not update {user_id} in {slug} (not joined yet?): {e}");
            Ok(())
        }
    }
}

#[derive(Deserialize)]
pub struct SetPage {
    pub page: i32,
}

/// Move the shared mushaf page. Allowed to whoever holds the floor — the reciter
/// drives the page as they read — and to the host, who can always take over.
///
/// Clients also broadcast page turns over the LiveKit data channel for immediacy;
/// this call is what makes the page survive for participants who join later.
pub async fn set_page(
    State(st): State<AppState>,
    Path(slug): Path<String>,
    user: AuthUser,
    Json(body): Json<SetPage>,
) -> Result<Json<Value>, AppError> {
    let room = load(&st, &slug).await?;
    if room.host_id != user.id && room.speaker_id != Some(user.id) {
        return Err(AppError::Forbidden);
    }
    if !(1..=604).contains(&body.page) {
        return Err(AppError::BadRequest("page must be 1–604".into()));
    }

    sqlx::query("UPDATE halaqah_rooms SET page = $1 WHERE id = $2")
        .bind(body.page)
        .bind(room.id)
        .execute(&st.pool)
        .await?;

    // Keep `share` in step: turning a page IS sharing that page.
    let share = json!({ "kind": "page", "page": body.page });
    sqlx::query("UPDATE halaqah_rooms SET share = $1 WHERE id = $2")
        .bind(&share)
        .bind(room.id)
        .execute(&st.pool)
        .await?;

    publish_state(&st, &room, room.speaker_id, body.page, Some(&share)).await;
    Ok(Json(json!({ "ok": true, "page": body.page })))
}

#[derive(Deserialize)]
pub struct SetShare {
    /// `"page"`, `"mathurat"`, `"route"`, or absent/null to stop sharing.
    pub kind: Option<String>,
    pub page: Option<i32>,
    pub path: Option<String>,
    pub label: Option<String>,
    /// mathurat: which wirid item the reciter is on.
    pub version: Option<String>,
    pub mode: Option<String>,
    pub idx: Option<i32>,
}

/// Set what the room is looking at — whatever the mic-holder is viewing.
///
/// `kind = "page"` shares a mushaf page, which every participant renders inline
/// with their own settings. `kind = "route"` shares any other part of the app
/// (Al-Ma'thurat, the surah index, …) as a destination participants can follow.
/// Omitting `kind` clears it: the reciter has stopped sharing.
pub async fn set_share(
    State(st): State<AppState>,
    Path(slug): Path<String>,
    user: AuthUser,
    Json(body): Json<SetShare>,
) -> Result<Json<Value>, AppError> {
    let room = load(&st, &slug).await?;
    if room.host_id != user.id && room.speaker_id != Some(user.id) {
        return Err(AppError::Forbidden);
    }

    let (share, page) = match body.kind.as_deref() {
        Some("page") => {
            let p = body.page.unwrap_or(room.page);
            if !(1..=604).contains(&p) {
                return Err(AppError::BadRequest("page must be 1–604".into()));
            }
            (Some(json!({ "kind": "page", "page": p })), p)
        }
        Some("mathurat") => {
            // Validated rather than passed through: this drives an array index in
            // every participant's client. Kubra is the longer list at 46 items.
            let version = match body.version.as_deref() {
                Some("kubra") => "kubra",
                _ => "sughra",
            };
            let mode = match body.mode.as_deref() {
                Some("petang") => "petang",
                _ => "pagi",
            };
            let max = if version == "kubra" { 46 } else { 32 };
            let idx = body.idx.unwrap_or(0).clamp(0, max - 1);
            (
                Some(json!({ "kind": "mathurat", "version": version, "mode": mode, "idx": idx })),
                room.page,
            )
        }
        Some("route") => {
            let path = body.path.unwrap_or_default();
            // Same-origin relative paths only — this value is handed to a client
            // router, so an absolute URL here would be an open redirect.
            if !path.starts_with('/') || path.starts_with("//") || path.len() > 200 {
                return Err(AppError::BadRequest("path must be a relative app route".into()));
            }
            let label = body.label.unwrap_or_else(|| path.clone());
            (
                Some(json!({ "kind": "route", "path": path, "label": label.chars().take(60).collect::<String>() })),
                room.page,
            )
        }
        _ => (None, room.page),
    };

    sqlx::query("UPDATE halaqah_rooms SET share = $1, page = $2 WHERE id = $3")
        .bind(&share)
        .bind(page)
        .bind(room.id)
        .execute(&st.pool)
        .await?;

    publish_state(&st, &room, room.speaker_id, page, share.as_ref()).await;
    Ok(Json(json!({ "ok": true, "share": share })))
}

/// Background task: close any room that has been open for more than 5 hours
/// without the host explicitly closing it. Called on a regular interval from
/// `main`. Errors are logged and skipped — the next tick will retry.
pub async fn close_stale(st: &AppState) {
    let stale: Vec<(Uuid, String)> = match sqlx::query_as::<_, (Uuid, String)>(
        "SELECT id, slug FROM halaqah_rooms \
         WHERE closed_at IS NULL AND created_at <= NOW() - INTERVAL '5 hours'",
    )
    .fetch_all(&st.pool)
    .await
    {
        Ok(rows) => rows,
        Err(e) => {
            tracing::warn!("halaqah: stale-room query failed: {e}");
            return;
        }
    };

    for (id, slug) in stale {
        let _ = room_service(st, &slug, "DeleteRoom", json!({ "room": slug })).await;
        match sqlx::query(
            "UPDATE halaqah_rooms SET closed_at = now() WHERE id = $1 AND closed_at IS NULL",
        )
        .bind(id)
        .execute(&st.pool)
        .await
        {
            Ok(_) => tracing::info!("halaqah: auto-closed stale room {slug}"),
            Err(e) => tracing::warn!("halaqah: failed to mark room {slug} closed: {e}"),
        }
    }
}

/// End the session. Host only. Also deletes the LiveKit room, disconnecting all.
pub async fn close(
    State(st): State<AppState>,
    Path(slug): Path<String>,
    user: AuthUser,
) -> Result<Json<Value>, AppError> {
    let room = load(&st, &slug).await?;
    if room.host_id != user.id {
        return Err(AppError::Forbidden);
    }
    let _ = room_service(&st, &room.slug, "DeleteRoom", json!({ "room": room.slug })).await;
    sqlx::query("UPDATE halaqah_rooms SET closed_at = now() WHERE id = $1")
        .bind(room.id)
        .execute(&st.pool)
        .await?;
    Ok(Json(json!({ "ok": true })))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slugify_is_url_safe_and_unique() {
        let a = slugify("Halaqah Tadarus Isnin!");
        assert!(a.starts_with("halaqah-tadarus-isnin-"), "got {a}");
        assert!(a.chars().all(|c| c.is_ascii_alphanumeric() || c == '-'));
        // the random tail keeps two identically-named rooms apart
        assert_ne!(a, slugify("Halaqah Tadarus Isnin!"));
    }

    #[test]
    fn slugify_handles_non_ascii_and_empty() {
        let s = slugify("الْمَأْثُورَات");
        assert!(s.starts_with("halaqah-"), "non-ascii title -> fallback, got {s}");
        assert!(slugify("   ").starts_with("halaqah-"));
        // long titles are truncated before the tail is appended
        assert!(slugify(&"a".repeat(200)).len() <= 47);
    }

    #[test]
    fn grant_serialises_to_livekit_shape() {
        let g = VideoGrant {
            room: "r1".into(),
            room_join: true,
            can_publish: false,
            can_subscribe: true,
            can_publish_data: true,
            room_admin: false,
            room_create: false,
        };
        let v = serde_json::to_value(&g).unwrap();
        assert_eq!(v["roomJoin"], true);
        assert_eq!(v["canPublish"], false);
        assert_eq!(v["canSubscribe"], true);
        // false admin/create flags are omitted, matching LiveKit's own encoders
        assert!(v.get("roomAdmin").is_none());
        assert!(v.get("roomCreate").is_none());
    }
}
