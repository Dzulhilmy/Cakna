use cakna::config::Config;
use cakna::state::AppState;
use sqlx::postgres::PgPoolOptions;
use std::time::Duration;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "cakna=info,tower_http=info".into()),
        )
        .init();

    let cfg = Config::from_env();

    // Retry connect so `docker compose up` ordering doesn't matter.
    let pool = {
        let mut attempt = 0u32;
        loop {
            match PgPoolOptions::new()
                .max_connections(10)
                .acquire_timeout(Duration::from_secs(5))
                .connect(&cfg.database_url)
                .await
            {
                Ok(p) => break p,
                Err(e) if attempt < 20 => {
                    attempt += 1;
                    tracing::warn!("db connect failed (attempt {attempt}): {e}");
                    tokio::time::sleep(Duration::from_secs(2)).await;
                }
                Err(e) => panic!("cannot connect to database: {e}"),
            }
        }
    };

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("migrations failed");

    let content_version = AppState::load_content_version(&pool).await;
    let st = AppState::new(pool, cfg.clone(), content_version);

    // Auto-close Halaqah rooms that exceed the 5-hour limit.
    let st_bg = st.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(5 * 60));
        loop {
            interval.tick().await;
            cakna::halaqah::close_stale(&st_bg).await;
        }
    });

    let app = cakna::router(st);
    let addr = format!("0.0.0.0:{}", cfg.port);
    tracing::info!("listening on {addr}");
    let listener = tokio::net::TcpListener::bind(&addr).await.expect("bind");
    axum::serve(listener, app)
        .with_graceful_shutdown(async {
            tokio::signal::ctrl_c().await.ok();
        })
        .await
        .expect("server error");
}
