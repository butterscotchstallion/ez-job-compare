DROP TABLE IF EXISTS helpful_review_votes;
CREATE TABLE helpful_review_votes (
    id INTEGER PRIMARY KEY,
    review_id INTEGER,
    user_id INTEGER,
    created_at TEXT DEFAULT (DATETIME('now', 'localtime')),
    FOREIGN KEY(review_id) REFERENCES reviews(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);