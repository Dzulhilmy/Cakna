pub mod events;
pub mod funding;
pub mod media;
pub mod notices;
pub mod notifications;
pub mod programs;
pub mod site;
pub mod users;

use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::state::AppState;

pub fn build() -> Router<AppState> {
    Router::new()
        // Users
        .route("/users", get(users::list))
        .route("/users/resolve", post(users::resolve))
        .route("/users/:id/role", put(users::set_role))
        .route("/users/:id/status", put(users::set_status))
        .route("/users/:id/department", put(users::set_department))
        .route("/users/:id", delete(users::delete))
        // Funding
        .route("/funding", get(funding::list).post(funding::create))
        .route("/funding/:id", get(funding::get).put(funding::update).delete(funding::delete))
        .route("/funding/:id/review", post(funding::review))
        .route("/funding/:id/resubmit", post(funding::resubmit))
        // Events
        .route("/events", get(events::list).post(events::create))
        .route("/events/:id", get(events::get).put(events::update).delete(events::delete))
        // Programs
        .route("/programs", get(programs::list).post(programs::create))
        .route("/programs/seed", post(programs::seed))
        .route("/programs/:id", put(programs::update).delete(programs::delete))
        // Site content
        .route("/site", get(site::get).put(site::put))
        // Media
        .route("/media", get(media::list).post(media::upload))
        .route("/media", delete(media::delete))
        // Notices
        .route("/notices", get(notices::list_for_user).post(notices::add))
        .route("/notices/read-all", post(notices::mark_all_read))
        .route("/notices/:id/read", post(notices::mark_read))
        .route("/notices/:id", delete(notices::delete))
        // Notifications
        .route("/notifications", get(notifications::list).post(notifications::create))
        .route("/notifications/:id", delete(notifications::delete))
}
