//! Live Al-Ma'thurat session — real-time presence of who is reciting the wirid
//! right now, differentiated by name + colour and broadcast to every watcher.
//!
//! This is a LOCAL/dev feature: presence lives in memory (nothing is persisted
//! to Postgres), participants drop off after [`STALE_SECS`] of silence, and the
//! read endpoints are open so a dashboard can watch without a session. Writes
//! are authenticated so identity (name + colour) comes from the real account.

use crate::auth::session::AuthUser;
use crate::error::AppError;
use crate::state::AppState;
use axum::extract::State;
use axum::response::sse::{Event, KeepAlive, Sse};
use axum::Json;
use serde::Deserialize;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::convert::Infallible;
use std::sync::Arc;
use time::format_description::well_known::Rfc3339;
use time::OffsetDateTime;
use tokio::sync::{broadcast, RwLock};
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::{Stream, StreamExt};
use uuid::Uuid;

/// A participant drops off the live board after this long without an update.
const STALE_SECS: i64 = 120;

/// Curated, visually-distinct palette so every user gets a stable, pleasant
/// colour. Assigned deterministically from the (immutable) user id, so a person
/// keeps the same colour across sessions and devices.
const PALETTE: [&str; 10] = [
    "#6E7B4D", // olive
    "#2C7A7B", // teal
    "#B7791F", // amber
    "#2B6CB0", // blue
    "#C05621", // rust
    "#9B4DCA", // violet
    "#4C9A2A", // green
    "#B83280", // magenta
    "#8B5E34", // brown
    "#D69E2E", // gold
];

/// One participant's current position in the wirid.
#[derive(Clone)]
struct Presence {
    user_id: Uuid,
    name: String,
    color: String,
    version: String, // "sughra" | "kubra"
    session: String, // "pagi" | "petang"
    index: i32,      // current item, 1-based
    total: i32,      // number of items in this version
    reps_done: i32,  // reps completed on the current item
    reps_total: i32, // reps required for the current item
    percent: i32,    // overall progress, 0..100
    done: bool,
    updated: OffsetDateTime,
}

impl Presence {
    fn to_json(&self) -> Value {
        json!({
            "user_id": self.user_id,
            "name": self.name,
            "color": self.color,
            "version": self.version,
            "session": self.session,
            "index": self.index,
            "total": self.total,
            "reps_done": self.reps_done,
            "reps_total": self.reps_total,
            "percent": self.percent,
            "done": self.done,
            "updated_at": self.updated.format(&Rfc3339).unwrap_or_default(),
        })
    }
}

/// Shared live-session state: the current roster + a broadcast channel that
/// pushes the full roster to every connected SSE watcher on each change.
#[derive(Clone)]
pub struct MathuratHub {
    roster: Arc<RwLock<HashMap<Uuid, Presence>>>,
    tx: broadcast::Sender<Value>,
}

impl Default for MathuratHub {
    fn default() -> Self {
        let (tx, _rx) = broadcast::channel(64);
        Self {
            roster: Arc::new(RwLock::new(HashMap::new())),
            tx,
        }
    }
}

impl MathuratHub {
    /// Live participants (stale entries filtered out), most-progressed first.
    async fn live_list(&self) -> Vec<Value> {
        let now = OffsetDateTime::now_utc();
        let map = self.roster.read().await;
        let mut ps: Vec<&Presence> = map
            .values()
            .filter(|p| (now - p.updated).whole_seconds() < STALE_SECS)
            .collect();
        ps.sort_by(|a, b| b.percent.cmp(&a.percent).then_with(|| a.name.cmp(&b.name)));
        ps.into_iter().map(Presence::to_json).collect()
    }

    async fn snapshot(&self) -> Value {
        let users = self.live_list().await;
        json!({
            "count": users.len(),
            "users": users,
            "server_time": OffsetDateTime::now_utc().format(&Rfc3339).unwrap_or_default(),
        })
    }

    /// Insert/update a participant, GC stale ones, and broadcast the new roster.
    async fn upsert(&self, p: Presence) -> Value {
        {
            let mut map = self.roster.write().await;
            let now = OffsetDateTime::now_utc();
            map.retain(|_, e| (now - e.updated).whole_seconds() < STALE_SECS);
            map.insert(p.user_id, p);
        }
        let snap = self.snapshot().await;
        let _ = self.tx.send(snap.clone()); // Err only when nobody is watching
        snap
    }

