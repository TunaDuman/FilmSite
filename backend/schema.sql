DROP TABLE IF EXISTS movie_reviews;
DROP TABLE IF EXISTS movie_suggestions;

CREATE TABLE movie_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
  note TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(movie_id, user_id)
);

CREATE TABLE movie_suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  movie_title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);