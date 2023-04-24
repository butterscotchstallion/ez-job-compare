DROP TABLE IF EXISTS verified_employees;
CREATE TABLE verified_employees (
	id INTEGER PRIMARY KEY,
	user_id INTEGER,
	employer_id INTEGER,
	start_date TEXT,
	end_date TEXT,
	created_at TEXT DEFAULT((DATETIME('now', 'localtime'))),
	updated_at TEXT,
	FOREIGN KEY(user_id) REFERENCES users(id)
	FOREIGN KEY(employer_id) REFERENCES employers(id)
);