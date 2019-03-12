-- Create and connect to irondb database 
-- if using https://rextester.com/EMEDS96343 to test, then comment out the next two lines
CREATE DATABASE irondb WITH OWNER = group16; 
CREATE EXTENSION citext;

/*
  The DATA tables and the STATUS tables have been populated with Dummy Data
  where the text values are usually 'Dummy'. This is useful incase you need to point
  a reference at something that doesn't exist yet.
  No  REVIEW tables have been populated.
*/
-------------------
-- Define enums  --
-------------------

CREATE TYPE user_role AS ENUM ('admin', 'data-entry', 'user');
CREATE TYPE statuses AS ENUM('pending', 'rejected', 'active', 'historical');
CREATE TYPE units AS ENUM ('wt_percent', 'ppm', 'ppb', 'mg_g', 'ug_g', 'ng_g');

-------------------
-- Drop tables   --
-------------------
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS user_info;
-- DROP TABLE IF EXISTS bodies;
-- DROP TABLE IF EXISTS journals;
-- DROP TABLE IF EXISTS papers;
-- DROP TABLE IF EXISTS attributions;
-- DROP TABLE IF EXISTS authors;
-- DROP TABLE IF EXISTS groups;
-- DROP TABLE IF EXISTS classifications;
-- DROP TABLE IF EXISTS element_entries;
-- DROP TABLE IF EXISTS notes;

-- DROP TABLE IF EXISTS body_status;
-- DROP TABLE IF EXISTS journal_status;
-- DROP TABLE IF EXISTS paper_status;
-- DROP TABLE IF EXISTS attribution_status;
-- DROP TABLE IF EXISTS author_status;
-- DROP TABLE IF EXISTS group_status;
-- DROP TABLE IF EXISTS classification_status;
-- DROP TABLE IF EXISTS element_status;
-- DROP TABLE IF EXISTS note_status;

-- DROP TABLE IF EXISTS entry_json_store;
-- DROP TABLE IF EXISTS submissions;

-- DROP TABLE IF EXISTS body_review;
-- DROP TABLE IF EXISTS journal_review;
-- DROP TABLE IF EXISTS paper_review;
-- DROP TABLE IF EXISTS attribution_review;
-- DROP TABLE IF EXISTS author_review;
-- DROP TABLE IF EXISTS group_review;
-- DROP TABLE IF EXISTS classification_review;
-- DROP TABLE IF EXISTS element_review;
-- DROP TABLE IF EXISTS note_review;

-- DROP TABLE IF EXISTS data_entry_role_requests;

-------------------
-- Define tables --
-------------------

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

-- Session table --
-- Table copied from: https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
-- as per usage documentation: https://www.npmjs.com/package/connect-pg-simple
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Data tables --

CREATE TABLE IF NOT EXISTS bodies (
  body_id serial PRIMARY KEY,
  nomenclature citext UNIQUE NOT NULL,
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
  previous_entry bigint REFERENCES body_status(status_id),
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
  previous_entry bigint REFERENCES journal_status(status_id),
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
  previous_entry bigint REFERENCES paper_status(status_id),
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
  previous_entry bigint REFERENCES attribution_status(status_id),
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
  previous_entry bigint REFERENCES author_status(status_id),
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
  previous_entry bigint REFERENCES group_status(status_id),
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
  previous_entry bigint REFERENCES classification_status(status_id),
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
  previous_entry bigint REFERENCES element_status(status_id),
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
  previous_entry bigint REFERENCES note_status(status_id),
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

-------------------------
-- Show DB in testing  --
-------------------------
/*
  This is for testing, just prints out the tables https://rextester.com/EMEDS96343
*/
-- SELECT * FROM bodies;
-- SELECT * FROM journals;
-- SELECT * FROM papers;
-- SELECT * FROM authors;
-- SELECT * FROM attributions;
-- SELECT * FROM element_entries;
-- SELECT * FROM body_status;
-- SELECT * FROM journal_status;
-- SELECT * FROM paper_status;
-- SELECT * FROM author_status;
-- SELECT * FROM attribution_status;
-- SELECT * FROM element_status;


------------------
-- Define views --
------------------

CREATE VIEW bodies_active AS (
  SELECT t1.body_id,
  t1.nomenclature
  FROM bodies as t1
  INNER JOIN body_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'active'
);

CREATE VIEW elements_active AS (
  SELECT t1.element_id,
  t1.body_id,
  t1.element_symbol,
  t1.paper_id,
  t1.page_number,
  t1.ppb_mean,
  t1.deviation,
  t1.less_than,
  t1.original_unit,
  t1.technique,
  t1.note 
  FROM element_entries as t1
  INNER JOIN element_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'active'
);

CREATE VIEW papers_active AS (
  SELECT t1.paper_id,
  t1.journal_id,
  t1.title,
  t1.doi
  FROM papers as t1
  INNER JOIN paper_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'active'
);

CREATE VIEW journals_active AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year
  FROM journals as t1
  INNER JOIN journal_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'active'
);

