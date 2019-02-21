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

-------------------------
-- Insert example data --
-------------------------

/*
  Because status_id is a FK from a table that hasn't been populated yet,
  we must wait to place the status_id and it is null at first
*/

-- DUMMY DATA
INSERT INTO users (username, password_hash, role_of)
  VALUES 
  ('dummy', 'digest', 'user');
  -- ('user1', '$2b$10$8bfz5xVV2nB4xSlLcy3U8ONvBbxMc8O6HmuxmDb3IJMVWWr2q7wS.', 'admin'),
  -- ('user2', '$2b$10$KOb8ZeYBqGoOf7X6cNOAm.eeLOuPCD1PmrF0LYTt1MSkcvxeCUwcG', 'data-entry'),
  -- ('user3', '$2b$10$9Perqr/L0WhaddnDN.SOqu164TCrNSbaXovQ/wMC7wRSKUns3e0de', 'user');

INSERT INTO user_info (user_id, first_name, last_name, email_address)
  VALUES
  (
    (SELECT user_id FROM users WHERE username='dummy'),
    'Dummy',
    'Data',
    'email@email.email'
  )
  -- ,
  -- (
  --   (SELECT user_id FROM users WHERE username='user1'),
  --   'Alice',
  --   'Apache',
  --   'aliceax@email.email'
  -- ),
  -- (
  --   (SELECT user_id FROM users WHERE username='user2'),
  --   'Bob',
  --   'Bandit',
  --   'bobbandit@email.email'
  -- ),
  -- (
  --   (SELECT user_id FROM users WHERE username='user3'),
  --   'Candy',
  --   'Comanche',
  --   'candycomanche@email.email'
  -- )
  ;

INSERT INTO journals (journal_name, volume, issue, published_year)
  VALUES 
  (
    'Dummy', 
    1, 
    1, 
    1900
  ),
  (
    'Fake', 
    420, 
    69, 
    2000
  ),
  (
    'Geochimica et Cosmochimica Acta', 
    '73', 
    '16', 
    2009
  );

INSERT INTO papers (journal_id,  title)
  VALUES
  (
    (SELECT journal_id FROM journals WHERE journal_name='Dummy' AND issue='1'), 
    'Dummy'
  ),
  (
    (SELECT journal_id FROM journals WHERE journal_name='Fake' AND issue='69'), 
    'Fake'
  ),
  (
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue='16'),
    ('The IIG iron meteorites: Probable formation in the IIAB core')
  );

INSERT INTO authors (author_id, primary_name, first_name, middle_name, single_entity)
  VALUES
  (DEFAULT, 'Dummy', '', '', true),
  (DEFAULT, 'Fake', '', '', true),
  (DEFAULT, 'Wasson', 'John', 'T.', DEFAULT),
  (DEFAULT, 'Choe', 'Won-Hie', '', DEFAULT);

INSERT INTO attributions (paper_id, author_id)
  VALUES 
  (
    (SELECT paper_id FROM papers WHERE title='Dummy'),
    (SELECT author_id FROM authors WHERE primary_name='Dummy')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Fake'),
    (SELECT author_id FROM authors WHERE primary_name='Fake')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    (SELECT author_id FROM authors WHERE primary_name='Choe' AND first_name='Won-Hie')
  );

INSERT INTO bodies (nomenclature)
  VALUES 
  ('Dummy'),
  ('Fake'),
  ('Guanaco'),
  ('Tombigbee R.'),
  ('Bellsbank'),
  ('Twannberg'),
  ('La Primitiva');

INSERT INTO groups (group_id, body_id, the_group)
  VALUES
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Dummy'),
    'Dummy'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Fake'),
    'Fake'
  ),
  (
    Default,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'IIG'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'IIG'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Bellsbank'),
    'IIG'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Twannberg'),
    'IIG'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='La Primitiva'),
    'IIG'
  );

INSERT INTO classifications (classification_id, body_id, classification)
  VALUES
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Dummy'),
    'Dummy'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Fake'),
    'Fake'
  );

