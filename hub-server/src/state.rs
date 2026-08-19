use crate::config::Config;
use reqwest::Client;
use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub cfg: Config,
    pub http: Client,
}

impl AppState {
    pub fn new(pool: PgPool, cfg: Config) -> Self {
        Self {
            pool,
            cfg,
            http: Client::builder()
                .timeout(std::time::Duration::from_secs(8))
                .build()
                .expect("http client"),
        }
    }
}
