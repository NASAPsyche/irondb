
-- Create and connect to irondb database 
CREATE DATABASE irondb WITH OWNER = group16; 

-- Define tables
CREATE TABLE IF NOT EXISTS Entries (
	entry_id serial PRIMARY KEY,
	name text NOT NULL
);

-- Insert example entry
INSERT INTO Entries (name) VALUES ('Psyche');


-- Create user (Note: May not be necessary?)
CREATE USER group16 WITH PASSWORD 'abc123';
GRANT ALL PRIVILEGES ON DATABASE irondb TO group16;