//! Admin surface: Al-Ma'thurat oversight for a study circle's coordinator.
//!
//! This is a REWRITE of the Node/Express `admin.mjs`, not a port. That version
//! read `rekod[day].sughra.pagi`, a nesting no frontend has ever written — the
//! app writes `rekod[day] = { pagi?, petang? }` — so every derived metric
//! (streak, heatmap, sessions, last-completed) was structurally zero for real
//! users, and only the demo seed made the dashboard look alive.
//!
//! Two consequences of the real shape, both deliberate here:
//!   * A day's record is NOT split by version. `{pagi, petang}` is global to the
//!     day, so there is no honest per-version Pagi/Petang breakdown to report.
//!   * A day therefore contributes at most 2 sessions, not 4.
//!
//! Day keys are computed at UTC+8 (Malaysia, no DST) because the client writes
//! its keys in local time. Computing them in UTC — as the Node version did —
//! shifted every hour from 00:00 to 08:00 local onto the previous day.

use crate::auth::session::AuthUser;
use crate::error::AppError;
use crate::state::AppState;
use axum::extract::{FromRequestParts, State};
use axum::http::request::Parts;
use axum::http::{header::LOCATION, HeaderMap, StatusCode};
use axum::response::{Html, IntoResponse, Response};
use axum::Json;
use serde::Deserialize;
use serde_json::{json, Value};
use time::{Date, Duration, OffsetDateTime, UtcOffset};
use uuid::Uuid;

/// Malaysia standard time. Fixed offset — MYT has no daylight saving.
const TZ: UtcOffset = match UtcOffset::from_hms(8, 0, 0) {
    Ok(o) => o,
    Err(_) => UtcOffset::UTC,
};

/// Wirid shape constants. Source of truth is `web/src/lib/data/mathurat-master.ts`
/// (46 items): Sughra covers the 32 items carrying `reps.s`, summing to 70
/// repetitions; Kubra covers all 46, summing to 207. See DECISIONS.md.
const SUGHRA_ITEMS: usize = 32;
const SUGHRA_TARGET: i64 = 70;
const KUBRA_ITEMS: usize = 46;
const KUBRA_TARGET: i64 = 207;

/// Admin-only extractor. Rejects with 401 when unauthenticated (via `AuthUser`)
/// and 403 when authenticated but not an admin, so a client can tell the two
/// apart. "Admin" is `users.is_admin` OR the ADMIN_EMAILS allowlist.
pub struct AdminUser(pub AuthUser);

#[axum::async_trait]
impl FromRequestParts<AppState> for AdminUser {
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, st: &AppState) -> Result<Self, Self::Rejection> {
        let user = AuthUser::from_request_parts(parts, st).await?;
        if !st.is_admin(&user) {
            return Err(AppError::Forbidden);
        }
        Ok(AdminUser(user))
    }
}

/// Serve the dashboard at `/admin`.
///
/// Without this the path falls through to the SPA fallback and quietly renders
/// the *user* app — which looks like "admin is broken" rather than "wrong URL".
/// Guards like the page it replaces: anonymous -> sign in, non-admin -> home.
/// The API is still the real boundary; this is about not showing a signed-in
/// non-admin a dashboard chrome they cannot populate.
pub async fn page(State(st): State<AppState>, parts: HeaderMap) -> Response {
    let redirect = |to: &str| -> Response {
        (StatusCode::FOUND, [(LOCATION, to.to_string())]).into_response()
    };

    // Resolve the session by hand: the extractor's rejection is a 401 JSON body,
    // and for a page navigation we want a redirect instead.
    let Some(token) = crate::auth::session::cookie_value(&parts) else {
        return redirect("/auth/login?next=/admin");
    };
    let row = sqlx::query_as::<_, (String, bool)>(
        "SELECT u.email::text, u.is_admin FROM sessions s JOIN users u ON u.id = s.user_id \
         WHERE s.token_hash = $1 AND s.expires_at > now()",
    )
    .bind(crate::auth::session::hash_token(&token))
    .fetch_optional(&st.pool)
    .await;

    match row {
        Ok(Some((email, is_admin)))
            if is_admin || st.cfg.admin_emails.contains(&email.to_lowercase()) => {}
        Ok(Some(_)) => return redirect("/"),
        Ok(None) => return redirect("/auth/login?next=/admin"),
        Err(e) => {
            tracing::error!("admin page session lookup: {e}");
            return redirect("/auth/login?next=/admin");
        }
    }

    let Some(dir) = &st.cfg.static_dir else {
        return (StatusCode::NOT_FOUND, "admin dashboard not available").into_response();
    };
    match tokio::fs::read_to_string(format!("{dir}/admin.html")).await {
        Ok(html) => Html(html).into_response(),
        Err(e) => {
            tracing::error!("admin.html: {e}");
            (StatusCode::NOT_FOUND, "admin dashboard not found").into_response()
        }
    }
}

