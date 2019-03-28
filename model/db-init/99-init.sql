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
    'Geochimica et Cosmochimica Acta', 
    '75', 
    '7', 
    2011
  ),
  (
    'Geochimica et Cosmochimica Acta', 
    '59', 
    '3', 
    1995
  ),
  (
    'Geochimica et Cosmochimica Acta', 
    '65', 
    '6', 
    2001
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
  ),
  (
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue='7' AND volume='75'),
    'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'
  ),
  (
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue='3' AND volume='59'),
    'Classification and origin of IAB and IIICD iron meteorites'
  ),
  (
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue='6' AND volume='65'),
    'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'
  );

INSERT INTO authors (author_id, primary_name, first_name, middle_name, single_entity)
  VALUES
  (DEFAULT, 'Dummy', 'Michael', '', true),
  (DEFAULT, 'Fake', '', '', true),
  (DEFAULT, 'Wasson', 'John', 'T.', DEFAULT),
  (DEFAULT, 'Choe', 'Won-Hie', '', DEFAULT),
  (DEFAULT, 'Historical','Fake','', DEFAULT),
  (DEFAULT,'Choi','Byeon-Gak','', DEFAULT),
  (DEFAULT,'Ouyang','Xinwei','', DEFAULT),
  (DEFAULT, 'Richardson', 'J.', 'W.', DEFAULT);

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
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    (SELECT author_id FROM authors WHERE primary_name='Choi' AND first_name='Byeon-Gak')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    (SELECT author_id FROM authors WHERE primary_name='Ouyang' AND first_name='Xinwei')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John')
  ),
  (
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    (SELECT author_id FROM authors WHERE primary_name='Richardson')
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
  ('Historical'),
  ('NWA 0854'),
  ('Zagora'),
  ('NWA 2743'),
  ('Foum Zguid'),
  ('Tamentit'),
  ('Anoka'),
  ('Elephant Moraine 83333'),
  ('Otchinjau'),
  ('Gan Gan');

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
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'IAB'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'IC'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'IAB'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'IIAB'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'IIIAB'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'IIICD'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'IAB'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'IVA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'IVA'
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
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'IAB-MG'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'IAB-sLL'
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
  ),

/* NWA 0854 */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    30000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    4540000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    67500000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    140000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    89100,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    400000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    10700,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'sb',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    180,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    1200,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    're',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    210,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    2070,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    6900,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    1461,
    4,
    0,
    false,
    'ug_g',
    'INAA'
  ),

  /* Zagora */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    64000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    4830000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    92600000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    267000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    70100,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    226000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    15600,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'sb',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    250,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    880,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    're',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    267,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    2880,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    6300,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    1768,
    4,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  /* Foum Zguid */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    22000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    4970000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    58100000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    113000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    55500,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    153000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    9910,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'sb',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    200,
    3,
    0,
    true,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    720,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    're',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    40,
    2,
    0,
    true,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    21,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    5300,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    1078,
    4,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  /* NWA 2743 */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    53000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    4760000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    67500000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    137000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    52600,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    195000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    8280,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'sb',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    150,
    3,
    0,
    true,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    880,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    're',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    20,
    2,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    127,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    5400,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    971,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  /* Tamentit */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    31000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    5180000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    85200000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    144000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    20800,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    43000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    8290,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'sb',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    120,
    3,
    0,
    true,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    750,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    're',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    203,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    2500,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    8000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    1760,
    1039,
    4,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  /* Anoka */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    21000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    5600000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    118800000,
    4,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    193000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    17400,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    16000,
    2,
    0,
    false,
    'ug_g',
    'RNAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    20600,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'sb',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    480,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    110,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    160,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    1200,
    2,
    0,
    true,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    1580,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  /* Elephant Moraine 83333 */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    19000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    4880000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    80600000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    184000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    74800,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    226000,
    2,
    0,
    false,
    'ug_g',
    'RNAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    15700,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'sb',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    450,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    800,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    're',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    280,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    2880,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    6800,
    2,
    0,
    true,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    595,
    1750,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),

  /*Otchinjau */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    165000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    3900000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    78300000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    160000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    2090,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'ge',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    119,
    3,
    0,
    false,
    'ug_g',
    'RNAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    4230,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    690,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    're',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    277,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    2460,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    4900,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    983,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  /* Gan Gan */
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'cr',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    23000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'co',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    4130000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'ni',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    91800000,
    3,
    0,
    false,
    'mg_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'cu',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    116000,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'ga',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    2360,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'as',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    12100,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'w',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    430,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    're',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    117,
    3,
    0,
    false,
    'ng_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'ir',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    1110,
    3,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'pt',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    5000,
    2,
    0,
    false,
    'ug_g',
    'INAA'
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'au',
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    952,
    2216,
    4,
    0,
    false,
    'ug_g',
    'INAA'
  );

