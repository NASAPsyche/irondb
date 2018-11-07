
-- Create and connect to irondb database 
CREATE DATABASE irondb WITH OWNER = group16; 

-- Define tables
CREATE TABLE IF NOT EXISTS Entries (
	entry_id serial PRIMARY KEY,
	name text NOT NULL
);

-- Insert example entry
INSERT INTO Entries (name) VALUES ('Psyche');
