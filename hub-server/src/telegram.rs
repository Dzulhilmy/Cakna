use reqwest::Client;
use serde_json::json;

use crate::routes::notifications::NotificationRow;

const DIVIDER: &str = "━━━━━━━━━━━━━━━━━━━━━━";

struct TypeMeta {
    emoji: &'static str,
}

fn type_meta(t: &str) -> TypeMeta {
    match t {
        "kemalangan" => TypeMeta { emoji: "🚗" },
        "takziah"    => TypeMeta { emoji: "🕊️" },
        "kesihatan"  => TypeMeta { emoji: "🏥" },
        _            => TypeMeta { emoji: "📍" },
    }
}

pub async fn send_notification(http: &Client, token: &str, chat_id: &str, n: &NotificationRow) {
    let meta = type_meta(&n.notification_type);

    // Telegram HTML mode: only <b>, <i>, <a>, <code>, <pre> are allowed.
    let text = format!(
        "📍 <b>CAKNA UNTUK KELUARGA HOME</b>\n\
         <i>Satu Sentuhan, Sejuta Makna</i>\n\
         \n\
         {emoji} <b>{title}</b>\n\
         \n\
         {content}\n\
         \n\
         {divider}\n\
         💗 <b>Bersama Kita CAKNA</b>\n\
         {callout}\n\
         {divider}\n\
         \n\
         <i>Salam CAKNA,\n\
         Service: Our Mission\n\
         Equations: Our Passion</i>",
        emoji   = meta.emoji,
        title   = escape_html(&n.title),
        content = escape_html(&n.content),
        callout = escape_html(&n.callout),
        divider = DIVIDER,
    );

    let url = format!("https://api.telegram.org/bot{token}/sendMessage");
    let body = json!({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    });

    match http.post(&url).json(&body).send().await {
        Ok(resp) if resp.status().is_success() => {
            tracing::info!("Telegram notification sent for announcement '{}'", n.title);
        }
        Ok(resp) => {
            let status = resp.status();
            let body = resp.text().await.unwrap_or_default();
            tracing::warn!("Telegram API returned {status}: {body}");
        }
        Err(e) => {
            tracing::warn!("Failed to send Telegram notification: {e}");
        }
    }
}

fn escape_html(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
}
