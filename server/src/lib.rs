pub mod admin;
pub mod auth;
pub mod config;
pub mod content;
pub mod error;
pub mod halaqah;
pub mod hub;
pub mod mathurat;
pub mod normalize;
pub mod seed;
pub mod solat;
pub mod state;
pub mod sync;

use axum::extract::DefaultBodyLimit;
use axum::http::StatusCode;
use axum::routing::{delete, get, post, put};
use axum::{Json, Router};
use state::AppState;
use tower_http::compression::CompressionLayer;
use tower_http::services::{ServeDir, ServeFile};
use tower_http::trace::TraceLayer;

async fn health(
    axum::extract::State(st): axum::extract::State<AppState>,
) -> Json<serde_json::Value> {
    let db = sqlx::query_scalar::<_, i32>("SELECT 1")
        .fetch_one(&st.pool)
        .await
        .is_ok();
    Json(serde_json::json!({ "status": "ok", "db": db }))
}

pub fn router(st: AppState) -> Router {
    let content = Router::new()
        .route("/meta", get(content::routes::meta))
        .route("/pages/:page", get(content::routes::page))
        .route("/surahs/:number", get(content::routes::surah))
        .route("/ayahs/:global", get(content::routes::ayah))
        .route("/ayahs/:global/words", get(content::routes::words))
        .route("/search", get(content::routes::search))
        .route("/modules/:slug", get(content::routes::module))
        .layer(axum::middleware::from_fn_with_state(
            st.clone(),
            content::cache_middleware,
        ));

    let api = Router::new()
        .route("/health", get(health))
        .merge(content)
        .route("/solat/:zone", get(solat::zone_times))
        // Live Al-Ma'thurat session (real-time presence). Reads open; writes authed.
        .route("/mathurat/live", get(mathurat::live))
        .route(
            "/mathurat/presence",
            get(mathurat::snapshot).post(mathurat::update),
        )
        .route("/mathurat/leave", post(mathurat::leave))
        .route("/auth/register", post(auth::routes::register))
        .route("/auth/login", post(auth::routes::login))
        .route("/auth/logout", post(auth::routes::logout))
        .route("/auth/me", get(auth::routes::me))
        .route("/account", delete(auth::routes::delete_account))
        .route("/sync", get(sync::routes::get_all).put(sync::routes::put_batch))
        .route("/sync/export", get(sync::routes::export))
        .route("/sync/:key", put(sync::routes::put_key))
        // Admin surface. Every handler takes the AdminUser extractor, so these
        // are 401 unauthenticated / 403 for a signed-in non-admin.
        .route("/admin/overview", get(admin::overview))
        .route("/admin/users", get(admin::list_users))
        .route("/admin/set-role", post(admin::set_role))
        .route("/auth/sso-status", get(auth::sso::status))
        // Halaqah — moderated group audio rooms. Creating requires admin;
        // listing/joining requires any session; speaker + close require the host.
        .route("/halaqah/rooms", get(halaqah::list).post(halaqah::create))
        .route("/halaqah/rooms/:slug/join", post(halaqah::join))
        .route("/halaqah/rooms/:slug/speaker", post(halaqah::set_speaker))
        .route("/halaqah/rooms/:slug/page", post(halaqah::set_page))
        .route("/halaqah/rooms/:slug/share", post(halaqah::set_share))
        .route("/halaqah/rooms/:slug/close", post(halaqah::close))
        // Hub content proxy — public, no auth. Returns {} / [] when hub isn't configured.
        .route("/hub/site", get(hub::site))
        .route("/hub/programs", get(hub::programs))
        // Hub authenticated proxies — require a Cakna session; resolve hub_user transparently.
        .route("/hub/funding", post(hub::submit_funding))
        .route("/hub/funding/mine", get(hub::my_funding))
        .route("/hub/notifications", get(hub::notifications))
        .route("/hub/events", get(hub::events))
        .route("/hub/notices", get(hub::notices))
        .route("/hub/notices/:id/read", post(hub::mark_notice_read))
        // A mistyped /api path should say so in JSON, not fall through to the
        // SPA fallback and hand an API client a page of HTML.
        .fallback(|| async {
            (
                StatusCode::NOT_FOUND,
                Json(serde_json::json!({ "error": "not found" })),
            )
        })
        // A full bookmarks+notes payload can exceed axum's 2 MB default; the
        // Node server allowed 4 MB, so keep parity or large syncs start 413ing.
        .layer(DefaultBodyLimit::max(4 * 1024 * 1024))
        .with_state(st.clone());

    // QCXIS SSO lives OUTSIDE /api: the provider redirects a browser to these
    // paths, and they must be matched before the SPA fallback swallows them.
    let sso = Router::new()
        .route("/auth/sso/start", get(auth::sso::start))
        .route("/auth/sso/callback", get(auth::sso::callback))
        .with_state(st.clone());

    // Page routes that must be matched BEFORE the SPA fallback, or they silently
    // render the user app instead.
    let pages = Router::new()
        .route("/admin", get(admin::page))
        .with_state(st.clone());

    let mut app = Router::new().nest("/api", api).merge(sso).merge(pages);

    if let Some(dir) = &st.cfg.static_dir {
        let serve =
            ServeDir::new(dir).fallback(ServeFile::new(format!("{dir}/index.html")));
        app = app.fallback_service(serve);
    }

    app.layer(CompressionLayer::new())
        .layer(TraceLayer::new_for_http())
}
