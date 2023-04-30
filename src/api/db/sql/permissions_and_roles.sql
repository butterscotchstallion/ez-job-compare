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
INSERT INTO permissions(name) VALUES('Verify users');
INSERT INTO permissions(name) VALUES('Vote on reviews');
INSERT INTO permissions(name) VALUES('Delete reviews');

-- Role names
INSERT INTO roles(name, color) VALUES('Reviewer', 'purple');
INSERT INTO roles(name, color) VALUES('Recruiter', 'green');
INSERT INTO roles(name, color) VALUES('Verifier', 'maroon');
INSERT INTO roles(name, color) VALUES('Voter', '#e16c1c');
INSERT INTO roles(name, color) VALUES('Review Admin', '#280759');

-- Permissions for each role
INSERT INTO roles_permissions(role_id, permission_id) VALUES(1, 1);
INSERT INTO roles_permissions(role_id, permission_id) VALUES(2, 2);
INSERT INTO roles_permissions(role_id, permission_id) VALUES(3, 3);
INSERT INTO roles_permissions(role_id, permission_id) VALUES(4, 4);
INSERT INTO roles_permissions(role_id, permission_id) VALUES(5, 5);


-- User role defaults
INSERT INTO users_roles(role_id, user_id) VALUES(1, 1);
INSERT INTO users_roles(role_id, user_id) VALUES(2, 1);
INSERT INTO users_roles(role_id, user_id) VALUES(3, 1);
INSERT INTO users_roles(role_id, user_id) VALUES(4, 1);
INSERT INTO users_roles(role_id, user_id) VALUES(5, 1);