CREATE VIEW attributions_active AS (
  SELECT t1.attribution_id,
  t1.paper_id,
  t1.author_id
  FROM attributions as t1
  INNER JOIN attribution_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'active'
);

CREATE VIEW authors_active AS (
  SELECT t1.author_id,
  t1.first_name || ' ' || t1.middle_name || ' ' || t1.primary_name as author_name,
  t1.single_entity
  FROM authors as t1 
  INNER JOIN author_status as t2 on t1.status_id = t2.status_id 
  AND t2.current_status = 'active'
);

CREATE VIEW aggregated_authors_by_paper_id AS (
  SELECT string_agg(t1.author_name, ', ') AS authors, 
  t2.paper_id FROM authors_active AS t1
  INNER JOIN attributions_active AS t2 ON t1.author_id = t2.author_id
  GROUP BY paper_id
);

CREATE VIEW groups_active AS (
  SELECT t1.group_id,
  t1.body_id,
  t1.the_group
  FROM groups as t1
  INNER JOIN group_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'active'
);

CREATE VIEW full_attributions_active AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year,
  t2.paper_id,
  t2.title,
  t2.doi,
  t3.author_id,
  t4.author_name,
  t4.single_entity
  FROM journals_active as t1 
  INNER JOIN papers_active as t2 on t1.journal_id = t2.journal_id
  INNER JOIN attributions_active as t3 on t2.paper_id = t3.paper_id
  INNER JOIN authors_active as t4 on t3.author_id = t4.author_id
);

CREATE VIEW elements_with_bodies_groups_active AS (
  SELECT t1.nomenclature,
  t2.the_group,
  t3.*
  FROM bodies_active as t1 
  INNER JOIN groups_active as t2 on t1.body_id = t2.body_id
  INNER JOIN elements_active as t3 on t1.body_id = t3.body_id
);

CREATE VIEW major_element_symbol_arrays_by_body_id AS (
  SELECT body_id,
  array_agg(element_symbol)
  FROM elements_with_bodies_groups_active
  WHERE ppb_mean > 10000000
  GROUP BY body_id
);

CREATE VIEW minor_element_symbol_arrays_by_body_id AS (
  SELECT body_id,
  array_agg(element_symbol)
  FROM elements_with_bodies_groups_active
  WHERE ppb_mean <= 10000000 AND ppb_mean >= 1000000
  GROUP BY body_id
);

CREATE VIEW trace_element_symbol_arrays_by_body_id AS (
  SELECT body_id,
  array_agg(element_symbol)
  FROM elements_with_bodies_groups_active
  WHERE ppb_mean < 1000000
  GROUP BY body_id
);

CREATE VIEW major_elements AS (
  -- View aggregates elemental information for major elements
  SELECT body_id,
  paper_id,
  page_number,
  technique,
  array_agg(element_symbol || ',' || ppb_mean || ',' || deviation || ',' || less_than) as major_elements
  FROM elements_with_bodies_groups_active
  WHERE ppb_mean > 10000000
  GROUP BY body_id, paper_id, page_number, technique
);

CREATE VIEW minor_elements AS (
  -- View aggregates elemental information for minor elements
  SELECT body_id,
  paper_id,
  page_number,
  technique,
  array_agg(element_symbol || ',' || ppb_mean || ',' || deviation || ',' || less_than) as minor_elements
  FROM elements_with_bodies_groups_active
  WHERE ppb_mean <= 10000000 AND ppb_mean >= 1000000
  GROUP BY body_id, paper_id, page_number, technique
);

CREATE VIEW trace_elements AS (
  -- View aggregates elemental information for trace elements
  SELECT body_id,
  paper_id,
  page_number,
  technique,
  array_agg(element_symbol || ',' || ppb_mean || ',' || deviation || ',' || less_than) as trace_elements
  FROM elements_with_bodies_groups_active
  WHERE ppb_mean < 1000000
  GROUP BY body_id, paper_id, page_number, technique
);

