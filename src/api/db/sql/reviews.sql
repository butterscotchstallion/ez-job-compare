DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
	id INTEGER PRIMARY KEY,
	body TEXT,
	active INTEGER,
	created_at TEXT
);