/* ------------------------------------------------------------------ helpers */

fn today(now: OffsetDateTime) -> Date {
    now.to_offset(TZ).date()
}

fn iso(d: Date) -> String {
    format!("{:04}-{:02}-{:02}", d.year(), d.month() as u8, d.day())
}

/// A day counts as active when either wirid slot was completed.
/// The flat `{pagi?, petang?}` shape is exactly what the app writes.
fn day_active(entry: Option<&Value>) -> bool {
    entry.is_some_and(|e| {
        e.get("pagi").and_then(Value::as_bool).unwrap_or(false)
            || e.get("petang").and_then(Value::as_bool).unwrap_or(false)
    })
}

fn rekod_of(m: &Value) -> Option<&serde_json::Map<String, Value>> {
    m.get("rekod").and_then(Value::as_object)
}

/// Consecutive active days ending today. Today not yet done does not break it.
fn streak_from(m: &Value, now: OffsetDateTime) -> i64 {
    let Some(rekod) = rekod_of(m) else { return 0 };
    let mut n = 0;
    let mut d = today(now);
    for i in 0..400 {
        if day_active(rekod.get(&iso(d))) {
            n += 1;
        } else if i > 0 {
            break;
        }
        match d.previous_day() {
            Some(p) => d = p,
            None => break,
        }
    }
    n
}

/// Completed slots this calendar month. Max 2 per day (pagi + petang).
fn sessions_this_month(m: &Value, now: OffsetDateTime) -> i64 {
    let Some(rekod) = rekod_of(m) else { return 0 };
    let t = today(now);
    let prefix = format!("{:04}-{:02}", t.year(), t.month() as u8);
    rekod
        .iter()
        .filter(|(day, _)| day.starts_with(&prefix))
        .map(|(_, e)| {
            let b = |k| e.get(k).and_then(Value::as_bool).unwrap_or(false);
            i64::from(b("pagi")) + i64::from(b("petang"))
        })
        .sum()
}

/// Most recent active day, or None if the user has never completed one.
fn last_completed(m: &Value) -> Option<String> {
    let rekod = rekod_of(m)?;
    rekod
        .iter()
        .filter(|(_, e)| day_active(Some(e)))
        .map(|(day, _)| day.clone())
        .max()
}

fn sum_counts(m: &Value, version: &str) -> i64 {
    m.get("counts")
        .and_then(|c| c.get(version))
        .and_then(Value::as_array)
        .map(|a| a.iter().filter_map(Value::as_i64).sum())
        .unwrap_or(0)
}

fn pct_of(done: i64, target: i64) -> i64 {
    if target <= 0 {
        return 0;
    }
    ((done as f64 / target as f64) * 100.0).round().clamp(0.0, 100.0) as i64
}

/// Avatar initials: first letters of up to two name words, else the first two
/// characters of the email's local part (one word yields one letter otherwise).
fn initials(name: Option<&str>, email: &str) -> String {
    if let Some(n) = name.map(str::trim).filter(|n| !n.is_empty()) {
        let letters: String = n
            .split_whitespace()
            .filter_map(|w| w.chars().next())
            .take(2)
            .collect();
        if letters.chars().count() >= 2 {
            return letters.to_uppercase();
        }
        // single-word name: take two characters from it
        let two: String = n.chars().take(2).collect();
        if !two.is_empty() {
            return two.to_uppercase();
        }
    }
    email
        .split('@')
        .next()
        .unwrap_or(email)
        .chars()
        .take(2)
        .collect::<String>()
        .to_uppercase()
}

