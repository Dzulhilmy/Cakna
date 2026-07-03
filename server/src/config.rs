#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub port: u16,
    pub session_ttl_days: i64,
    pub cookie_secure: bool,
    pub static_dir: Option<String>,
}

impl Config {
    pub fn from_env() -> Self {
        let env = |k: &str| std::env::var(k).ok().filter(|v| !v.is_empty());
        Self {
            database_url: env("DATABASE_URL")
                .unwrap_or_else(|| "postgres://cakna:cakna@localhost:54329/cakna".into()),
            port: env("PORT").and_then(|v| v.parse().ok()).unwrap_or(8080),
            session_ttl_days: env("SESSION_TTL_DAYS")
                .and_then(|v| v.parse().ok())
                .unwrap_or(30),
            cookie_secure: env("COOKIE_SECURE").map(|v| v == "true").unwrap_or(false),
            static_dir: env("STATIC_DIR"),
        }
    }
}
