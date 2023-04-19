DROP TABLE IF EXISTS tags;
CREATE TABLE IF NOT EXISTS tags(
	id INTEGER PRIMARY KEY,
	name VARCHAR(25),
	slug VARCHAR(50),
	icon VARCHAR(50)
);

INSERT INTO tags(name, slug, icon) VALUES('Remote', 'remote', 'Computer');
INSERT INTO tags(name, slug, icon) VALUES('Contract', 'contract', 'EditNote');
INSERT INTO tags(name, slug, icon) VALUES('Signing Bonus', 'signing-bonus', 'AttachMoney');
INSERT INTO tags(name, slug, icon) VALUES('On Site Required', 'on-site-required', 'HomeWork');

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

-- employer 1
INSERT INTO employers_tags(tag_id, employer_id) VALUES(1, 1);
INSERT INTO employers_tags(tag_id, employer_id) VALUES(3, 1);
-- employer 2
INSERT INTO employers_tags(tag_id, employer_id) VALUES(4, 2);
-- employer 3
INSERT INTO employers_tags(tag_id, employer_id) VALUES(1, 3);