/* ---------------------------------------------------------------- per-user */

struct Row {
    id: Uuid,
    email: String,
    name: Option<String>,
    login_method: String,
    last_login: Option<OffsetDateTime>,
    mathurat: Option<Value>,
}

fn user_payload(r: &Row, now: OffsetDateTime) -> Value {
    let empty = json!({});
    let m = r.mathurat.as_ref().unwrap_or(&empty);

    let version = match m.get("version").and_then(Value::as_str) {
        Some("kubra") => "kubra",
        _ => "sughra",
    };
    let mode = match m.get("mode").and_then(Value::as_str) {
        Some("petang") => "petang",
        _ => "pagi",
    };

    let s_reps = sum_counts(m, "sughra");
    let k_reps = sum_counts(m, "kubra");
    let s_pct = pct_of(s_reps, SUGHRA_TARGET);
    let k_pct = pct_of(k_reps, KUBRA_TARGET);
    let headline_pct = if version == "kubra" { k_pct } else { s_pct };

    let t = today(now);
    let today_entry = rekod_of(m).and_then(|r| r.get(&iso(t))).cloned();
    let flag = |k: &str| {
        today_entry
            .as_ref()
            .and_then(|e| e.get(k))
            .and_then(Value::as_bool)
            .unwrap_or(false)
    };

    // 14 days ending today; index 0 is 13 days ago.
    let heatmap: Vec<bool> = (0..14)
        .map(|i| {
            let d = t - Duration::days(13 - i);
            day_active(rekod_of(m).and_then(|r| r.get(&iso(d))))
        })
        .collect();

    let idx = |k: &str, max: usize| -> usize {
        m.get("idx")
            .and_then(|v| v.get(k))
            .and_then(Value::as_u64)
            .map(|v| (v as usize + 1).min(max))
            .unwrap_or(1)
    };

    json!({
        "id": r.id,
        "name": r.name,
        "email": r.email,
        "initials": initials(r.name.as_deref(), &r.email),
        "login_method": r.login_method,
        "last_active_iso": r.last_login.map(|t| t.unix_timestamp()),
        "streak": streak_from(m, now),
        "sessions_month": sessions_this_month(m, now),
        "headline_pct": headline_pct,
        "version": version,
        "mode": mode,
        "detail": {
            "version": version,
            "mode": mode,
            // Duplicated from the row above so the detail panel can render
            // standalone without reaching back up into the parent object.
            "streak": streak_from(m, now),
            "sessions_month": sessions_this_month(m, now),
            "headline_pct": headline_pct,
            "last_completed": last_completed(m),
            "total_ulangan": { "done": s_reps + k_reps, "target": SUGHRA_TARGET + KUBRA_TARGET },
            "heatmap": heatmap,
            // Today's two slots. NOT split by version — the stored record has no
            // version dimension, so reporting one would be fabrication.
            "today": { "pagi": flag("pagi"), "petang": flag("petang") },
            "sughra": { "pct": s_pct, "reps": s_reps, "target": SUGHRA_TARGET,
                        "item": idx("sughra", SUGHRA_ITEMS), "items": SUGHRA_ITEMS },
            "kubra":  { "pct": k_pct, "reps": k_reps, "target": KUBRA_TARGET,
                        "item": idx("kubra", KUBRA_ITEMS), "items": KUBRA_ITEMS },
        }
    })
}

/* ---------------------------------------------------------------- handlers */