CREATE VIEW normalize_major_elements AS (
  SELECT t1.*, t2.minor_elements, t3.trace_elements FROM major_elements AS t1 
  LEFT JOIN minor_elements AS t2 
  ON t1.body_id = t2.body_id
  AND t1.paper_id = t2.paper_id
  AND t1.page_number = t2.page_number
  AND t1.technique = t2.technique
  LEFT JOIN trace_elements AS t3 
  ON t1.body_id = t3.body_id
  AND t1.paper_id = t3.paper_id
  AND t1.page_number = t3.page_number
  AND t1.technique = t3.technique
);

CREATE VIEW normalize_minor_elements AS (
  SELECT t1.body_id, t1.paper_id, t1.page_number, t1.technique, 
    t2.major_elements, t1.minor_elements, t3.trace_elements FROM minor_elements AS t1 
  LEFT JOIN major_elements AS t2 
  ON t1.body_id = t2.body_id
  AND t1.paper_id = t2.paper_id
  AND t1.page_number = t2.page_number
  AND t1.technique = t2.technique
  LEFT JOIN trace_elements AS t3 
  ON t1.body_id = t3.body_id
  AND t1.paper_id = t3.paper_id
  AND t1.page_number = t3.page_number
  AND t1.technique = t3.technique
);

CREATE VIEW normalize_trace_elements AS (
  SELECT t1.body_id, t1.paper_id, t1.page_number, t1.technique,
    t2.major_elements, t3.minor_elements, t1.trace_elements FROM trace_elements AS t1 
  LEFT JOIN major_elements AS t2 
  ON t1.body_id = t2.body_id
  AND t1.paper_id = t2.paper_id
  AND t1.page_number = t2.page_number
  AND t1.technique = t2.technique
  LEFT JOIN minor_elements AS t3 
  ON t1.body_id = t3.body_id
  AND t1.paper_id = t3.paper_id
  AND t1.page_number = t3.page_number
  AND t1.technique = t3.technique
);

CREATE VIEW aggregated_elements AS (
  SELECT * FROM normalize_major_elements UNION
  SELECT * FROM normalize_minor_elements UNION
  SELECT * FROM normalize_trace_elements
  ORDER BY body_id, paper_id, page_number, technique
);

CREATE VIEW aggregated_elements_with_bodies_groups_active AS (
  SELECT t1.nomenclature,
  t2.the_group,
  t3.*
  FROM bodies_active as t1 
  INNER JOIN groups_active as t2 on t1.body_id = t2.body_id
  INNER JOIN aggregated_elements as t3 on t1.body_id = t3.body_id
);

CREATE VIEW papers_with_journals_active AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year,
  t2.title,
  t2.paper_id,
  t2.doi
  FROM journals_active as t1 
  INNER JOIN papers_active as t2 on t1.journal_id = t2.journal_id
);

CREATE VIEW elements_with_bodies_papers_journals_active_no_id AS (
  SELECT t1.nomenclature,
  t1.the_group,
  t1.element_symbol,
  t1.ppb_mean,
  t1.deviation,
  t1.less_than,
  t1.original_unit,
  t1.technique,
  t1.note,
  t2.journal_name,
  t2.volume,
  t2.issue,
  t2.series,
  t2.published_year,
  t2.title,
  t1.page_number
  FROM elements_with_bodies_groups_active as t1 
  INNER JOIN papers_with_journals_active as t2 on t1.paper_id = t2.paper_id
);

CREATE VIEW elements_with_bodies_papers_journals_active_with_id AS (
  SELECT t1.nomenclature,
  t1.the_group,
  t1.body_id,
  t1.element_id,
  t1.element_symbol,
  t1.ppb_mean,
  t1.deviation,
  t1.less_than,
  t1.original_unit,
  t1.technique,
  t1.note,
  t2.journal_id,
  t2.journal_name,
  t2.volume,
  t2.issue,
  t2.series,
  t2.published_year,
  t2.paper_id,
  t2.title,
  t1.page_number
  FROM elements_with_bodies_groups_active as t1 
  INNER JOIN papers_with_journals_active as t2 on t1.paper_id = t2.paper_id
);

CREATE VIEW complete_table AS (
  SELECT t1.body_id AS entry_id,
  t1.nomenclature AS meteorite_name,
  t1.the_group AS classification_group,
  t1.technique,
  t1.major_elements,
  t1.minor_elements,
  t1.trace_elements,
  t2.paper_id,
  t2.title,
  t3.authors,
  t1.page_number,
  t2.journal_name AS journal_name,
  t2.issue AS issue_number,
  t2.published_year
  FROM aggregated_elements_with_bodies_groups_active AS t1 
  INNER JOIN papers_with_journals_active AS t2 ON t1.paper_id = t2.paper_id
  INNER JOIN aggregated_authors_by_paper_id AS t3 ON t1.paper_id = t3.paper_id
  ORDER BY body_id, title, published_year
);

