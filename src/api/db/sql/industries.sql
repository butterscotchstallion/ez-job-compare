DROP TABLE IF EXISTS industries;
CREATE TABLE IF NOT EXISTS industries(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);

INSERT INTO industries(name) VALUES('Technology');
INSERT INTO industries(name) VALUES('Hospitality');
INSERT INTO industries(name) VALUES('Network Security');
INSERT INTO industries(name) VALUES('Restaurant');
INSERT INTO industries(name) VALUES('Defense');

-- industries_employers
DROP TABLE IF EXISTS industries_employers;
CREATE TABLE IF NOT EXISTS industries_employers(
    id INTEGER PRIMARY KEY,
    employer_id INTEGER,
    industry_id INTEGER,
    FOREIGN KEY(employer_id) REFERENCES employers(id),
    FOREIGN KEY(industry_id) REFERENCES industries(id)
);
