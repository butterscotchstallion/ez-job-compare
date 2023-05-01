DROP TABLE IF EXISTS tags;
CREATE TABLE IF NOT EXISTS tags(
    id INTEGER PRIMARY KEY,
    name VARCHAR(25),
    slug VARCHAR(50),
    icon VARCHAR(50)
);

-- 1
INSERT INTO tags(name, slug, icon) VALUES('Remote', 'remote', 'Computer');
-- 2
INSERT INTO tags(name, slug, icon) VALUES('Contract', 'contract', 'EditNote');
-- 3
INSERT INTO tags(name, slug, icon) VALUES('Signing Bonus', 'signing-bonus', 'AttachMoney');
-- 4
INSERT INTO tags(name, slug, icon) VALUES('On Site Required', 'on-site-required', 'HomeWork');
-- 5
INSERT INTO tags(name, slug, icon) VALUES('Dangerous Work Environment', 'dangerous-work-environment', 'Dangerous');
-- 6
INSERT INTO tags(name, slug, icon) VALUES('Pet Friendly', 'pet-friendly', 'Pets');

-- employers_tags
DROP TABLE IF EXISTS employers_tags;
CREATE TABLE IF NOT EXISTS employers_tags(
    id INTEGER PRIMARY KEY,
    tag_id INTEGER,
    employer_id INTEGER,
    created_at TEXT,
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    FOREIGN KEY(employer_id) REFERENCES employers(id)
);

-- massive dynamic
INSERT INTO employers_tags(tag_id, employer_id) VALUES(1, 1);
INSERT INTO employers_tags(tag_id, employer_id) VALUES(3, 1);
-- los pollos hermanos
INSERT INTO employers_tags(tag_id, employer_id) VALUES(4, 2);
-- initech
INSERT INTO employers_tags(tag_id, employer_id) VALUES(1, 3);


