
-- Create and connect to irondb database 
CREATE DATABASE irondb WITH OWNER = group16; 

-- Define tables
CREATE TABLE IF NOT EXISTS Users (
  user_id bigserial PRIMARY KEY,
  username varchar(25) UNIQUE,
  password varchar(50),
  role varchar(10) CHECK (
    role LIKE 'admin' OR role LIKE 'data-entry')
);

CREATE TABLE IF NOT EXISTS Entries (
	entry_id serial PRIMARY KEY,
	name text NOT NULL
);



-- Insert example entry
INSERT INTO Entries (name) VALUES ('Psyche');
