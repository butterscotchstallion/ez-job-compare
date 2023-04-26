
DROP TABLE IF EXISTS exployers;
CREATE TABLE IF NOT EXISTS employers(
	id INTEGER PRIMARY KEY,
	name VARCHAR(255),
	slug VARCHAR(255),
	image VARCHAR(255),
	description TEXT,
	website(255)
);

INSERT INTO employers(name, slug, description, image)
VALUES(	'Massive Dynamic', 
		'massive-dynamic',
		'Massive Dynamic is a fictional multinational conglomerate company from the TV series Fringe that develops the advancement of weapons testing, robotics, medical equipment, aeronautics, genetics, pharmaceuticals, telecommunication, energy, transportation, and entertainment technology.',
		'scientist-with-tubes.jpg',
		'https://massivedynamic.com');

INSERT INTO employers(name, slug, description, image)
VALUES(	'Los Pollos Hermanos', 
		'los-pollos-hermanos',
		"Los Pollos Hermanos (Spanish for The Chicken Brothers) is a fictional fast food restaurant chain specializing in chicken that was featured in the television series Breaking Bad and its spin-off Better Call Saul. In the fictional universe of Breaking Bad, Los Pollos Hermanos is featured as a front organization for Gus Fring's meth manufacturing and distribution operation, but is also highly regarded by the general public of the Southwest as a regional chain on par with KFC. The set used for the restaurant's Albuquerque location in the show was at a Twisters branch in South Valley, New Mexico, and Twisters has seen an increase in business attributed to being associated with Breaking Bad. Due to the show's popularity, Los Pollos Hermanos has appeared on numerous occasions as a real-life pop-up restaurant.",
		'los-pollos-hermanos.webp',
		'https://lospolloshermanos.com');

INSERT INTO employers(name, slug, description, image)
VALUES(	'Initech', 
		'initech',
		"Office Space is a 1999 American black comedy film written and directed by Mike Judge. It satirizes the worklife of a typical 1990s software company, focusing on a handful of individuals weary of their jobs. It stars Ron Livingston, Jennifer Aniston, Gary Cole, Stephen Root, David Herman, Ajay Naidu, and Diedrich Bader.",
		'initech.webp',
		'initech.com');

DROP TABLE IF EXISTS employers_users;
CREATE TABLE employers_users(
	id INTEGER PRIMARY KEY,
	employer_id INTEGER,
	user_id INTEGER,
	created_at TEXT DEFAULT DATETIME('now', 'localtime'),
	FOREIGN KEY(employer_id) REFERENCES employers(id),
	FOREIGN KEY(user_id) REFERENCES users(id)
);