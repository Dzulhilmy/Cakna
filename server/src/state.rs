use crate::config::Config;
use sqlx::PgPool;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub cfg: Arc<Config>,
    /// ETag for all content endpoints; set from meta.content_version at boot.
    pub content_version: Arc<str>,
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
