-- Create and connect to irondb database 
-- uncomment next line, this is set this way for quick testing
 CREATE DATABASE irondb WITH OWNER = group16; 
 CREATE EXTENSION citext;

-------------------
-- Define enums  --
-------------------

CREATE TYPE user_role AS ENUM ('admin', 'data-entry');
CREATE TYPE statuses AS ENUM('pending', 'rejected', 'active', 'historical');

-------------------
-- Drop tables   --
-------------------
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_info;
DROP TABLE IF EXISTS bodies;
DROP TABLE IF EXISTS journals;
DROP TABLE IF EXISTS papers;
DROP TABLE IF EXISTS attributions;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS classifications;
DROP TABLE IF EXISTS element_entries;
DROP TABLE IF EXISTS notes;

DROP TABLE IF EXISTS body_status;
DROP TABLE IF EXISTS journal_status;
DROP TABLE IF EXISTS paper_status;
DROP TABLE IF EXISTS attribution_status;
DROP TABLE IF EXISTS author_status;
DROP TABLE IF EXISTS group_status;
DROP TABLE IF EXISTS classification_status;
DROP TABLE IF EXISTS element_status;
DROP TABLE IF EXISTS note_status;

DROP TABLE IF EXISTS body_review;
DROP TABLE IF EXISTS journal_review;
DROP TABLE IF EXISTS paper_review;
DROP TABLE IF EXISTS attribution_review;
DROP TABLE IF EXISTS author_review;
DROP TABLE IF EXISTS group_review;
DROP TABLE IF EXISTS classification_review;
DROP TABLE IF EXISTS element_review;
DROP TABLE IF EXISTS note_review;
-------------------
-- Define tables --
-------------------

-- User tables --

CREATE TABLE IF NOT EXISTS users (
  user_id serial PRIMARY KEY,
  username citext UNIQUE NOT NULL,
  password text NOT NULL,
  role user_role NOT NULL
);

CREATE TABLE IF NOT EXISTS user_info (
  user_id integer,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email_address citext UNIQUE NOT NULL,
  PRIMARY KEY(user_id)
);

-- Data tables --

CREATE TABLE IF NOT EXISTS bodies (
  body_id serial PRIMARY KEY,
  nomenclature citext UNIQUE NOT NULL,
  status_id bigint
);

CREATE TABLE IF NOT EXISTS journals (
  journal_id serial PRIMARY KEY,
  journal_name text NOT NULL,
  volume text,
  issue text,
  series text,
  published_year integer NOT NULL CHECK (published_year > 1900),
  status_id bigint 
);

CREATE TABLE IF NOT EXISTS papers (
  paper_id serial PRIMARY KEY,
  journal_id integer NOT NULL,
  title text NOT NULL UNIQUE,
  doi text,
  status_id bigint
);

CREATE TABLE IF NOT EXISTS attributions (
  attribution_id serial UNIQUE NOT NULL,
  paper_id integer ,
  author_id integer ,
  status_id bigint,
  PRIMARY KEY(paper_id, author_id)
);

CREATE TABLE IF NOT EXISTS authors (
  author_id serial PRIMARY KEY,
  primary_name text NOT NULL,
  first_name text,
  middle_name text,
  single_entity boolean NOT NULL DEFAULT true,
  status_id bigint
);

CREATE TABLE IF NOT EXISTS groups (
  group_id serial PRIMARY KEY,
  body_id integer NOT NULL,
  the_group text NOT NULL,
  status_id bigint 
);

CREATE TABLE IF NOT EXISTS classifications (
  classification_id serial PRIMARY KEY,
  body_id integer NOT NULL,
  classification text NOT NULL,
  status_id bigint
);

CREATE TABLE IF NOT EXISTS element_entries(
  element_id serial UNIQUE NOT NULL,
  body_id integer,
  element_symbol varchar(3) CONSTRAINT lower_case CHECK (element_symbol = lower(element_symbol)),
  paper_id integer,
  page_number integer,
  ppb_mean integer NOT NULL 
    CONSTRAINT positive_number_mean CHECK (ppb_mean >= 0) 
    CONSTRAINT too_big CHECK (ppb_mean <= 1000000000),
  deviation integer NOT NULL 
    CONSTRAINT positive_number_deviation CHECK (deviation >= 0) 
    DEFAULT 0,
  less_than boolean NOT NULL DEFAULT false,
  technique text,
  note text,
  status_id bigint,
  PRIMARY KEY(body_id, element_symbol, paper_id, page_number)
);

CREATE TABLE IF NOT EXISTS notes (
  note_id serial PRIMARY KEY,
  paper_id integer NOT NULL,
  note text NOT NULL,
  status_id bigint
);

-- Status tables --

