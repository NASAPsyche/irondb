
-- Create and connect to irondb database 
CREATE DATABASE irondb WITH OWNER = group16; 

-- Define tables
CREATE TABLE IF NOT EXISTS Users (
  user_id bigserial PRIMARY KEY,
  username varchar(25) UNIQUE,
  password varchar(255),
  role varchar(10) CHECK (
    role LIKE 'admin' OR role LIKE 'data-entry')
);

CREATE TABLE IF NOT EXISTS Entries (
	entry_id serial PRIMARY KEY,
	name text NOT NULL
);

CREATE TABLE IF NOT EXISTS Sources (
  source_id serial PRIMARY KEY,
  title text NOT NULL,
  source text NOT NULL,
  published_date date NOT NULL
);

CREATE TABLE IF NOT EXISTS Authors (
  source_id integer REFERENCES Sources(source_id),
  author text NOT NULL
);

CREATE TABLE IF NOT EXISTS MeasurementTech (
  entry_id integer NOT NULL REFERENCES Entries(entry_id),
  tech text NOT NULL
);

CREATE TABLE IF NOT EXISTS Major (
  entry_id integer NOT NULL REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measure integer NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Minor (
  entry_id integer NOT NULL REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measure integer NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Trace (
  entry_id integer NOT NULL REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measure integer NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Notes (
  entry_id integer NOT NULL REFERENCES Entries(entry_id),
  notes text
)

-- Insert example entry
INSERT INTO Entries (name) VALUES ('Psyche');
