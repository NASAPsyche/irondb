
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

CREATE TABLE IF NOT EXISTS Journals (
  journal_id serial PRIMARY KEY,
  journal_name text NOT NULL,
  issue_number text NOT NULL,
  published_year integer NOT NULL
);

CREATE TABLE IF NOT EXISTS Papers (
  paper_id serial PRIMARY KEY,
  journal_id integer REFERENCES Journals(journal_id),
  title text NOT NULL
);

CREATE TABLE IF NOT EXISTS Entries (
	entry_id serial PRIMARY KEY,
	journal_id integer REFERENCES Journals(journal_id),
	paper_id integer REFERENCES Papers(paper_id),
	meteorite_name text NOT NULL,
	page_number integer NOT NULL
);

CREATE TABLE IF NOT EXISTS Authors (
  paper_id integer REFERENCES Papers(paper_id),
  author text NOT NULL
);

CREATE TABLE IF NOT EXISTS Analysis_technique (
  entry_id integer REFERENCES Entries(entry_id),
  technique text NOT NULL,
  PRIMARY KEY(entry_id, technique)
);

CREATE TABLE IF NOT EXISTS Groups (
  entry_id integer REFERENCES Entries(entry_id),
  classification_group varchar(20) NOT NULL,
  PRIMARY KEY(entry_id, classification_group)
);

CREATE TABLE IF NOT EXISTS Major_elements (
  entry_id integer REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measurement integer NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Minor_elements (
  entry_id integer REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measurement integer NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Trace_elements (
  entry_id integer REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measurement integer NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Notes (
  entry_id integer REFERENCES Entries(entry_id),
  notes text
);

CREATE TABLE IF NOT EXISTS Entry_status (
  entry_id integer REFERENCES Entries(entry_id),
  insert_date date,
  inserted_by varchar(25) REFERENCES Users(username),
  checked_by varchar(25),
  status varchar(10) CHECK (
    status LIKE 'active' OR status LIKE 'inactive' OR status LIKE 'unapproved' OR status LIKE 'reported')
);

-- Insert example entry