CREATE TABLE IF NOT EXISTS body_status (
  status_id bigserial PRIMARY KEY,
  body_id integer REFERENCES bodies(body_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES body_status(status_id)
);

CREATE TABLE IF NOT EXISTS body_review (
  review_id bigserial PRIMARY KEY,
  body_id integer REFERENCES bodies(body_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS journal_status (
  status_id bigserial PRIMARY KEY,
  journal_id integer REFERENCES journals(journal_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES journal_status(status_id)
);

CREATE TABLE IF NOT EXISTS journal_review (
  review_id bigserial PRIMARY KEY,
  journal_id integer REFERENCES journals(journal_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS paper_status (
  status_id bigserial PRIMARY KEY,
  paper_id integer REFERENCES papers(paper_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES paper_status(status_id)
);

CREATE TABLE IF NOT EXISTS paper_review (
  review_id bigserial PRIMARY KEY,
  paper_id integer REFERENCES papers(paper_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS attribution_status (
  status_id bigserial PRIMARY KEY,
  attribution_id integer REFERENCES attributions(attribution_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES attribution_status(status_id)
);

CREATE TABLE IF NOT EXISTS attribution_review (
  review_id bigserial PRIMARY KEY,
  attribution_id integer REFERENCES attributions(attribution_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS author_status (
  status_id bigserial PRIMARY KEY,
  author_id integer REFERENCES authors(author_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES author_status(status_id)
);

CREATE TABLE IF NOT EXISTS author_review (
  review_id bigserial PRIMARY KEY,
  author_id integer REFERENCES authors(author_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS group_status (
  status_id bigserial PRIMARY KEY,
  group_id integer REFERENCES groups(group_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES group_status(status_id)
);

CREATE TABLE IF NOT EXISTS group_review (
  review_id bigserial PRIMARY KEY,
  group_id integer REFERENCES groups(group_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS classification_status (
  status_id bigserial PRIMARY KEY,
  classification_id integer REFERENCES classifications(classification_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES classification_status(status_id)
);

CREATE TABLE IF NOT EXISTS classification_review (
  review_id bigserial PRIMARY KEY,
  classification_id integer REFERENCES classifications(classification_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS element_status (
  status_id bigserial PRIMARY KEY,
  element_id integer REFERENCES element_entries(element_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES element_status(status_id)
);

CREATE TABLE IF NOT EXISTS element_review (
  review_id bigserial PRIMARY KEY,
  element_id integer REFERENCES element_entries(element_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

CREATE TABLE IF NOT EXISTS note_status (
  status_id bigserial PRIMARY KEY,
  note_id integer REFERENCES notes(note_id) NOT NULL,
  status statuses NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  previous_entry bigint REFERENCES note_status(status_id)
);

CREATE TABLE IF NOT EXISTS note_review (
  review_id bigserial PRIMARY KEY,
  note_id integer REFERENCES notes(note_id) NOT NULL,
  note text NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  email_address citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  resolution_date timestamp,
  action_taken text
);

-- Add FK constraints --

ALTER TABLE bodies
  ADD CONSTRAINT fk_body_status FOREIGN KEY (status_id) REFERENCES body_status(status_id);
ALTER TABLE user_info
  ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE journals
  ADD CONSTRAINT fk_journal_status FOREIGN KEY (status_id) REFERENCES journal_status(status_id);
ALTER TABLE papers
  ADD CONSTRAINT fk_paper_status FOREIGN KEY (status_id) REFERENCES paper_status(status_id);
ALTER TABLE papers
  ADD CONSTRAINT fk_journal_id FOREIGN KEY (journal_id) REFERENCES journals(journal_id);
ALTER TABLE attributions
  ADD CONSTRAINT fk_attribution_status FOREIGN KEY (status_id) REFERENCES attribution_status(status_id);
ALTER TABLE attributions
  ADD CONSTRAINT fk_paper_id FOREIGN KEY (paper_id) REFERENCES papers(paper_id);
ALTER TABLE attributions
  ADD CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES authors(author_id);
ALTER TABLE authors
  ADD CONSTRAINT fk_author_status FOREIGN KEY (status_id) REFERENCES author_status(status_id);
ALTER TABLE groups
  ADD CONSTRAINT fk_group_status FOREIGN KEY (status_id) REFERENCES group_status(status_id);
ALTER TABLE groups
  ADD CONSTRAINT fk_body_id FOREIGN KEY (body_id) REFERENCES bodies(body_id);
ALTER TABLE classifications
  ADD CONSTRAINT fk_classification_status FOREIGN KEY (status_id) REFERENCES classification_status(status_id);
ALTER TABLE classifications
  ADD CONSTRAINT fk_body_id FOREIGN KEY (body_id) REFERENCES bodies(body_id);
ALTER TABLE element_entries
  ADD CONSTRAINT fk_element_status FOREIGN KEY (status_id) REFERENCES element_status(status_id);
ALTER TABLE element_entries
  ADD CONSTRAINT fk_body_id FOREIGN KEY (body_id) REFERENCES bodies(body_id);
ALTER TABLE element_entries
  ADD CONSTRAINT fk_paper_id FOREIGN KEY (paper_id) REFERENCES papers(paper_id);
ALTER TABLE notes
  ADD CONSTRAINT fk_note_status FOREIGN KEY (status_id) REFERENCES note_status(status_id);
ALTER TABLE notes
  ADD CONSTRAINT fk_paper_id FOREIGN KEY (paper_id) REFERENCES papers(paper_id);




