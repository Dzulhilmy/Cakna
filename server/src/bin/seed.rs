use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();
    let cfg = cakna::config::Config::from_env();
    let data_dir = cakna::seed::find_data_dir(std::env::args().nth(1))?;
    let pool = PgPoolOptions::new()
        .max_connections(4)
        .connect(&cfg.database_url)
        .await?;
    sqlx::migrate!("./migrations").run(&pool).await?;
    cakna::seed::run(&pool, &data_dir).await
}
