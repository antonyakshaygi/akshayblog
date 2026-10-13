CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  published_timestamp INTEGER NOT NULL,
  payload TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_timestamp DESC);
CREATE TABLE IF NOT EXISTS newspaper_editions (
  id TEXT PRIMARY KEY,
  edition_date TEXT NOT NULL,
  published_timestamp INTEGER NOT NULL,
  payload TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS app_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