CREATE VIEW export_table AS (
  SELECT t1.body_id,
  t1.nomenclature AS meteorite_name,
  t1.the_group AS classification_group,
  t1.technique,
  t1.element_symbol,
  t1.ppb_mean AS measurement,
  t1.deviation,
  t1.less_than,
  t1.title,
  t2.authors,
  t1.page_number,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.published_year
  FROM elements_with_bodies_papers_journals_active_with_id as t1 
  INNER JOIN aggregated_authors_by_paper_id as t2 on t1.paper_id = t2.paper_id
  ORDER BY body_id, title, page_number, measurement DESC
);

CREATE VIEW papers_pending AS (
  SELECT t1.paper_id,
  t1.journal_id,
  t1.title,
  t1.doi
  FROM papers as t1
  INNER JOIN paper_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'pending'
);

CREATE VIEW groups_pending AS (
  SELECT t1.group_id,
  t1.body_id,
  t1.the_group
  FROM groups as t1
  INNER JOIN group_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'pending'
);

CREATE VIEW flagged_papers AS (
  SELECT t1.paper_id,
  t1.journal_id,
  t1.title,
  t1.doi
  FROM papers as t1
  INNER JOIN paper_review as t2 on t1.paper_id = t2.paper_id
);

CREATE VIEW bodies_pending AS (
  SELECT t1.body_id,
  t1.nomenclature
  FROM bodies as t1
  INNER JOIN body_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'pending'
);

CREATE VIEW flagged_bodies AS (
  SELECT t1.body_id,
  t1.nomenclature
  FROM bodies as t1
  INNER JOIN body_review as t2 on t1.body_id = t2.body_id
);

CREATE VIEW authors_pending AS (
  SELECT t1.author_id,
  t1.first_name || ' ' || t1.middle_name || ' ' || t1.primary_name as author_name,
  t1.single_entity
  FROM authors as t1
  INNER JOIN author_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'pending'
);

CREATE VIEW attributions_pending AS (
  SELECT t1.attribution_id,
  t1.paper_id,
  t1.author_id
  FROM attributions as t1
  INNER JOIN attribution_status as t2 on t1.status_id = t2.status_id
    AND t2.current_status = 'pending'
);

CREATE VIEW pending_aggregated_authors_by_paper_id AS (
  SELECT string_agg(t1.author_name, ', ') AS authors, 
  t2.paper_id FROM authors_pending AS t1
  INNER JOIN attributions_pending AS t2 ON t1.author_id = t2.author_id
  GROUP BY paper_id
);

CREATE VIEW flagged_authors AS (
  SELECT t1.author_id,
  t1.first_name || ' ' || t1.middle_name || ' ' || t1.primary_name as author_name,
  t1.single_entity
  FROM authors as t1
  INNER JOIN author_review as t2 on t1.author_id = t2.author_id
);

CREATE VIEW elements_pending AS (
  SELECT t1.element_id ,
  t1.body_id,
  t1.element_symbol ,
  t1.paper_id ,
  t1.page_number ,
  t1.ppb_mean ,
  t1.deviation ,
  t1.less_than ,
  t1.original_unit ,
  t1.technique ,
  t1.note
  FROM element_entries as t1
  INNER JOIN element_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'pending'
);

CREATE VIEW flagged_elements AS (
  SELECT t1.element_id ,
  t1.body_id,
  t1.element_symbol ,
  t1.paper_id ,
  t1.page_number ,
  t1.ppb_mean ,
  t1.deviation ,
  t1.less_than ,
  t1.original_unit ,
  t1.technique ,
  t1.note
  FROM element_entries as t1
  INNER JOIN element_review as t2 on t1.element_id = t2.element_id
);

CREATE VIEW journals_pending AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year
  FROM journals as t1
  INNER JOIN journal_status as t2 on t1.status_id = t2.status_id
  AND t2.current_status = 'pending'
);

CREATE VIEW flagged_journals AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year
  FROM journals as t1
  INNER JOIN journal_review as t2 on t1.journal_id = t2.journal_id
);

CREATE VIEW flagged_attributions AS (
  SELECT t1.attribution_id,
  t1.paper_id,
  t1.author_id
  FROM attributions as t1
  INNER JOIN attribution_review as t2 on t1.attribution_id = t2.attribution_id
);

