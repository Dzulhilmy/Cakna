use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub port: u16,
    pub cakna_api_url: String,
    pub uploads_dir: String,
    pub internal_secret: String,
    pub telegram_bot_token: Option<String>,
    pub telegram_chat_id: Option<String>,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            database_url: env::var("HUB_DATABASE_URL")
                .expect("HUB_DATABASE_URL must be set"),
            port: env::var("HUB_PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(3002),
            cakna_api_url: env::var("CAKNA_API_URL")
                .unwrap_or_else(|_| "https://cakna.org".into())
                .trim_end_matches('/')
                .to_string(),
            uploads_dir: env::var("HUB_UPLOADS_DIR")
                .unwrap_or_else(|_| "./public/uploads".into()),
            // Used by SvelteKit to prove it's an internal caller.
            // Set to any long random string; must match HUB_INTERNAL_SECRET in .env
            internal_secret: env::var("HUB_INTERNAL_SECRET")
                .unwrap_or_default(),
            telegram_bot_token: env::var("TELEGRAM_BOT_TOKEN").ok(),
            telegram_chat_id: env::var("TELEGRAM_CHAT_ID").ok(),
        }
    }
}
