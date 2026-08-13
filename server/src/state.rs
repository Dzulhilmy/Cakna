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
    /// Cached OIDC discovery document. Fetched once on the first SSO request;
    /// safe to hold because the issuer is fixed at boot.
    pub oidc: Arc<tokio::sync::RwLock<Option<crate::auth::sso::Discovery>>>,
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
            oidc: Arc::new(tokio::sync::RwLock::new(None)),
        }
    }
}

impl AppState {
    /// Effective admin check: the `users.is_admin` flag OR the ADMIN_EMAILS allowlist.
    /// Kept in one place so the `/api/auth/me` payload and the admin guard (Phase 4)
    /// can never disagree about who counts as an admin.
    pub fn is_admin(&self, user: &crate::auth::session::AuthUser) -> bool {
        user.is_admin_flag || self.cfg.admin_emails.contains(&user.email.to_lowercase())
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