INSERT INTO element_entries (element_id, body_id, element_symbol, paper_id, page_number, ppb_mean, deviation, less_than, original_unit, technique)
  VALUES
  /*Dummy*/
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Dummy'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Dummy'),
    1,
    1,
    1,
    false,
    'ug_g',
    'INAA'
  ),
  /*Fake*/
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Fake'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Fake'),
    1,
    1,
    1,
    false,
    'ug_g',
    'INAA'
  ),
  /*Guanaco*/
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    14000,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'co',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    5080000,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    44300000,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    93000,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    44700,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    71000,
    0,
    false,
    'ug_g',
    'RNAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'as',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    14600,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'w',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    260,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    're',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    36,
    0,
    true,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    13,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    800,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'au',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    1194,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  /* Tombigbee R. */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    10000,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'co',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    5080000,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    44300000,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    86000,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    40600,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    62500,
    0,
    false,
    'ug_g',
    'RNAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'as',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    16800,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'w',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    200,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    're',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    30,
    0,
    true,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    7,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    700,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'au',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    1281,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'p',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    18000000,
    0,
    false,
    'mg_g',
    null
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    's',
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    4880,
    1000000,
    0,
    true,
    'ug_g',
    null
  );

/*
  Populating the status tables.
  The submission date is left as default now(), and the reviewer is left blank since my data
  has not been reviewed for accuracy yet. It is set to 'active' so that the data can be called
  during a search query.
*/
INSERT INTO group_status (status_id, group_id, current_status, submitted_by, previous_entry)
  VALUES
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='Dummy'),
    'pending',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIG' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Guanaco')),
    'active',
    'Troy',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIG' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')),
    'active',
    'Troy',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIG' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Bellsbank')),
    'active',
    'Troy',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIG' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Twannberg')),
    'active',
    'Troy',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIG' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='La Primitiva')),
    'active',
    'Troy',
    NULL
  );

INSERT INTO group_review (review_id, group_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='Dummy'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );

INSERT INTO classification_status (status_id, classification_id, current_status, submitted_by, previous_entry)
  VALUES
  (
    DEFAULT,
    (SELECT classification_id FROM classifications WHERE classification='Dummy'),
    'pending',
    'Ken',
    NULL
  );

INSERT INTO classification_review (review_id, classification_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT classification_id FROM classifications WHERE classification='Dummy'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );

INSERT INTO body_status (status_id, body_id, current_status, submitted_by, previous_entry)
  VALUES
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Dummy'),
    'pending',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Guanaco'),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.'),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Bellsbank'),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Twannberg'),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='La Primitiva'),
    'active',
    'Ken',
    NULL
  );

INSERT INTO body_review (review_id, body_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Fake'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );

INSERT INTO journal_status (status_id, journal_id, current_status, submitted_by, previous_entry)
  VALUES
  (
    DEFAULT,
    (SELECT journal_id FROM journals WHERE journal_name='Dummy'),
    'pending',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue = '16'),
    'active',
    'Ken',
    NULL
  );

INSERT INTO journal_review (review_id, journal_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT journal_id FROM journals WHERE journal_name='Fake'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );

INSERT INTO paper_status (status_id, paper_id, current_status, submitted_by, previous_entry)
  VALUES
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='Dummy'),
    'pending',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core'),
    'active',
    'Ken',
    NULL
  );

INSERT INTO paper_review (review_id, paper_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='Fake'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );

INSERT INTO author_status (status_id, author_id, current_status, submitted_by, previous_entry)
  VALUES
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Dummy'),
    'pending',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John'),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Choe' AND first_name='Won-Hie'),
    'active',
    'Ken',
    NULL
  );

INSERT INTO author_review (review_id, author_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='Fake'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );

INSERT INTO attribution_status (status_id, attribution_id, current_status, submitted_by, previous_entry)
  VALUES
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Dummy')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Dummy')
    ),
    'pending',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John')
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='The IIG iron meteorites: Probable formation in the IIAB core')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Choe' AND first_name='Won-Hie')
    ),
    'active',
    'Ken',
    NULL
  );

INSERT INTO attribution_review (review_id, attribution_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Fake')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Fake')
    ),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );

