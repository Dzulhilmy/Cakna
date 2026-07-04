pub mod auth;
pub mod config;
pub mod content;
pub mod error;
pub mod normalize;
pub mod seed;
pub mod solat;
pub mod state;
pub mod sync;

use axum::routing::{get, post, put};
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
        .route("/auth/register", post(auth::routes::register))
        .route("/auth/login", post(auth::routes::login))
        .route("/auth/logout", post(auth::routes::logout))
        .route("/auth/me", get(auth::routes::me))
        .route("/sync", get(sync::routes::get_all).put(sync::routes::put_batch))
        .route("/sync/export", get(sync::routes::export))
        .route("/sync/:key", put(sync::routes::put_key))
        .with_state(st.clone());

    let mut app = Router::new().nest("/api", api);

    if let Some(dir) = &st.cfg.static_dir {
        let serve =
            ServeDir::new(dir).fallback(ServeFile::new(format!("{dir}/index.html")));
        app = app.fallback_service(serve);
    }

    app.layer(CompressionLayer::new())
        .layer(TraceLayer::new_for_http())
}