pub async fn overview(
    State(st): State<AppState>,
    _admin: AdminUser,
) -> Result<Json<Value>, AppError> {
    let rows = sqlx::query_as::<_, (Uuid, String, Option<String>, String, Option<OffsetDateTime>, Option<Value>)>(
        "SELECT u.id, u.email::text, u.name, u.login_method, u.last_login, \
                (SELECT d.value FROM user_data d WHERE d.user_id = u.id AND d.key = 'mathurat') \
         FROM users u ORDER BY u.last_login DESC NULLS LAST, u.created_at",
    )
    .fetch_all(&st.pool)
    .await?
    .into_iter()
    .map(|(id, email, name, login_method, last_login, mathurat)| Row {
        id, email, name, login_method, last_login, mathurat,
    })
    .collect::<Vec<_>>();

    let now = OffsetDateTime::now_utc();
    let users: Vec<Value> = rows.iter().map(|r| user_payload(r, now)).collect();

    let total = users.len() as i64;
    let active_today = rows
        .iter()
        .filter(|r| {
            r.last_login
                .is_some_and(|t| (now - t) < Duration::days(1))
        })
        .count() as i64;

    // Average the percentage for the version each user is actually reading, so
    // the figure matches the per-user column beside it. (The Node version
    // averaged Sughra only while labelling the card "Sughra & Kubra".)
    let avg_completion = if total == 0 {
        0
    } else {
        users
            .iter()
            .filter_map(|u| u["headline_pct"].as_i64())
            .sum::<i64>()
            / total
    };

    // Last 7 days, oldest first.
    let t = today(now);
    let mut weekly = Vec::with_capacity(7);
    let mut sessions_week = 0i64;
    for i in 0..7 {
        let d = t - Duration::days(6 - i);
        let key = iso(d);
        let (mut pagi, mut petang) = (0i64, 0i64);
        for r in &rows {
            let Some(m) = &r.mathurat else { continue };
            let Some(e) = rekod_of(m).and_then(|rk| rk.get(&key)) else { continue };
            if e.get("pagi").and_then(Value::as_bool).unwrap_or(false) {
                pagi += 1;
            }
            if e.get("petang").and_then(Value::as_bool).unwrap_or(false) {
                petang += 1;
            }
        }
        sessions_week += pagi + petang;
        weekly.push(json!({ "date": key, "dow": d.weekday().number_days_from_sunday(),
                            "pagi": pagi, "petang": petang }));
    }

    let qcxis = rows.iter().filter(|r| r.login_method == "qcxis").count() as i64;

    let mut leaders: Vec<&Value> = users.iter().collect();
    leaders.sort_by_key(|u| -u["streak"].as_i64().unwrap_or(0));
    let streak_leaders: Vec<Value> = leaders
        .into_iter()
        .filter(|u| u["streak"].as_i64().unwrap_or(0) > 0)
        .take(5)
        .map(|u| json!({ "name": u["name"], "email": u["email"], "initials": u["initials"],
                         "streak": u["streak"], "login_method": u["login_method"] }))
        .collect();

    Ok(Json(json!({
        "kpis": {
            "total_users": total,
            "active_today": active_today,
            "avg_completion": avg_completion,
            "sessions_week": sessions_week,
        },
        "login_split": { "qcxis": qcxis, "email": total - qcxis },
        "weekly": weekly,
        "streak_leaders": streak_leaders,
        "generated_at": now.unix_timestamp(),
        "users": users,
    })))
}

pub async fn list_users(
    State(st): State<AppState>,
    AdminUser(me): AdminUser,
) -> Result<Json<Value>, AppError> {
    let rows = sqlx::query_as::<_, (Uuid, String, Option<String>, String, bool, Option<OffsetDateTime>)>(
        "SELECT id, email::text, name, login_method, is_admin, last_login FROM users \
         ORDER BY is_admin DESC, last_login DESC NULLS LAST, created_at",
    )
    .fetch_all(&st.pool)
    .await?;

    let users: Vec<Value> = rows
        .into_iter()
        .map(|(id, email, name, login_method, is_admin, last_login)| {
            let allowlisted = st.cfg.admin_emails.contains(&email.to_lowercase());
            json!({
                "id": id,
                "email": email,
                "name": name,
                "login_method": login_method,
                "last_login": last_login.map(|t| t.unix_timestamp()),
                "is_admin": is_admin,
                "allowlisted": allowlisted,
                "effective_admin": is_admin || allowlisted,
            })
        })
        .collect();

    Ok(Json(json!({ "me": me.id, "users": users })))
}

#[derive(Deserialize)]
pub struct SetRole {
    pub user_id: Uuid,
    pub make_admin: bool,
}

