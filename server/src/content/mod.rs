pub mod routes;

use crate::state::AppState;
use axum::extract::{Request, State};
use axum::http::header::{CACHE_CONTROL, ETAG, IF_NONE_MATCH};
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

/// Content is immutable per deploy: tag every response with the seeded
/// content_version and answer If-None-Match with 304.
pub async fn cache_middleware(State(st): State<AppState>, req: Request, next: Next) -> Response {
    let etag = format!("\"{}\"", st.content_version);
    if req
        .headers()
        .get(IF_NONE_MATCH)
        .and_then(|v| v.to_str().ok())
        .is_some_and(|v| v == etag)
    {
        return StatusCode::NOT_MODIFIED.into_response();
    }
    let mut res = next.run(req).await;
    if res.status().is_success() {
        res.headers_mut().insert(ETAG, etag.parse().unwrap());
        res.headers_mut().insert(
            CACHE_CONTROL,
            "public, max-age=86400, stale-while-revalidate=604800"
                .parse()
                .unwrap(),
        );
    }
    res
}
