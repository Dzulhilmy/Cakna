//! Official JAKIM e-Solat prayer times, proxied (the upstream API has no CORS)
//! and cached per zone for the current Malaysian (UTC+8) day.
use crate::error::AppError;
use crate::state::AppState;
use axum::extract::{Path, State};
use axum::Json;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::sync::Arc;
use time::{Duration, OffsetDateTime};
use tokio::sync::RwLock;

pub type SolatCache = Arc<RwLock<HashMap<String, (String, Value)>>>;

const ZONE_PREFIXES: [&str; 14] = [
    "JHR", "KDH", "KTN", "MLK", "NGS", "PHG", "PLS", "PNG", "PRK", "SBH", "SWK", "SGR", "TRG",
    "WLY",
];

fn valid_zone(zone: &str) -> bool {
    zone.len() == 5
        && ZONE_PREFIXES.contains(&&zone[..3])
        && zone[3..].bytes().all(|b| b.is_ascii_digit())
}

/// Date key in Malaysian time — e-solat rolls over at MYT midnight.
fn myt_today() -> String {
    let now = OffsetDateTime::now_utc() + Duration::hours(8);
    format!("{:04}-{:02}-{:02}", now.year(), now.month() as u8, now.day())
}

pub async fn zone_times(
    State(st): State<AppState>,
    Path(zone): Path<String>,
) -> Result<Json<Value>, AppError> {
    let zone = zone.to_uppercase();
    if !valid_zone(&zone) {
        return Err(AppError::BadRequest("unknown JAKIM zone".into()));
    }
    let today = myt_today();

    if let Some((date, cached)) = st.solat_cache.read().await.get(&zone) {
        if *date == today {
            return Ok(Json(cached.clone()));
        }
    }

    let url = format!(
        "https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone={zone}"
    );
    let resp: Value = st
        .http
        .get(&url)
        .timeout(std::time::Duration::from_secs(10))
        .send()
        .await
        .map_err(|e| AppError::Upstream(format!("e-solat: {e}")))?
        .json()
        .await
        .map_err(|e| AppError::Upstream(format!("e-solat json: {e}")))?;

    let pt = &resp["prayerTime"][0];
    if resp["status"].as_str().map(|s| s.starts_with("OK")) != Some(true) || pt["fajr"].is_null() {
        return Err(AppError::Upstream("e-solat: bad response".into()));
    }
    let out = json!({
        "zone": zone,
        "date": pt["date"],
        "hijri": pt["hijri"],
        "times": {
            "Imsak": pt["imsak"],
            "Subuh": pt["fajr"],
            "Syuruk": pt["syuruk"],
            "Dhuha": pt["dhuha"],
            "Zohor": pt["dhuhr"],
            "Asar": pt["asr"],
            "Maghrib": pt["maghrib"],
            "Isyak": pt["isha"],
        }
    });
    st.solat_cache
        .write()
        .await
        .insert(zone, (today, out.clone()));
    Ok(Json(out))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zone_validation() {
        assert!(valid_zone("PRK02"));
        assert!(valid_zone("WLY01"));
        assert!(!valid_zone("prk02")); // handler uppercases before calling
        assert!(!valid_zone("XXX01"));
        assert!(!valid_zone("PRK2"));
        assert!(!valid_zone("PRK0a"));
        assert!(!valid_zone("PRK021"));
    }
}
