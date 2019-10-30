-- add extensions
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS plpythonu;

-------------------
-- Define enums  --
-- Create types  --
-------------------

CREATE TYPE user_role AS ENUM ('admin', 'data-entry', 'user');
CREATE TYPE statuses AS ENUM('pending', 'rejected', 'active', 'historical');
CREATE TYPE units AS ENUM ('wt_percent', 'ppm', 'ppb', 'mg_g', 'ug_g', 'ng_g');
CREATE TYPE mz AS (
  nomenclature      text,
  the_group         text,
  classification    text,
  element_symbol    text,
  less_than         boolean,
  ppb_mean          integer,
  sigfig            integer,
  deviation         integer,
  original_unit     units,
  technique         text,
  page_number       integer
);

------------------------
--  Python Functions  --
------------------------

CREATE OR REPLACE FUNCTION getMz(
  nomenclature text,
  the_group text,
  classification text,
  element_symbol text,
  less_than boolean,
  ppb_mean integer,
  sigfig integer,
  deviation integer,
  original_unit units,
  technique text,
  page_number integer
)
RETURNS mz 
AS $$
  _group = ''
  _class = ''
  if (the_group is not None):
    _group = the_group
  if (classification is not None):
    _class = classification
  return (
    nomenclature,
    _group,
    _class,
    element_symbol, 
    less_than, 
    ppb_mean, 
    sigfig, 
    deviation, 
    original_unit, 
    technique, 
    page_number
  )
$$ LANGUAGE plpythonu;

-------------------
-- Define tables --
-------------------

-- From the example at : https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
CREATE TABLE IF NOT EXISTS "user_session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "user_session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- User tables --

CREATE TABLE IF NOT EXISTS users (
  user_id serial PRIMARY KEY,
  username citext UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role_of user_role NOT NULL
);

CREATE TABLE IF NOT EXISTS user_info (
  user_id integer,
  first_name citext NOT NULL,
  last_name citext NOT NULL,
  email_address citext UNIQUE NOT NULL,
  PRIMARY KEY(user_id)
);

-- Data tables --

CREATE TABLE IF NOT EXISTS bodies (
  body_id serial PRIMARY KEY,
  nomenclature citext NOT NULL,
  status_id bigint
);

CREATE TABLE IF NOT EXISTS journals (
  journal_id serial PRIMARY KEY,
  journal_name text NOT NULL,
  volume citext,
  issue citext,
  series citext,
  published_year integer NOT NULL CHECK (published_year >= 1900),
  status_id bigint 
);

CREATE TABLE IF NOT EXISTS papers (
  paper_id serial PRIMARY KEY,
  journal_id integer NOT NULL,
  title citext NOT NULL,
  doi citext,
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
  primary_name citext NOT NULL,
  first_name citext,
  middle_name citext,
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
  element_id serial PRIMARY KEY,
  body_id integer NOT NULL,
  element_symbol varchar(3) NOT NULL 
    CONSTRAINT lower_case CHECK (element_symbol = lower(element_symbol)),
  paper_id integer NOT NULL,
  page_number integer NOT NULL,
  ppb_mean integer NOT NULL 
    CONSTRAINT positive_number_mean CHECK (ppb_mean >= 0) 
    CONSTRAINT too_big CHECK (ppb_mean <= 1000000000),
  sigfig integer
    CONSTRAINT sigfig_zero_or_greater CHECK (sigfig >= 0),
  deviation integer NOT NULL 
    CONSTRAINT positive_number_deviation CHECK (deviation >= 0) 
    DEFAULT 0,
  less_than boolean NOT NULL DEFAULT false,
  original_unit units NOT NULL,
  technique text,
  note text,
  status_id bigint
);

CREATE TABLE IF NOT EXISTS notes (
  note_id serial PRIMARY KEY,
  paper_id integer NOT NULL,
  note text NOT NULL,
  status_id bigint
);

-- Entry submission tables --

CREATE TABLE IF NOT EXISTS entry_store (
  entry_id bigserial PRIMARY KEY,
  username citext REFERENCES users(username) NOT NULL,
  savedata jsonb NOT NULL,
  pdf_path text DEFAULT NULL, 
  -- save the path to the pdf if one is included in submission
  pending boolean DEFAULT true NOT NULL,
  last_saved_date timestamp DEFAULT now() NOT NULL
);


CREATE TABLE IF NOT EXISTS submissions (
  submission_id bigserial PRIMARY KEY,
  pdf_path text DEFAULT NULL, 
  -- save the path to the pdf if one is included in submission
  pending boolean DEFAULT true NOT NULL,
  -- when a submission is created, it is pending, after data has been
  -- verified (accept or reject) pending is set to false
  -- If some data has been accepted but not all data, the user may
  -- choose to close out submission or review more later.
  username citext REFERENCES users(username) NOT NULL
);

-- Status tables --

CREATE TABLE IF NOT EXISTS body_status (
  status_id bigserial PRIMARY KEY,
  body_id integer REFERENCES bodies(body_id) NOT NULL,
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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
  current_status statuses  NOT NULL,
  submitted_by citext NOT NULL,
  reviewed_by integer REFERENCES users(user_id),
  submission_date timestamp DEFAULT now() NOT NULL,
  reviewed_date timestamp,
  submission_id bigint REFERENCES submissions(submission_id)
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



-- Misc support tables

-- User is requesting role as data_entry
CREATE TABLE IF NOT EXISTS data_entry_role_requests (
  request_id serial PRIMARY KEY,
  requesting_user citext REFERENCES users(username) NOT NULL,
  requested_date timestamp DEFAULT now() NOT NULL,
  pending boolean DEFAULT true NOT NULL
);


-----------------------
-- Add FK Contraints --
-----------------------
/*
  Now that the FK have been seeded, we can add the constraint.
*/

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

