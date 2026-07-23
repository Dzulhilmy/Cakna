use crate::config::Config;
use crate::mathurat::MathuratHub;
use crate::solat::SolatCache;
use sqlx::PgPool;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub cfg: Arc<Config>,
    /// ETag for all content endpoints; set from meta.content_version at boot.
    pub content_version: Arc<str>,
    /// e-solat proxy: per-zone daily cache + shared HTTP client.
    pub solat_cache: SolatCache,
    pub http: reqwest::Client,
    /// Live Al-Ma'thurat session: in-memory presence + broadcast (not persisted).
    pub mathurat: MathuratHub,
}

impl AppState {
    pub fn new(pool: PgPool, cfg: Config, content_version: Arc<str>) -> Self {
        Self {
            pool,
            cfg: Arc::new(cfg),
            content_version,
            solat_cache: SolatCache::default(),
            http: reqwest::Client::new(),
            mathurat: MathuratHub::default(),
        }
    }
}

impl AppState {
    pub async fn load_content_version(pool: &PgPool) -> Arc<str> {
        sqlx::query_scalar::<_, String>("SELECT value FROM meta WHERE key = 'content_version'")
            .fetch_optional(pool)
            .await
            .ok()
            .flatten()
            .unwrap_or_else(|| "unseeded".into())
            .into()
    }
}
