
-- Create and connect to irondb database 
CREATE DATABASE irondb WITH OWNER = group16; 


-- Drop all previous tables
DROP TABLE IF EXISTS Entries CASCADE;

-- Define tables
CREATE TABLE Entries (
	entry_id serial PRIMARY KEY,
	name text NOT NULL
);


CREATE USER group16 WITH PASSWORD 'abc123';
GRANT ALL PRIVILEGES ON DATABASE irondb TO group16;


-- Insert example
INSERT INTO Entries (name) VALUES ('Psyche');