    async fn remove(&self, id: Uuid) -> Value {
        self.roster.write().await.remove(&id);
        let snap = self.snapshot().await;
        let _ = self.tx.send(snap.clone());
        snap
    }
}

/// Turn an email into a friendly display name, since the profile has no name
/// field yet: `ahmad.zaki@x.com` -> "Ahmad Zaki", `alice@x.com` -> "Alice".
fn name_from_email(email: &str) -> String {
    let local = email.split('@').next().unwrap_or(email);
    let name: String = local
        .split(|c: char| c == '.' || c == '_' || c == '-' || c == '+')
        .filter(|s| !s.is_empty())
        .map(|word| {
            let mut cs = word.chars();
            match cs.next() {
                Some(f) => f.to_uppercase().collect::<String>() + cs.as_str(),
                None => String::new(),
            }
        })
        .collect::<Vec<_>>()
        .join(" ");
    if name.is_empty() {
        "Anon".into()
    } else {
        name
    }
}

/// Stable colour for a user, spread across the palette by their id.
fn color_for(id: Uuid) -> String {
    let idx = (id.as_u128() % PALETTE.len() as u128) as usize;
    PALETTE[idx].to_string()
}

#[derive(Deserialize)]
pub struct ProgressBody {
    version: Option<String>,
    session: Option<String>,
    index: i32,
    total: i32,
    reps_done: Option<i32>,
    reps_total: Option<i32>,
}

/// `POST /api/mathurat/presence` — report my current position (authenticated).
pub async fn update(
    State(st): State<AppState>,
    user: AuthUser,
    Json(b): Json<ProgressBody>,
) -> Result<Json<Value>, AppError> {
    if b.total <= 0 || b.index < 0 || b.index > b.total {
        return Err(AppError::BadRequest("index/total out of range".into()));
    }
    let reps_total = b.reps_total.unwrap_or(0).max(0);
    let reps_done = b.reps_done.unwrap_or(0).clamp(0, reps_total.max(b.reps_done.unwrap_or(0)));

    // Overall progress = whole items done + the fraction of the current item.
    let base = (b.index - 1).max(0) as f64;
    let frac = if reps_total > 0 {
        (reps_done.min(reps_total) as f64) / reps_total as f64
    } else {
        0.0
    };
    let percent = (((base + frac) / b.total as f64) * 100.0).round().clamp(0.0, 100.0) as i32;
    let done = b.index >= b.total && (reps_total == 0 || reps_done >= reps_total);

    let p = Presence {
        user_id: user.id,
        name: name_from_email(&user.email),
        color: color_for(user.id),
        version: b.version.unwrap_or_else(|| "sughra".into()),
        session: b.session.unwrap_or_else(|| "pagi".into()),
        index: b.index,
        total: b.total,
        reps_done,
        reps_total,
        percent,
        done,
        updated: OffsetDateTime::now_utc(),
    };
    Ok(Json(st.mathurat.upsert(p).await))
}

/// `GET /api/mathurat/presence` — one-shot roster snapshot (open, for polling).
pub async fn snapshot(State(st): State<AppState>) -> Json<Value> {
    Json(st.mathurat.snapshot().await)
}

/// `POST /api/mathurat/leave` — drop off the board (authenticated).
pub async fn leave(State(st): State<AppState>, user: AuthUser) -> Json<Value> {
    Json(st.mathurat.remove(user.id).await)
}

/// `GET /api/mathurat/live` — Server-Sent Events stream of the roster, pushed on
/// every change (open). Clients fetch `/presence` once for the initial state,
/// then listen here for real-time updates.
pub async fn live(State(st): State<AppState>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let rx = st.mathurat.tx.subscribe();
    let stream = BroadcastStream::new(rx)
        .filter_map(Result::ok)
        .map(|roster| Ok(Event::default().event("roster").json_data(&roster).unwrap()));
    Sse::new(stream).keep_alive(KeepAlive::default())
}
