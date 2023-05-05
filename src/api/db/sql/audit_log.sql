DROP TABLE IF EXISTS audit_log;

DROP TABLE IF EXISTS action_types;
CREATE TABLE action_types (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO action_types (name) VALUES('Login');
INSERT INTO action_types (name) VALUES('Add review');
INSERT INTO action_types (name) VALUES('Add job');
INSERT INTO action_types (name) VALUES('Add helpful review vote');
INSERT INTO action_types (name) VALUES('Added role to user');

-- Each action type can have an associated table with meta info
-- about the action. For example, audit_log_user has information
-- about user actions
DROP TABLE IF EXISTS audit_log_user;
CREATE TABLE audit_log_user (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    action_type_id INTEGER,
    note VARCHAR(255),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(action_type_id) REFERENCES action_types(id)
);

DROP TABLE IF EXISTS audit_log_job;
CREATE TABLE audit_log_job (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    action_type_id INTEGER,
    note VARCHAR(255),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(action_type_id) REFERENCES action_types(id)
);

DROP TABLE IF EXISTS audit_log_review;
CREATE TABLE audit_log_reviews(
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    action_type_id INTEGER,
    note VARCHAR(255),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(action_type_id) REFERENCES action_types(id)
);