pub async fn set_role(
    State(st): State<AppState>,
    AdminUser(me): AdminUser,
    Json(body): Json<SetRole>,
) -> Result<Json<Value>, AppError> {
    // Anti-lockout: an admin cannot demote themselves and strand the deployment.
    if body.user_id == me.id {
        return Err(AppError::BadRequest(
            "you cannot change your own role".into(),
        ));
    }
    let email = sqlx::query_scalar::<_, String>(
        "UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING email::text",
    )
    .bind(body.make_admin)
    .bind(body.user_id)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;

    // Revoking the flag does not revoke allowlist membership — say so plainly
    // rather than letting the UI show a change that did not take effect.
    let allowlisted = st.cfg.admin_emails.contains(&email.to_lowercase());
    Ok(Json(json!({
        "ok": true,
        "id": body.user_id,
        "is_admin": body.make_admin,
        "effective_admin": body.make_admin || allowlisted,
        "allowlisted": allowlisted,
    })))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn at(iso_date: &str) -> OffsetDateTime {
        // midday UTC+8 on the given date
        let d = Date::parse(
            iso_date,
            &time::format_description::well_known::Iso8601::DATE,
        )
        .unwrap();
        d.with_hms(4, 0, 0).unwrap().assume_utc()
    }

    #[test]
    fn day_active_reads_the_flat_shape() {
        assert!(day_active(Some(&json!({ "pagi": true }))));
        assert!(day_active(Some(&json!({ "petang": true }))));
        assert!(!day_active(Some(&json!({ "pagi": false }))));
        assert!(!day_active(Some(&json!({}))));
        assert!(!day_active(None));
        // the nested shape the Node version expected must NOT count
        assert!(!day_active(Some(&json!({ "sughra": { "pagi": true } }))));
    }

    #[test]
    fn streak_counts_consecutive_days_and_forgives_today() {
        let now = at("2026-07-23");
        let m = json!({ "rekod": { "2026-07-21": { "pagi": true },
                                   "2026-07-22": { "petang": true } } });
        // today not done yet -> streak is still 2
        assert_eq!(streak_from(&m, now), 2);

        let m2 = json!({ "rekod": { "2026-07-23": { "pagi": true },
                                    "2026-07-22": { "pagi": true } } });
        assert_eq!(streak_from(&m2, now), 2);

        // a gap breaks it
        let m3 = json!({ "rekod": { "2026-07-20": { "pagi": true } } });
        assert_eq!(streak_from(&m3, now), 0);
    }

    #[test]
    fn sessions_month_counts_two_slots_per_day() {
        let now = at("2026-07-23");
        let m = json!({ "rekod": {
            "2026-07-01": { "pagi": true, "petang": true },
            "2026-07-15": { "pagi": true },
            "2026-06-30": { "pagi": true, "petang": true },  // previous month
        }});
        assert_eq!(sessions_this_month(&m, now), 3);
    }

    #[test]
    fn utc8_day_boundary() {
        // 2026-07-23 00:30 MYT is 2026-07-22 16:30 UTC. Computing the day key in
        // UTC would wrongly report the 22nd — this is the Node off-by-one.
        let utc = OffsetDateTime::from_unix_timestamp(1784739000).unwrap();
        assert_eq!(iso(utc.to_offset(TZ).date()), "2026-07-23", "MYT day");
        assert_eq!(iso(utc.date()), "2026-07-22", "naive UTC day — the Node bug");
        // `today()` must use the MYT offset, not UTC.
        assert_eq!(iso(today(utc)), "2026-07-23");
    }

    #[test]
    fn pct_and_initials() {
        assert_eq!(pct_of(35, SUGHRA_TARGET), 50);
        assert_eq!(pct_of(0, SUGHRA_TARGET), 0);
        assert_eq!(pct_of(999, SUGHRA_TARGET), 100, "clamped");
        assert_eq!(pct_of(1, 0), 0, "no divide by zero");
        assert_eq!(initials(Some("Ahmad Faiz Roslan"), "a@b.c"), "AF");
        assert_eq!(initials(None, "zaid@example.com"), "ZA");
        assert_eq!(initials(Some("   "), "qq@example.com"), "QQ", "blank name falls back");
        assert_eq!(initials(Some("Sufian"), "x@y.z"), "SU", "single-word name");
    }
}
