DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50),
    created_at TEXT DEFAULT((DATETIME('now', 'localtime'))),
    color VARCHAR(50),
    icon VARCHAR(50)
);

DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50)
);

DROP TABLE IF EXISTS roles_permissions;
CREATE TABLE roles_permissions (
    id INTEGER PRIMARY KEY,
    role_id INTEGER,
    permission_id INTEGER,
    created_at TEXT DEFAULT((DATETIME('now', 'localtime'))),
    updated_at TEXT
);

DROP TABLE IF EXISTS users_roles;
CREATE TABLE users_roles(
    id INTEGER PRIMARY KEY,
    role_id INTEGER,
    user_id INTEGER,
    created_at TEXT DEFAULT((DATETIME('now', 'localtime')))
);

-- Default roles/permissions
INSERT INTO permissions(name) VALUES('Post employer reviews');
INSERT INTO permissions(name) VALUES('Post employer jobs');


INSERT INTO roles(name) VALUES('Reviewer');
INSERT INTO roles(name) VALUES('Recruiter');

INSERT INTO roles_permissions(role_id, permission_id) VALUES(1, 1);
INSERT INTO roles_permissions(role_id, permission_id) VALUES(2, 2);

-- User role defaults
INSERT INTO users_roles(role_id, user_id) VALUES(1, 1);
INSERT INTO users_roles(role_id, user_id) VALUES(2, 1);