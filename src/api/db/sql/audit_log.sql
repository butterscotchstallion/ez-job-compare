DROP TABLE IF EXISTS audit_log;
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY,
    action_type_id INTEGER,
    user_id INTEGER,
    created_at TEXT DEFAULT((DATETIME('now', 'localtime')))
);


DROP TABLE IF EXISTS action_types;
CREATE TABLE action_types (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO action_types (name) VALUES('Login');
INSERT INTO action_types (name) VALUES('Add review');
INSERT INTO action_types (name) VALUES('Add job');
INSERT INTO action_types (name) VALUES('Add helpful review vote');