/*
  Populating the status tables.
  The submission date is left as default now(), and the reviewer is left blank since my data
  has not been reviewed for accuracy yet. It is set to 'active' so that the data can be called
  during a search query.
*/
INSERT INTO group_status (status_id, group_id, current_status, submitted_by, submission_id)
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
    (SELECT group_id FROM groups WHERE the_group='IAB' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IAB' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Zagora')),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IC' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIAB' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIIAB' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Tamentit')),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IIICD' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Anoka')),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IAB' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IVA' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT group_id FROM groups WHERE the_group='IVA' AND body_id=(SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')),
    'pending',
    'Michael',
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

INSERT INTO classification_status (status_id, classification_id, current_status, submitted_by, submission_id)
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
  ),
  (
    DEFAULT,
    (SELECT classification_id FROM classifications WHERE classification='IAB-MG'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT classification_id FROM classifications WHERE classification='IAB-sLL'),
    'active',
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

INSERT INTO body_status (status_id, body_id, current_status, submitted_by, submission_id)
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
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Zagora'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Tamentit'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Anoka'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau'),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan'),
    'pending',
    'Michael',
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

INSERT INTO journal_status (status_id, journal_id, current_status, submitted_by, submission_id)
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
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue = '7' AND volume = '75'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue = '3' AND volume = '59'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT journal_id FROM journals WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue = '6' AND volume = '65'),
    'pending',
    'Michael',
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

INSERT INTO paper_status (status_id, paper_id, current_status, submitted_by, submission_id)
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
    (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends'),
    'pending',
    'Michael',
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

INSERT INTO author_status (status_id, author_id, current_status, submitted_by, submission_id)
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
    (SELECT author_id FROM authors WHERE primary_name='Choi' AND first_name='Byeon-Gak'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Ouyang' AND first_name='Xinwei'),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (SELECT author_id FROM authors WHERE primary_name='Richardson'),
    'pending',
    'Michael',
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

INSERT INTO attribution_status (status_id, attribution_id, current_status, submitted_by, submission_id)
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
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John')
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Wasson' AND first_name='John')
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Ouyang' AND first_name='Xinwei')
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Classification and origin of IAB and IIICD iron meteorites')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Choi' AND first_name='Byeon-Gak')
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Richardson')
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT attribution_id FROM attributions
      WHERE paper_id = (SELECT paper_id FROM papers WHERE title='Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND author_id = (SELECT author_id FROM authors WHERE primary_name='Wasson')
    ),
    'pending',
    'Michael',
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

INSERT INTO element_status (status_id, element_id, current_status, submitted_by, submission_id)
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
  ),
  /* NWA 0854 */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'sb'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 0854')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  /* Zagora */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'sb'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Zagora')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  /* NWA 2743 */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'sb'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='NWA 2743')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  /* Foum Zguid */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'sb'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Foum Zguid')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  /* Tamentit */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'sb'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Tamentit')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa')
      AND page_number = 1760
    ),
    'active',
    'Michael',
    NULL
  ),
  
  /*Anoka */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'sb'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Anoka')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  /*Elephant Moraine 83333 */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'sb'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Elephant Moraine 83333')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Classification and origin of IAB and IIICD iron meteorites')
      AND page_number = 595
    ),
    'active',
    'Michael',
    NULL
  ),

  /* Otchinjau */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),(
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'ge'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Otchinjau')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  /* Gan Gan */
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'cr'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'co'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'ni'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'cu'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),(
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'ga'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'as'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'w'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 're'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'ir'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'pt'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
    NULL
  ),
  (
    DEFAULT,
    (
      SELECT element_id FROM element_entries
      WHERE body_id = (SELECT body_id FROM bodies WHERE nomenclature='Gan Gan')
      AND element_symbol = 'au'
      AND paper_id = (SELECT paper_id FROM papers WHERE title = 'Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends')
      AND page_number = 952
    ),
    'pending',
    'Michael',
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
