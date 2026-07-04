use serde::Deserialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use std::collections::HashMap;
use std::path::Path;

type BoxError = Box<dyn std::error::Error + Send + Sync>;

#[derive(Deserialize)]
struct SurahIn {
    number: i16,
    name_ar: String,
    name_translit: String,
    name_ms: String,
    name_en: String,
    ayah_count: i16,
    revelation: String,
    first_global: i32,
}

#[derive(Deserialize)]
struct AyahIn {
    global: i32,
    surah: i16,
    ayah: i16,
    page: i16,
    juz: i16,
    sajdah: bool,
    text_ar: String,
    text_plain: String,
    tajweed: Vec<i16>,
}

#[derive(Deserialize)]
struct TranslationsIn {
    ms: Vec<String>,
    en: Vec<String>,
    id: Vec<String>,
}

fn read_json<T: serde::de::DeserializeOwned>(dir: &Path, name: &str) -> Result<T, BoxError> {
    let raw = std::fs::read_to_string(dir.join(name))
        .map_err(|e| format!("read {name}: {e}"))?;
    Ok(serde_json::from_str(&raw).map_err(|e| format!("parse {name}: {e}"))?)
}

async fn count(pool: &PgPool, table: &str) -> Result<i64, BoxError> {
    Ok(sqlx::query_scalar::<_, i64>(&format!("SELECT count(*) FROM {table}"))
        .fetch_one(pool)
        .await?)
}

