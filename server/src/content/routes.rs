use crate::error::AppError;
use crate::normalize::{escape_like, has_arabic, norm_ar};
use crate::state::AppState;
use axum::extract::{Path, Query, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct SurahMeta {
    pub number: i16,
    pub name_ar: String,
    pub name_translit: String,
    pub name_ms: String,
    pub name_en: String,
    pub ayah_count: i16,
    pub revelation: String,
    pub first_global: i32,
    pub first_page: i16,
}

#[derive(FromRow)]
struct AyahRow {
    global: i32,
    surah: i16,
    ayah: i16,
    page: i16,
    juz: i16,
    sajdah: bool,
    text_ar: String,
    tajweed: Vec<i16>,
    translit: String,
    ms: String,
    en: String,
    id: String,
}

#[derive(Serialize)]
struct AyahOut {
    global: i32,
    surah: i16,
    ayah: i16,
    page: i16,
    juz: i16,
    sajdah: bool,
    ar: String,
    taj: Vec<i16>,
    translit: String,
    tr: TrOut,
}

#[derive(Serialize)]
struct TrOut {
    ms: String,
    en: String,
    id: String,
}

impl From<AyahRow> for AyahOut {
    fn from(r: AyahRow) -> Self {
        AyahOut {
            global: r.global,
            surah: r.surah,
            ayah: r.ayah,
            page: r.page,
            juz: r.juz,
            sajdah: r.sajdah,
            ar: r.text_ar,
            taj: r.tajweed,
            translit: r.translit,
            tr: TrOut { ms: r.ms, en: r.en, id: r.id },
        }
    }
}

const AYAH_SELECT: &str = "SELECT a.global, a.surah, a.ayah, a.page, a.juz, a.sajdah, a.text_ar, a.tajweed, \
       tl.text AS translit, tms.text AS ms, ten.text AS en, tid.text AS id \
FROM ayahs a \
JOIN ayah_transliterations tl ON tl.global = a.global \
JOIN ayah_translations tms ON tms.global = a.global AND tms.lang = 'ms' \
JOIN ayah_translations ten ON ten.global = a.global AND ten.lang = 'en' \
JOIN ayah_translations tid ON tid.global = a.global AND tid.lang = 'id'";

async fn surah_metas_for(
    st: &AppState,
    numbers: &[i16],
) -> Result<Vec<SurahMeta>, AppError> {
    Ok(sqlx::query_as::<_, SurahMeta>(
        "SELECT * FROM surahs WHERE number = ANY($1) ORDER BY number",
    )
    .bind(numbers)
    .fetch_all(&st.pool)
    .await?)
}

pub async fn meta(State(st): State<AppState>) -> Result<Json<Value>, AppError> {
    let surahs = sqlx::query_as::<_, SurahMeta>("SELECT * FROM surahs ORDER BY number")
        .fetch_all(&st.pool)
        .await?;
    if surahs.is_empty() {
        return Err(AppError::Internal("content not seeded".into()));
    }
    let juz_starts = sqlx::query_scalar::<_, i32>(
        "SELECT min(global)::int4 FROM ayahs GROUP BY juz ORDER BY juz",
    )
    .fetch_all(&st.pool)
    .await?;
    let sajdah = sqlx::query_as::<_, (i16, i16)>(
        "SELECT surah, ayah FROM ayahs WHERE sajdah ORDER BY global",
    )
    .fetch_all(&st.pool)
    .await?
    .into_iter()
    .map(|(s, a)| format!("{s}:{a}"))
    .collect::<Vec<_>>();

    Ok(Json(json!({
        "surahs": surahs,
        "juz_starts": juz_starts,
        "page_count": 604,
        "sajdah": sajdah,
        "content_version": &*st.content_version,
    })))
}

pub async fn page(
    State(st): State<AppState>,
    Path(page): Path<i16>,
) -> Result<Json<Value>, AppError> {
    if !(1..=604).contains(&page) {
        return Err(AppError::NotFound);
    }
    let rows = sqlx::query_as::<_, AyahRow>(&format!(
        "{AYAH_SELECT} WHERE a.page = $1 ORDER BY a.global"
    ))
    .bind(page)
    .fetch_all(&st.pool)
    .await?;
    let mut surah_nums: Vec<i16> = rows.iter().map(|r| r.surah).collect();
    surah_nums.dedup();
    let surahs = surah_metas_for(&st, &surah_nums).await?;
    let juz = rows.first().map(|r| r.juz).unwrap_or(0);
    let ayahs: Vec<AyahOut> = rows.into_iter().map(Into::into).collect();
    Ok(Json(json!({ "page": page, "juz": juz, "surahs": surahs, "ayahs": ayahs })))
}

pub async fn surah(
    State(st): State<AppState>,
    Path(number): Path<i16>,
) -> Result<Json<Value>, AppError> {
    if !(1..=114).contains(&number) {
        return Err(AppError::NotFound);
    }
    let rows = sqlx::query_as::<_, AyahRow>(&format!(
        "{AYAH_SELECT} WHERE a.surah = $1 ORDER BY a.global"
    ))
    .bind(number)
    .fetch_all(&st.pool)
    .await?;
    let surahs = surah_metas_for(&st, &[number]).await?;
    let ayahs: Vec<AyahOut> = rows.into_iter().map(Into::into).collect();
    Ok(Json(json!({ "surah": surahs.into_iter().next(), "ayahs": ayahs })))
}

pub async fn ayah(
    State(st): State<AppState>,
    Path(global): Path<i32>,
) -> Result<Json<Value>, AppError> {
    if !(1..=6236).contains(&global) {
        return Err(AppError::NotFound);
    }
    let row = sqlx::query_as::<_, AyahRow>(&format!(
        "{AYAH_SELECT} WHERE a.global = $1"
    ))
    .bind(global)
    .fetch_optional(&st.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    let surahs = surah_metas_for(&st, &[row.surah]).await?;
    Ok(Json(json!({ "surah": surahs.into_iter().next(), "ayah": AyahOut::from(row) })))
}

/// Word-by-word data for one ayah: ordered array of { ar, ms, en, id }.
pub async fn words(
    State(st): State<AppState>,
    Path(global): Path<i32>,
) -> Result<Json<Value>, AppError> {
    if !(1..=6236).contains(&global) {
        return Err(AppError::NotFound);
    }
    let words: Value = sqlx::query_scalar("SELECT words FROM ayah_words WHERE global = $1")
        .bind(global)
        .fetch_optional(&st.pool)
        .await?
        .ok_or(AppError::NotFound)?;
    Ok(Json(json!({ "global": global, "words": words })))
}

#[derive(Deserialize)]
pub struct SearchParams {
    q: String,
    #[serde(default = "default_lang")]
    lang: String,
    #[serde(default = "default_limit")]
    limit: i64,
    #[serde(default)]
    offset: i64,
}
fn default_lang() -> String {
    "ms".into()
}
fn default_limit() -> i64 {
    50
}

#[derive(Serialize, FromRow)]
struct SearchHit {
    global: i32,
    surah: i16,
    ayah: i16,
    page: i16,
    text: String,
    #[serde(skip)]
    total: i64,
}

pub async fn search(
    State(st): State<AppState>,
    Query(p): Query<SearchParams>,
) -> Result<Json<Value>, AppError> {
    let q = p.q.trim();
    if q.chars().count() < 3 {
        return Err(AppError::BadRequest("query too short (min 3 chars)".into()));
    }
    let limit = p.limit.clamp(1, 100);
    let offset = p.offset.max(0);
    let lang = match p.lang.as_str() {
        "ms" | "en" | "id" => p.lang.as_str(),
        _ => "ms",
    };

    let hits: Vec<SearchHit> = if has_arabic(q) {
        let pattern = format!("%{}%", escape_like(&norm_ar(q)));
        sqlx::query_as(
            "SELECT a.global, a.surah, a.ayah, a.page, a.text_ar AS text, COUNT(*) OVER() AS total \
             FROM ayahs a WHERE a.text_plain LIKE $1 ESCAPE '\\' \
             ORDER BY a.global LIMIT $2 OFFSET $3",
        )
        .bind(pattern)
        .bind(limit)
        .bind(offset)
        .fetch_all(&st.pool)
        .await?
    } else {
        let pattern = format!("%{}%", escape_like(&q.to_lowercase()));
        sqlx::query_as(
            "SELECT a.global, a.surah, a.ayah, a.page, t.text, COUNT(*) OVER() AS total \
             FROM ayah_translations t JOIN ayahs a ON a.global = t.global \
             WHERE t.lang = $1 AND lower(t.text) LIKE $2 ESCAPE '\\' \
             ORDER BY a.global LIMIT $3 OFFSET $4",
        )
        .bind(lang)
        .bind(pattern)
        .bind(limit)
        .bind(offset)
        .fetch_all(&st.pool)
        .await?
    };

    let total = hits.first().map(|h| h.total).unwrap_or(0);
    Ok(Json(json!({ "total": total, "hits": hits })))
}

pub async fn module(
    State(st): State<AppState>,
    Path(slug): Path<String>,
) -> Result<Json<Value>, AppError> {
    let rows: Value = match slug.as_str() {
        "asma" => query_json(
            &st,
            "SELECT position, arabic, translit, meaning_ms, meaning_en \
             FROM asma_ul_husna ORDER BY position",
        )
        .await?,
        "cities" => query_json(
            &st,
            "SELECT id, name, lat, lng, tz, is_malaysia FROM cities ORDER BY id",
        )
        .await?,
        "hijri-events" => query_json(
            &st,
            "SELECT month_code, day, label_key FROM hijri_events ORDER BY id",
        )
        .await?,
        "dhikr" => query_json(
            &st,
            "SELECT kind, position, arabic, label_ms, label_en, target_count, quran_ref, tajweed \
             FROM dhikr ORDER BY id",
        )
        .await?,
        "duas" => query_json(
            &st,
            "SELECT kind, position, title_ms, title_en, quran_ref, arabic, meaning_ms, meaning_en, tajweed \
             FROM duas ORDER BY id",
        )
        .await?,
        "mathurat" => query_json(
            &st,
            "SELECT position, quran_ref, arabic, arabic_pagi, arabic_petang, repeat_n, repeat_full, core, \
                    title_ms, title_en, meaning_ms, meaning_en, tajweed, tajweed_pagi, tajweed_petang \
             FROM mathurat_items ORDER BY position",
        )
        .await?,
        "ibadah" | "mengaji" | "yasin" => {
            sqlx::query_scalar::<_, Value>("SELECT body FROM module_docs WHERE slug = $1")
                .bind(&slug)
                .fetch_optional(&st.pool)
                .await?
                .ok_or(AppError::NotFound)?
        }
        _ => return Err(AppError::NotFound),
    };
    Ok(Json(rows))
}

/// Run a SELECT and serialize the whole result set to a JSON array in Postgres.
async fn query_json(st: &AppState, sql: &str) -> Result<Value, AppError> {
    let wrapped = format!(
        "SELECT COALESCE(jsonb_agg(row_to_json(q)), '[]'::jsonb) FROM ({sql}) q"
    );
    Ok(sqlx::query_scalar::<_, Value>(&wrapped)
        .fetch_one(&st.pool)
        .await?)
}
