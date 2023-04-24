DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	guid VARCHAR(255),
	name VARCHAR(255),
	password VARCHAR(255),
	active INTEGER DEFAULT 1,
	avatar_filename VARCHAR(255),
	created_at TEXT DEFAULT (DATETIME('now', 'localtime')),
	updated_at TEXT
);

DROP TABLE IF EXISTS user_tokens;
CREATE TABLE user_tokens(
	id INTEGER PRIMARY KEY,
	token VARCHAR(255),
	user_id INTEGER,
	created_at TEXT DEFAULT (DATETIME('now', 'localtime')),
	updated_at TEXT,
	FOREIGN KEY(user_id) REFERENCES users(id)
);