DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
	id INTEGER PRIMARY KEY,
	employer_id INTEGER,
	title VARCHAR(255),
	short_description VARCHAR(255),
	long_description TEXT,
	salary_range_start INTEGER,
	salary_range_end INTEGER,
	location VARCHAR(255),
	created_at TEXT DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT,
	slug VARCHAR(255),
	FOREIGN KEY(employer_id) REFERENCES employers(id)
);

INSERT INTO jobs(employer_id, title, short_description, salary_range_start, salary_range_end, long_description, 
slug)
VALUES(1, 'Dark Matter Specialist', 'Responsible for innovation in the dark matter lab',
250000, 450000, 'long description....', '1-dark-matter-specialist');

INSERT INTO jobs(employer_id, title, short_description, salary_range_start, salary_range_end, long_description,
slug)
VALUES(2, 'Line Cook', 'Responsible for innovation in the kitchen', 25000, 35000, 'long description!',
'2-line-cook');

-- jobs_tags
DROP TABLE IF EXISTS jobs_tags;
CREATE TABLE jobs_tags(
	id INTEGER PRIMARY KEY,
	job_id INTEGER,
	tag_id INTEGER,
	created_at TEXT,
	FOREIGN KEY(job_id) REFERENCES jobs(id)
	FOREIGN KEY(tag_id) REFERENCES tags(id)
);

INSERT INTO jobs_tags(job_id, tag_id) VALUES(1, 3);
INSERT INTO jobs_tags(job_id, tag_id) VALUES(2, 4);