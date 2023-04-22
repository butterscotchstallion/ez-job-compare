DROP TABLE IF EXISTS employer_sizes;
CREATE TABLE employer_sizes (
	id INTEGER PRIMARY KEY,
	name VARCHAR(50)
);

INSERT INTO employer_sizes(name) VALUES('Tiny (1-25 employees)');
INSERT INTO employer_sizes(name) VALUES('Small (25-50 employees)');
INSERT INTO employer_sizes(name) VALUES('Medium (50-100 employees)');
INSERT INTO employer_sizes(name) VALUES('Large (100+ employees)');
INSERT INTO employer_sizes(name) VALUES('Huge (500+ employees)');