CREATE VIEW pending_elements_with_bodies_groups AS (
  SELECT t1.nomenclature,
  t2.the_group,
  t3.*
  FROM bodies_pending as t1 
  INNER JOIN groups_pending as t2 on t1.body_id = t2.body_id
  INNER JOIN elements_pending as t3 on t1.body_id = t3.body_id
);

CREATE VIEW pending_papers_with_journals AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year,
  t2.title,
  t2.paper_id,
  t2.doi
  FROM journals_pending as t1 
  INNER JOIN papers_pending as t2 on t1.journal_id = t2.journal_id
);

CREATE VIEW pending_elements_with_bodies_papers_journals AS (
  SELECT t1.body_id,
  t1.nomenclature,
  t1.the_group,
  t1.element_symbol,
  t1.ppb_mean,
  t1.deviation,
  t1.less_than,
  t1.original_unit,
  t1.technique,
  t1.note,
  t2.journal_name,
  t2.volume,
  t2.issue,
  t2.series,
  t2.published_year,
  t2.title,
  t1.page_number,
  t2.paper_id
  FROM pending_elements_with_bodies_groups as t1 
  INNER JOIN pending_papers_with_journals as t2 on t1.paper_id = t2.paper_id
);

CREATE VIEW full_attributions_pending AS (
  SELECT t1.nomenclature,
    t1.title,
    t1.published_year,
    t2.authors
    FROM pending_elements_with_bodies_papers_journals as t1
    INNER JOIN pending_aggregated_authors_by_paper_id as t2 on t1.paper_id = t2.paper_id
);

CREATE VIEW pending_entries_panel AS (
  select t1.body_id,
  t1.nomenclature,
  t1.title,
  t2.submission_date,
  t2.submitted_by
  from pending_elements_with_bodies_papers_journals as t1
  inner join body_status as t2 on t1.body_id = t2.body_id and t2.current_status='pending'
);

CREATE VIEW flagged_entries_panel AS ( 
  SELECT t1.element_id AS entry_id,
  t1.note,
  t1.submission_date
  FROM element_review as t1
  WHERE t1.element_id NOT IN 
    (SELECT t2.element_id 
     FROM element_status AS t2)
);

CREATE VIEW inactive_entries_panel AS (
  SELECT t1.element_id AS entry_id,
  t1.note,
  t1.submission_date
  FROM element_review AS t1
  WHERE t1.element_id IN 
    (SELECT t2.element_id 
     FROM element_status as t2)
);

CREATE VIEW flagged_groups AS (
  SELECT t1.group_id,
  t1.body_id,
  t1.the_group
  FROM groups AS t1
  INNER JOIN group_review AS t2 ON t2.group_id = t1.group_id
);

CREATE VIEW flagged_elements_with_bodies_group AS (
  SELECT t1.nomenclature,
  t2.the_group,
  t3.*
  FROM flagged_bodies AS t1 
  INNER JOIN flagged_groups AS t2 ON t1.body_id = t2.body_id
  INNER JOIN flagged_elements AS t3 ON t1.body_id = t3.body_id
);

CREATE VIEW flagged_papers_with_journals AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year,
  t2.title,
  t2.paper_id,
  t2.doi
  FROM flagged_journals AS t1 
  INNER JOIN flagged_papers AS t2 ON t1.journal_id = t2.journal_id
);

CREATE VIEW flagged_elements_with_bodies_papers_journals AS (
  SELECT t1.body_id,
  t1.nomenclature,
  t1.the_group,
  t1.element_symbol,
  t1.ppb_mean,
  t1.deviation,
  t1.less_than,
  t1.original_unit,
  t1.technique,
  t1.note,
  t2.journal_name,
  t2.volume,
  t2.issue,
  t2.series,
  t2.published_year,
  t2.title,
  t1.page_number,
  t2.paper_id
  FROM flagged_elements_with_bodies_group AS t1 
  INNER JOIN flagged_papers_with_journals AS t2 ON t1.paper_id = t2.paper_id
);

CREATE VIEW flagged_aggregated_authors_by_paper_id AS (
  SELECT string_agg(t1.author_name, ', ') AS authors, 
  t2.paper_id FROM flagged_authors AS t1
  INNER JOIN flagged_attributions AS t2 ON t1.author_id = t2.author_id
  GROUP BY paper_id
);

CREATE VIEW full_attributions_flagged AS (
  SELECT t1.nomenclature,
    t1.title,
    t1.published_year,
    t2.authors
    FROM flagged_elements_with_bodies_papers_journals AS t1
    INNER JOIN flagged_aggregated_authors_by_paper_id AS t2 ON t1.paper_id = t2.paper_id
);