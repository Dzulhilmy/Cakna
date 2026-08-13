use std::collections::HashSet;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub port: u16,
    pub session_ttl_days: i64,
    pub cookie_secure: bool,
    pub static_dir: Option<String>,
    /// Lowercased emails granted admin in addition to the `users.is_admin` flag.
    /// Exists so a fresh deployment can bootstrap its first admin: with an empty
    /// allowlist and `is_admin` defaulting to false, nobody could ever reach /admin.
    pub admin_emails: HashSet<String>,
    pub qcxis: Qcxis,
    pub livekit: LiveKit,
    /// Base URL of the hub-server (e.g. `http://hub:3002`). Empty = hub proxy disabled.
    pub hub_url: String,
    /// Shared secret sent as `X-Hub-Secret` on proxy requests to the hub-server.
    pub hub_secret: String,
}

/// Self-hosted LiveKit (SFU) for halaqah audio rooms.
#[derive(Debug, Clone)]
pub struct LiveKit {
    /// Browser-facing signalling URL, e.g. `ws://localhost:7880` or `wss://live.cakna.org`.
    pub url: String,
    /// Server-facing HTTP base for the management API. Usually the same host over http(s).
    pub api_url: String,
    pub api_key: String,
    pub api_secret: String,
    /// Access-token lifetime. Rooms have no time limit, but a token is short-lived;
    /// the client asks for a new one if it needs to reconnect.
    pub token_ttl_minutes: i64,
}

impl LiveKit {
    pub fn configured(&self) -> bool {
        !self.api_key.is_empty() && !self.api_secret.is_empty()
    }
}

/// QCXIS OpenID Connect client settings.
#[derive(Debug, Clone)]
pub struct Qcxis {
    pub issuer: String,
    pub client_id: String,
    /// Optional. A public PKCE client (`token_endpoint_auth_method: none`) proves
    /// itself with the code_verifier alone; a confidential client also sends this.
    pub client_secret: String,
    pub redirect_uri: String,
    pub scope: String,
}

impl Qcxis {
    /// SSO counts as configured once a client_id exists — the secret is optional.
    pub fn configured(&self) -> bool {
        !self.client_id.is_empty()
    }
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
            admin_emails: env("ADMIN_EMAILS")
                .map(|v| parse_admin_emails(&v))
                .unwrap_or_default(),
            qcxis: Qcxis {
                issuer: env("QCXIS_ISSUER")
                    .unwrap_or_else(|| "https://qcxis.com".into())
                    .trim_end_matches('/')
                    .to_string(),
                client_id: env("QCXIS_CLIENT_ID").unwrap_or_default(),
                client_secret: env("QCXIS_CLIENT_SECRET").unwrap_or_default(),
                redirect_uri: env("QCXIS_REDIRECT_URI")
                    .unwrap_or_else(|| "http://localhost:8080/auth/sso/callback".into()),
                scope: env("QCXIS_SCOPE")
                    .unwrap_or_else(|| "openid profile email offline_access".into()),
            },
            livekit: LiveKit {
                url: env("LIVEKIT_URL").unwrap_or_else(|| "ws://localhost:7880".into()),
                api_url: env("LIVEKIT_API_URL")
                    .unwrap_or_else(|| "http://localhost:7880".into()),
                api_key: env("LIVEKIT_API_KEY").unwrap_or_default(),
                api_secret: env("LIVEKIT_API_SECRET").unwrap_or_default(),
                token_ttl_minutes: env("LIVEKIT_TOKEN_TTL_MINUTES")
                    .and_then(|v| v.parse().ok())
                    .unwrap_or(360),
            },
            hub_url: env("HUB_URL")
                .unwrap_or_default()
                .trim_end_matches('/')
                .to_string(),
            hub_secret: env("HUB_INTERNAL_SECRET").unwrap_or_default(),
        }
    }
}

/// Comma-separated, case-insensitive, whitespace-tolerant. Empty entries dropped.
fn parse_admin_emails(raw: &str) -> HashSet<String> {
    raw.split(',')
        .map(|s| s.trim().to_lowercase())
        .filter(|s| !s.is_empty())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::parse_admin_emails;

    #[test]
    fn admin_emails_parsing() {
        let set = parse_admin_emails(" Admin@QCXIS.com , ops@cakna.org ,, ");
        assert_eq!(set.len(), 2);
        assert!(set.contains("admin@qcxis.com"), "should lowercase");
        assert!(set.contains("ops@cakna.org"), "should trim");
        assert!(parse_admin_emails("").is_empty());
        assert!(parse_admin_emails("  ,  ").is_empty());
    }
}
