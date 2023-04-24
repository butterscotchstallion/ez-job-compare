DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
	id INTEGER PRIMARY KEY,
	body TEXT,
	active INTEGER DEFAULT 1,
	created_at TEXT DEFAULT (DATETIME('now', 'localtime')),
	employer_id INTEGER,
	user_id INTEGER,
	FOREIGN KEY(employer_id) REFERENCES employers(id)
	FOREIGN KEY(user_id) REFERENCES users(id)
);
