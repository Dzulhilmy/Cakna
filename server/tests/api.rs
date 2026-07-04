//! Integration tests. Gated: they no-op unless CAKNA_TEST_DATABASE_URL is set
//! (e.g. postgres://cakna:cakna@localhost:54329/cakna with `docker compose up -d`).
//! The suite migrates and (if needed) seeds that database from ../data/extracted.

use cakna::config::Config;
use cakna::state::AppState;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

async fn spawn() -> Option<(String, PgPool)> {
    let Ok(url) = std::env::var("CAKNA_TEST_DATABASE_URL") else {
        eprintln!("CAKNA_TEST_DATABASE_URL not set — skipping integration test");
        return None;
    };
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&url)
        .await
        .expect("connect test db");
    sqlx::migrate!("./migrations").run(&pool).await.expect("migrate");

    let seeded: i64 = sqlx::query_scalar("SELECT count(*) FROM surahs")
        .fetch_one(&pool)
        .await
        .unwrap();
    if seeded != 114 {
        let dir = cakna::seed::find_data_dir(None).expect("data dir");
        cakna::seed::run(&pool, &dir).await.expect("seed");
    }

    let cfg = Config {
        database_url: url,
        port: 0,
        session_ttl_days: 30,
        cookie_secure: false,
        static_dir: None,
    };
    let content_version = AppState::load_content_version(&pool).await;
    let st = AppState::new(pool.clone(), cfg, content_version);
    let app = cakna::router(st);
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    Some((format!("http://{addr}"), pool))
}

fn client() -> reqwest::Client {
    reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap()
}

#[tokio::test]
async fn content_parity() {
    let Some((base, pool)) = spawn().await else { return };
    let c = client();

    // page 1 = Al-Fatihah 1..7 with Basmeih ms
    let p1: serde_json::Value = c.get(format!("{base}/api/pages/1")).send().await.unwrap().json().await.unwrap();
    assert_eq!(p1["page"], 1);
    assert_eq!(p1["ayahs"].as_array().unwrap().len(), 7);
    assert_eq!(p1["surahs"][0]["name_translit"], "Al-Fatihah");
    assert!(p1["ayahs"][0]["tr"]["ms"].as_str().unwrap().contains("Dengan nama Allah"));

    // page 2 starts at 2:1 = global 8
    let p2: serde_json::Value = c.get(format!("{base}/api/pages/2")).send().await.unwrap().json().await.unwrap();
    assert_eq!(p2["ayahs"][0]["global"], 8);
    assert_eq!(p2["ayahs"][0]["surah"], 2);
    assert_eq!(p2["ayahs"][0]["ayah"], 1);

    // page 604 = surahs 112..114
    let p604: serde_json::Value = c.get(format!("{base}/api/pages/604")).send().await.unwrap().json().await.unwrap();
    let nums: Vec<i64> = p604["surahs"].as_array().unwrap().iter().map(|s| s["number"].as_i64().unwrap()).collect();
    assert_eq!(nums, vec![112, 113, 114]);

    // global 6236 = 114:6
    let last: serde_json::Value = c.get(format!("{base}/api/ayahs/6236")).send().await.unwrap().json().await.unwrap();
    assert_eq!(last["ayah"]["surah"], 114);
    assert_eq!(last["ayah"]["ayah"], 6);

    // word-by-word: 1:1 has 4 words, each with ms/en/id gloss
    let words: serde_json::Value = c.get(format!("{base}/api/ayahs/1/words")).send().await.unwrap().json().await.unwrap();
    assert_eq!(words["global"], 1);
    let ws = words["words"].as_array().unwrap();
    assert_eq!(ws.len(), 4);
    assert_eq!(ws[1]["ms"], "Allah");
    assert!(ws[0]["ar"].as_str().unwrap().contains('س')); // بِسْمِ
    for w in ws {
        for k in ["ar", "ms", "en", "id"] {
            assert!(!w[k].as_str().unwrap().is_empty(), "empty {k}");
        }
    }
    // 2:255 (Ayat Kursi, global 262) = 50 words
    let kursi: serde_json::Value = c.get(format!("{base}/api/ayahs/262/words")).send().await.unwrap().json().await.unwrap();
    assert_eq!(kursi["words"].as_array().unwrap().len(), 50);
    // out of range → 404
    assert_eq!(c.get(format!("{base}/api/ayahs/9999/words")).send().await.unwrap().status(), 404);

    // meta: 114 surahs, juz 2 starts at global 149
    let meta: serde_json::Value = c.get(format!("{base}/api/meta")).send().await.unwrap().json().await.unwrap();
    assert_eq!(meta["surahs"].as_array().unwrap().len(), 114);
    assert_eq!(meta["juz_starts"][1], 149);
    assert_eq!(meta["juz_starts"].as_array().unwrap().len(), 30);
    assert_eq!(meta["sajdah"].as_array().unwrap().len(), 15);

    // out of range → 404
    assert_eq!(c.get(format!("{base}/api/pages/605")).send().await.unwrap().status(), 404);
    assert_eq!(c.get(format!("{base}/api/ayahs/6237")).send().await.unwrap().status(), 404);

    // tajweed integrity sweep: every triple in bounds (no surrogates in corpus,
    // so PG char_length == JS UTF-16 length)
    let bad: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM (
           SELECT global, tajweed[i] AS pos, tajweed[i+1] AS len, tajweed[i+2] AS rule,
                  char_length(text_ar) AS tlen
           FROM ayahs, generate_series(1, array_length(tajweed,1), 3) AS i
           WHERE array_length(tajweed,1) > 0
         ) t
         WHERE rule NOT BETWEEN 0 AND 10 OR pos < 0 OR pos + len > tlen",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(bad, 0, "tajweed triples out of bounds");
}