pub async fn run(pool: &PgPool, data_dir: &Path) -> Result<(), BoxError> {
    let surahs: Vec<SurahIn> = read_json(data_dir, "surahs.json")?;
    let ayahs: Vec<AyahIn> = read_json(data_dir, "ayahs.json")?;
    let translations: TranslationsIn = read_json(data_dir, "translations.json")?;
    let transliterations: Vec<String> = read_json(data_dir, "transliterations.json")?;
    let asma: Vec<Value> = read_json(data_dir, "asma.json")?;
    let cities: Vec<Value> = read_json(data_dir, "cities.json")?;
    let hijri_events: Vec<Value> = read_json(data_dir, "hijri_events.json")?;
    let dhikr: Vec<Value> = read_json(data_dir, "dhikr.json")?;
    let duas: Vec<Value> = read_json(data_dir, "duas.json")?;
    let mathurat: Vec<Value> = read_json(data_dir, "mathurat.json")?;
    let ibadah: Value = read_json(data_dir, "ibadah.json")?;
    let mengaji: Value = read_json(data_dir, "mengaji.json")?;
    let yasin: Value = read_json(data_dir, "yasin.json")?;
    // words.json: { "<global>": [ { ar, ms, en, id }, ... ] }
    let words: std::collections::BTreeMap<String, Value> = read_json(data_dir, "words.json")?;
    let manifest_raw = std::fs::read(data_dir.join("manifest.json"))?;
    let content_version = format!("{:x}", Sha256::digest(&manifest_raw));

    if surahs.len() != 114 || ayahs.len() != 6236 {
        return Err("artifact counts wrong before seeding".into());
    }
    if words.len() != 6236 {
        return Err(format!("words.json has {} ayahs, expected 6236", words.len()).into());
    }

    // first_page per surah, derived from the ayah rows
    let mut first_page: HashMap<i32, i16> = HashMap::new();
    for a in &ayahs {
        first_page.entry(a.global).or_insert(a.page);
    }

    let mut tx = pool.begin().await?;

    sqlx::query(
        "TRUNCATE ayah_words, ayah_translations, ayah_transliterations, ayahs, surahs, \
         asma_ul_husna, cities, hijri_events, dhikr, duas, mathurat_items, \
         module_docs, meta RESTART IDENTITY CASCADE",
    )
    .execute(&mut *tx)
    .await?;

    for s in &surahs {
        sqlx::query(
            "INSERT INTO surahs (number, name_ar, name_translit, name_ms, name_en, ayah_count, revelation, first_global, first_page) \
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        )
        .bind(s.number)
        .bind(&s.name_ar)
        .bind(&s.name_translit)
        .bind(&s.name_ms)
        .bind(&s.name_en)
        .bind(s.ayah_count)
        .bind(&s.revelation)
        .bind(s.first_global)
        .bind(first_page[&s.first_global])
        .execute(&mut *tx)
        .await?;
    }

    for a in &ayahs {
        sqlx::query(
            "INSERT INTO ayahs (global, surah, ayah, page, juz, sajdah, text_ar, text_plain, tajweed) \
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        )
        .bind(a.global)
        .bind(a.surah)
        .bind(a.ayah)
        .bind(a.page)
        .bind(a.juz)
        .bind(a.sajdah)
        .bind(&a.text_ar)
        .bind(&a.text_plain)
        .bind(&a.tajweed)
        .execute(&mut *tx)
        .await?;
    }

    let globals: Vec<i32> = (1..=6236).collect();
    for (lang, texts) in [
        ("ms", &translations.ms),
        ("en", &translations.en),
        ("id", &translations.id),
    ] {
        if texts.len() != 6236 {
            return Err(format!("translations {lang} count {}", texts.len()).into());
        }
        sqlx::query(
            "INSERT INTO ayah_translations (global, lang, text) \
             SELECT u.g, $1, u.t FROM UNNEST($2::int4[], $3::text[]) AS u(g, t)",
        )
        .bind(lang)
        .bind(&globals)
        .bind(texts)
        .execute(&mut *tx)
        .await?;
    }
    sqlx::query(
        "INSERT INTO ayah_transliterations (global, text) \
         SELECT u.g, u.t FROM UNNEST($1::int4[], $2::text[]) AS u(g, t)",
    )
    .bind(&globals)
    .bind(&transliterations)
    .execute(&mut *tx)
    .await?;

    // word-by-word: batch by chunks of globals + jsonb arrays
    let mut word_globals: Vec<i32> = Vec::with_capacity(6236);
    let mut word_arrays: Vec<Value> = Vec::with_capacity(6236);
    for (g, arr) in &words {
        word_globals.push(g.parse::<i32>().map_err(|_| format!("bad word key {g}"))?);
        word_arrays.push(arr.clone());
    }
    sqlx::query(
        "INSERT INTO ayah_words (global, words) \
         SELECT u.g, u.w FROM UNNEST($1::int4[], $2::jsonb[]) AS u(g, w)",
    )
    .bind(&word_globals)
    .bind(&word_arrays)
    .execute(&mut *tx)
    .await?;

    for a in &asma {
        sqlx::query(
            "INSERT INTO asma_ul_husna (position, arabic, translit, meaning_ms, meaning_en) \
             SELECT position, arabic, translit, meaning_ms, meaning_en \
             FROM jsonb_to_record($1::jsonb) AS r(position smallint, arabic text, translit text, meaning_ms text, meaning_en text)",
        )
        .bind(a)
        .execute(&mut *tx)
        .await?;
    }
    for c in &cities {
        sqlx::query(
            "INSERT INTO cities (id, name, lat, lng, tz, is_malaysia) \
             SELECT id, name, lat, lng, tz, is_malaysia \
             FROM jsonb_to_record($1::jsonb) AS r(id smallint, name text, lat double precision, lng double precision, tz text, is_malaysia boolean)",
        )
        .bind(c)
        .execute(&mut *tx)
        .await?;
    }
    for e in &hijri_events {
        sqlx::query(
            "INSERT INTO hijri_events (month_code, day, label_key) \
             SELECT month_code, day, label_key \
             FROM jsonb_to_record($1::jsonb) AS r(month_code text, day smallint, label_key text)",
        )
        .bind(e)
        .execute(&mut *tx)
        .await?;
    }
    for d in &dhikr {
        sqlx::query(
            "INSERT INTO dhikr (kind, position, arabic, label_ms, label_en, target_count, quran_ref, tajweed) \
             SELECT kind, position, arabic, label_ms, label_en, target_count, quran_ref, \
                    ARRAY(SELECT jsonb_array_elements_text(COALESCE(tajweed,'[]'::jsonb))::smallint) \
             FROM jsonb_to_record($1::jsonb) AS r(kind text, position smallint, arabic text, label_ms text, label_en text, target_count smallint, quran_ref jsonb, tajweed jsonb)",
        )
        .bind(d)
        .execute(&mut *tx)
        .await?;
    }
    for d in &duas {
        sqlx::query(
            "INSERT INTO duas (kind, position, title_ms, title_en, quran_ref, arabic, meaning_ms, meaning_en, tajweed) \
             SELECT kind, position, title_ms, title_en, quran_ref, arabic, meaning_ms, meaning_en, \
                    ARRAY(SELECT jsonb_array_elements_text(COALESCE(tajweed,'[]'::jsonb))::smallint) \
             FROM jsonb_to_record($1::jsonb) AS r(kind text, position smallint, title_ms text, title_en text, quran_ref jsonb, arabic text, meaning_ms text, meaning_en text, tajweed jsonb)",
        )
        .bind(d)
        .execute(&mut *tx)
        .await?;
    }
    for m in &mathurat {
        sqlx::query(
            "INSERT INTO mathurat_items (position, quran_ref, arabic, arabic_pagi, arabic_petang, repeat_n, repeat_full, core, title_ms, title_en, meaning_ms, meaning_en, tajweed, tajweed_pagi, tajweed_petang) \
             SELECT position, quran_ref, arabic, arabic_pagi, arabic_petang, repeat_n, repeat_full, core, title_ms, title_en, meaning_ms, meaning_en, \
                    ARRAY(SELECT jsonb_array_elements_text(COALESCE(tajweed,'[]'::jsonb))::smallint), \
                    ARRAY(SELECT jsonb_array_elements_text(COALESCE(tajweed_pagi,'[]'::jsonb))::smallint), \
                    ARRAY(SELECT jsonb_array_elements_text(COALESCE(tajweed_petang,'[]'::jsonb))::smallint) \
             FROM jsonb_to_record($1::jsonb) AS r(position smallint, quran_ref jsonb, arabic text, arabic_pagi text, arabic_petang text, repeat_n smallint, repeat_full smallint, core boolean, title_ms text, title_en text, meaning_ms text, meaning_en text, tajweed jsonb, tajweed_pagi jsonb, tajweed_petang jsonb)",
        )
        .bind(m)
        .execute(&mut *tx)
        .await?;
    }
    for (slug, body) in [("ibadah", &ibadah), ("mengaji", &mengaji), ("yasin", &yasin)] {
        sqlx::query("INSERT INTO module_docs (slug, body) VALUES ($1, $2)")
            .bind(slug)
            .bind(body)
            .execute(&mut *tx)
            .await?;
    }
    sqlx::query("INSERT INTO meta (key, value) VALUES ('content_version', $1)")
        .bind(&content_version)
        .execute(&mut *tx)
        .await?;

    tx.commit().await?;

    // Post-seed validation
    let checks: [(&str, i64); 11] = [
        ("surahs", 114),
        ("ayahs", 6236),
        ("ayah_translations", 18708),
        ("ayah_transliterations", 6236),
        ("ayah_words", 6236),
        ("asma_ul_husna", 99),
        ("cities", 54),
        ("dhikr", 14),
        ("duas", 42),
        ("mathurat_items", 28),
        ("module_docs", 3),
    ];
    for (table, expected) in checks {
        let n = count(pool, table).await?;
        if n != expected {
            return Err(format!("{table}: {n} rows, expected {expected}").into());
        }
    }
    let sajdah: i64 = sqlx::query_scalar("SELECT count(*) FROM ayahs WHERE sajdah")
        .fetch_one(pool)
        .await?;
    if sajdah != 15 {
        return Err(format!("sajdah rows: {sajdah}").into());
    }
    tracing::info!("seed OK — content_version {content_version}");
    println!("seed OK — content_version {content_version}");
    Ok(())
}

/// Locate the data/extracted dir: explicit arg, env, or well-known relative paths.
pub fn find_data_dir(arg: Option<String>) -> Result<std::path::PathBuf, BoxError> {
    let candidates: Vec<std::path::PathBuf> = arg
        .into_iter()
        .map(Into::into)
        .chain(std::env::var("CAKNA_DATA_DIR").ok().map(Into::into))
        .chain([
            "data/extracted".into(),
            "../data/extracted".into(),
            "/app/data/extracted".into(),
        ])
        .collect();
    for c in candidates {
        if c.join("manifest.json").exists() {
            return Ok(c);
        }
    }
    Err("data/extracted not found (pass a path or set CAKNA_DATA_DIR)".into())
}
