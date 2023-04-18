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

-- tags_employers
DROP TABLE IF EXISTS tags_employers;
CREATE TABLE IF NOT EXISTS tags_employers(
	id INTEGER PRIMARY KEY,
	tag_id INTEGER,
	employer_id INTEGER,
	created_at TEXT,
	FOREIGN KEY(tag_id) REFERENCES tags(id),
	FOREIGN KEY(employer_id) REFERENCES employers(id)
);