INSERT INTO element_status (status_id, element_id, current_status, submitted_by, previous_entry)
  VALUES
  /* Dummy */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Dummy')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Dummy')
      AND page_number = 1
    ),
    'pending',
    'Ken',
    NULL
  ),
  /* Guanaco */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Guanaco')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  /* Tombigbee R. */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 'p'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  ),
    (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tombigbee R.')
      AND element_symbol = 's'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'The IIG iron meteorites: Probable formation in the IIAB core')
      AND page_number = 4880
    ),
    'active',
    'Ken',
    NULL
  );

INSERT INTO element_review (review_id, element_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Fake')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fake')
      AND page_number = 1
    ),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  );


-------------------------
-- Add status IDs      --
-------------------------
/* 
  Because the status_id is a FK referencing a status that did not exist yet, it has to be added to the data tables
  after all keys have been seeded. ALTERNATIVE - you may point the FK to a dummy value, and then update later.
*/

UPDATE classifications
SET status_id = (SELECT status_id FROM classification_status WHERE classifications.classification_id = classification_status.classification_id)
WHERE status_id IS NULL;

UPDATE groups
SET status_id = (SELECT status_id FROM group_status WHERE groups.group_id = group_status.group_id)
WHERE status_id IS NULL;

UPDATE journals
SET status_id = (SELECT status_id FROM journal_status WHERE journals.journal_id = journal_status.journal_id)
WHERE status_id IS NULL;

UPDATE papers
SET status_id = (SELECT status_id FROM paper_status WHERE papers.paper_id = paper_status.paper_id)
WHERE status_id IS NULL;

UPDATE authors
SET status_id = (SELECT status_id FROM author_status WHERE authors.author_id = author_status.author_id)
WHERE status_id IS NULL;

UPDATE attributions
SET status_id = (SELECT status_id FROM attribution_status WHERE attributions.attribution_id = attribution_status.attribution_id)
WHERE status_id IS NULL;

UPDATE bodies
SET status_id = (SELECT status_id FROM body_status WHERE bodies.body_id = body_status.body_id)
WHERE status_id IS NULL;

UPDATE element_entries
SET status_id = (SELECT status_id FROM element_status WHERE element_entries.element_id = element_status.element_id)
WHERE status_id IS NULL;


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

CREATE VIEW papers_pending AS (
  SELECT t1.paper_id,
  t1.journal_id,
  t1.title,
  t1.doi
  FROM papers as t1
  INNER JOIN paper_status as t2 on t1.status_id = t2.status_id
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

CREATE VIEW attributions_pending AS (
  SELECT t1.attribution_id,
  t1.paper_id,
  t1.author_id
  FROM attributions as t1
  INNER JOIN attribution_status as t2 on t1.status_id = t2.status_id
    AND t2.current_status = 'pending'
);

CREATE VIEW flagged_attributions AS (
  SELECT t1.attribution_id,
  t1.paper_id,
  t1.author_id
  FROM attributions as t1
  INNER JOIN attribution_review as t2 on t1.attribution_id = t2.attribution_id
);

CREATE VIEW full_attributions_pending AS (
  SELECT t1.nomenclature,
  t2.title,
  t3.published_year,
  t4.author_name
  FROM bodies_pending as t1
  INNER JOIN papers_pending as t2 on t1.body_id = t2.journal_id
  INNER JOIN journals_pending as t3 on t2.paper_id = t3.journal_id
  INNER JOIN authors_pending as t4 on t3.journal_id = t4.author_id
);

CREATE VIEW full_attributions_flagged AS (
  SELECT t1.nomenclature,
  t2.title,
  t3.published_year,
  t4.author_name
  FROM flagged_bodies as t1
  INNER JOIN flagged_papers as t2 on t1.body_id = t2.journal_id
  INNER JOIN flagged_journals as t3 on t2.paper_id = t3.journal_id
  INNER JOIN flagged_authors as t4 on t3.journal_id = t4.author_id
);

CREATE VIEW pending_entries_panel AS (
  SELECT t1.body_id,
  t2.nomenclature,
  t3.title,
  t1.submission_date,
  t1.submitted_by
  FROM body_status AS t1
  INNER JOIN bodies AS t2 ON t1.status_id = t2.status_id AND t1.current_status='pending'
  INNER JOIN papers AS t3 ON t3.status_id = t2.status_id AND t1.current_status='pending'
);