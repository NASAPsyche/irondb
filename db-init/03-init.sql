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


INSERT INTO user_info (user_id, first_name, last_name, email_address)
  VALUES
  (
    (SELECT user_id FROM users WHERE username='dummy'),
    'Dummy',
    'Data',
    'email@email.email'
  );

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
  ),
  (
    'Fake Historical Paper',
    '1',
    '1',
    2019
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
  ),
  (
    (SELECT journal_id FROM journals WHERE journal_name='Fake Historical Paper' AND issue='1'),
    'Fake Historical Paper'
  );

INSERT INTO authors (author_id, primary_name, first_name, middle_name, single_entity)
  VALUES
  (DEFAULT, 'Dummy', 'Michael', '', true),
  (DEFAULT, 'Fake', '', '', true),
  (DEFAULT, 'Wasson', 'John', 'T.', DEFAULT),
  (DEFAULT, 'Choe', 'Won-Hie', '', DEFAULT),
  (DEFAULT, 'Historical','Fake','', DEFAULT);

INSERT INTO attributions (paper_id, author_id)
  VALUES 
  (
    (SELECT paper_id FROM papers WHERE title='Dummy'),
    (SELECT author_id FROM authors WHERE primary_name='Dummy' and first_name='Michael')
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
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Fake Historical Paper'),
    (SELECT author_id FROM authors WHERE primary_name='Historical' AND first_name='Fake')
  );

INSERT INTO bodies (nomenclature)
  VALUES 
  ('Dummy'),
  ('Fake'),
  ('Guanaco'),
  ('Tombigbee R.'),
  ('Bellsbank'),
  ('Twannberg'),
  ('La Primitiva'),
  ('Historical');

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
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Historical'),
    'Historical'
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
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Historical'),
    'Historical'
  );

INSERT INTO element_entries (
  element_id, 
  body_id, 
  element_symbol, 
  paper_id, 
  page_number, 
  ppb_mean, 
  sigfig,
  deviation, 
  less_than, 
  original_unit, 
  technique
)
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
    1,
    false,
    'ug_g',
    'INAA'
  ),
  /*Historical*/
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Historical'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Fake Historical Paper'),
    1,
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
    3,
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
    3,
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
    3,
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
    3,
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
    3,
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
    3,
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
    3,
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
    3,
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
    2,
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
    2,
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
    1,
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
    4,
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
    3,
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
    3,
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
    4,
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
    3,
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
    3,
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
    3,
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
    3,
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
    3,
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
    2,
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
    1,
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
    1,
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
    4,
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
    3,
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
    3,
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
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='Historical' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Historical')),
    'historical',
    'Michael',
    NULL
  );

INSERT INTO group_review (review_id, group_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='Fake'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='Historical'),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
  ),
  (
    DEFAULT,
    (SELECT classification_id FROM classifications WHERE classification='Historical'),
    'historical',
    'Michael',
    NULL
  );

INSERT INTO classification_review (review_id, classification_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT classification_id FROM classifications WHERE classification='Fake'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  ),
  (
    DEFAULT,
    (SELECT classification_id FROM classifications WHERE classification='Historical'),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Historical'),
    'historical',
    'Michael',
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
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Historical'),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
  ),
  (
    DEFAULT,
    (SELECT journal_id FROM journals WHERE journal_name='Fake Historical Paper' AND issue = '1'),
    'historical',
    'Michael',
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
  ),
  (
    DEFAULT,
    (SELECT journal_id FROM journals WHERE journal_name='Fake Historical Paper'),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
  ),
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='Fake Historical Paper'),
    'historical',
    'Michael',
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
  ),
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='Fake Historical Paper'),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
  ),
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Historical' AND first_name='Fake'),
    'historical',
    'Michael',
    NULL
  );

INSERT INTO author_review (review_id, author_id, note, resolved, email_address, reviewed_by, submission_date)
  VALUES
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Fake'),
    'not correct',
    DEFAULT,
    'fake@gmail.com',
    1,
    DEFAULT
  ),
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Historical' AND first_name='Fake'),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Dummy' AND first_name='Michael')
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
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Fake Historical Paper')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Historical' AND first_name='Fake')
    ),
    'historical',
    'Michael',
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
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Fake Historical Paper')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Historical')
    ),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
  /* Historical */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Historical')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fake Historical Paper')
      AND page_number = 1
    ),
    'historical',
    'Michael',
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
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Historical')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fake Historical Paper')
      AND page_number = 1
    ),
    'Inactive entry',
    DEFAULT,
    'fake@yahoo.com',
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