#[tokio::test]
async fn norm_ar_parity_full_corpus() {
    let Some((_base, pool)) = spawn().await else { return };
    let rows: Vec<(String, String)> =
        sqlx::query_as("SELECT text_ar, text_plain FROM ayahs ORDER BY global")
            .fetch_all(&pool)
            .await
            .unwrap();
    assert_eq!(rows.len(), 6236);
    for (ar, plain) in rows {
        assert_eq!(cakna::normalize::norm_ar(&ar), plain, "norm_ar drift for: {ar}");
    }
}

#[tokio::test]
async fn search_behaviour() {
    let Some((base, _pool)) = spawn().await else { return };
    let c = client();

    for q in ["الْحَمْدُ", "الحمد"] {
        let r: serde_json::Value = c
            .get(format!("{base}/api/search"))
            .query(&[("q", q)])
            .send().await.unwrap().json().await.unwrap();
        let first = &r["hits"][0];
        assert_eq!((first["surah"].as_i64(), first["ayah"].as_i64()), (Some(1), Some(2)), "query {q}");
    }

    let ms: serde_json::Value = c
        .get(format!("{base}/api/search"))
        .query(&[("q", "puji")])
        .send().await.unwrap().json().await.unwrap();
    assert!(ms["total"].as_i64().unwrap() > 0);
    assert_eq!(ms["hits"][0]["surah"], 1);

    // too short → 400
    let short = c.get(format!("{base}/api/search")).query(&[("q", "ab")]).send().await.unwrap();
    assert_eq!(short.status(), 400);
}

#[tokio::test]
async fn auth_and_sync_flow() {
    let Some((base, _pool)) = spawn().await else { return };
    let c = client();
    let email = format!("t{}@cakna.test", uuid::Uuid::new_v4().simple());
    let creds = serde_json::json!({ "email": email, "password": "secret123" });

    // register → 201 with cookie
    let r = c.post(format!("{base}/api/auth/register")).json(&creds).send().await.unwrap();
    assert_eq!(r.status(), 201);

    // duplicate → 409
    let dup = client().post(format!("{base}/api/auth/register")).json(&creds).send().await.unwrap();
    assert_eq!(dup.status(), 409);

    // me
    let me: serde_json::Value = c.get(format!("{base}/api/auth/me")).send().await.unwrap().json().await.unwrap();
    assert_eq!(me["email"], email.as_str());

    // sync round-trip every key
    let values = serde_json::json!({
        "settings": {"theme":"dark","fontSize":28,"page":42},
        "bookmarks": [1, 302, 604],
        "notes": {"1":"nota pertama"},
        "hls": {"8": 2},
        "read": [1, 2, 3],
        "readlog": {"2026-07-03": 3},
        "khatamToasted": false,
        "tasbih": {"c":10,"t":33,"label":"Tasbih bebas"},
        "city": 0,
        "sgdays": 30,
        "onboarded": true,
        "mathurat": {"d":"2026-07-03","v":"s"},
        "mgquiz": {"best":7},
        "puasa": {"adj":0,"recs":[]},
        "manasik": {"t":0,"s":0}
    });
    for (k, v) in values.as_object().unwrap() {
        let r = c.put(format!("{base}/api/sync/{k}")).json(v).send().await.unwrap();
        assert_eq!(r.status(), 200, "put {k}");
    }
    let all: serde_json::Value = c.get(format!("{base}/api/sync")).send().await.unwrap().json().await.unwrap();
    let keys = all["keys"].as_object().unwrap();
    assert_eq!(keys.len(), 15);
    for (k, v) in values.as_object().unwrap() {
        assert_eq!(&keys[k]["value"], v, "roundtrip {k}");
    }

    // updated_at monotonic on rewrite
    let t1 = keys["settings"]["updated_at"].as_str().unwrap().to_string();
    let r: serde_json::Value = c
        .put(format!("{base}/api/sync/settings"))
        .json(&serde_json::json!({"theme":"sepia"}))
        .send().await.unwrap().json().await.unwrap();
    assert!(r["updated_at"].as_str().unwrap() > t1.as_str());

    // unknown key → 400
    let bad = c.put(format!("{base}/api/sync/evil")).json(&serde_json::json!({})).send().await.unwrap();
    assert_eq!(bad.status(), 400);

    // batch
    let batch = serde_json::json!([
        {"key":"bookmarks","value":[7]},
        {"key":"sgdays","value":60}
    ]);
    let rb = c.put(format!("{base}/api/sync")).json(&batch).send().await.unwrap();
    assert_eq!(rb.status(), 200);

    // export envelope
    let exp: serde_json::Value = c.get(format!("{base}/api/sync/export")).send().await.unwrap().json().await.unwrap();
    assert_eq!(exp["app"], "cakna");
    assert_eq!(exp["v"], 1);
    assert_eq!(exp["bookmarks"], serde_json::json!([7]));
    assert_eq!(exp["sgdays"], 60);

    // unauthenticated sync → 401
    let anon = client().get(format!("{base}/api/sync")).send().await.unwrap();
    assert_eq!(anon.status(), 401);

    // wrong password → 401
    let wrong = client()
        .post(format!("{base}/api/auth/login"))
        .json(&serde_json::json!({"email": email, "password": "wrongpass"}))
        .send().await.unwrap();
    assert_eq!(wrong.status(), 401);

    // login → logout → me 401
    let c2 = client();
    let r = c2.post(format!("{base}/api/auth/login")).json(&creds).send().await.unwrap();
    assert_eq!(r.status(), 200);
    c2.post(format!("{base}/api/auth/logout")).send().await.unwrap();
    assert_eq!(c2.get(format!("{base}/api/auth/me")).send().await.unwrap().status(), 401);
}
