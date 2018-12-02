
-- Create and connect to irondb database 
CREATE DATABASE irondb WITH OWNER = group16; 


-------------------
-- Define tables --
-------------------

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
  measurement decimal NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Minor_elements (
  entry_id integer REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measurement decimal NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Trace_elements (
  entry_id integer REFERENCES Entries(entry_id),
  element varchar(10) NOT NULL,
  measurement decimal NOT NULL,
  PRIMARY KEY(entry_id, element)
);

CREATE TABLE IF NOT EXISTS Notes (
  entry_id integer REFERENCES Entries(entry_id),
  notes text
);

CREATE TABLE IF NOT EXISTS Entry_status (
  entry_id integer REFERENCES Entries(entry_id),
  insert_date date DEFAULT current_date,
  inserted_by varchar(25),
  checked_by varchar(25),
  status varchar(10) CHECK (
    status LIKE 'active' OR status LIKE 'inactive' OR status LIKE 'unapproved' OR status LIKE 'reported')
);


------------------
-- Define views --
------------------


CREATE VIEW basic_entries_with_status AS (
  -- View inner joins entries and entry_status tables, without duplicate entry_id
  SELECT Entries.*, Entry_status.insert_date, Entry_status.inserted_by, 
         Entry_status.checked_by, Entry_status.status
  FROM Entries
  INNER JOIN Entry_status ON Entries.entry_id = Entry_status.entry_id
  ORDER BY Entries.meteorite_name
);

CREATE VIEW papers_with_authors AS (
  -- View joins papers table with subquery containing authors
  -- Subquery aggregates authors as a comma delineated string by paper_id
  SELECT Papers.*, s1.authors
  FROM (SELECT string_agg(author, ', ') AS authors, paper_id 
          FROM Authors 
          GROUP BY paper_id) s1
  INNER JOIN Papers ON s1.paper_id = Papers.paper_id
  ORDER BY Papers.paper_id
);

CREATE VIEW journals_with_papers_and_authors AS (
  -- View joins papers_with_authors view with Journals table
  SELECT papers_with_authors.*, Journals.journal_name, 
         Journals.issue_number, Journals.published_year
  FROM papers_with_authors
  INNER JOIN Journals ON papers_with_authors.journal_id = Journals.journal_id
  ORDER BY papers_with_authors.paper_id
);

CREATE VIEW groups_with_analysis_technique AS (
  -- View inner joins groups with analysis_technique on entry_id
  SELECT Groups.*, Analysis_technique.technique
  FROM Groups
  INNER JOIN Analysis_technique ON Groups.entry_id = Analysis_technique.entry_id
  ORDER BY Groups.entry_id
);

CREATE VIEW condensed_major_elements AS (
  -- View concatinates element and measurement rows from major elements table
  -- Then aggregates as a comma delineated string by entry_id
  SELECT entry_id, string_agg(major_element, ', ') AS major_elements 
  FROM (select entry_id, concat(element,': ', measurement) AS major_element from major_elements) s1
  GROUP BY entry_id
  ORDER BY entry_id
);

CREATE VIEW condensed_minor_elements AS (
  -- View concatinates element and measurement rows from minor elements table
  -- Then aggregates as a comma delineated string by entry_id
  SELECT entry_id, string_agg(minor_element, ', ') AS minor_elements 
  FROM (select entry_id, concat(element,': ', measurement) AS minor_element from minor_elements) s1
  GROUP BY entry_id
  ORDER BY entry_id
);

CREATE VIEW condensed_trace_elements AS (
  -- View concatinates element and measurement rows from trace elements table
  -- Then aggregates as a comma delineated string by entry_id
  SELECT entry_id, string_agg(trace_element, ', ') AS trace_elements 
  FROM (select entry_id, concat(element,': ', measurement) AS trace_element from trace_elements) s1
  GROUP BY entry_id
  ORDER BY entry_id
);

CREATE VIEW normalized_major_elements AS (
  -- View left outer joins entries to condensed major elements
  -- This ensures all entries present when joining
  SELECT t1.entry_id, t2.major_elements
  FROM Entries t1
  LEFT OUTER JOIN condensed_major_elements t2 ON t1.entry_id = t2.entry_id
  ORDER BY t1.entry_id
);

CREATE VIEW normalized_minor_elements AS (
  -- View left outer joins entries to condensed minor elements
  -- This ensures all entries present when joining
  SELECT t1.entry_id, t2.minor_elements
  FROM Entries t1
  LEFT OUTER JOIN condensed_minor_elements t2 ON t1.entry_id = t2.entry_id
  ORDER BY t1.entry_id
);

CREATE VIEW normalized_trace_elements AS (
  -- View left outer joins entries to condensed trace elements
  -- This ensures all entries present when joining
  SELECT t1.entry_id, t2.trace_elements
  FROM Entries t1
  LEFT OUTER JOIN condensed_trace_elements t2 ON t1.entry_id = t2.entry_id
  ORDER BY t1.entry_id
);

CREATE VIEW condensed_elemental_composition AS (
  -- View joins normalized views for all compositional categories into one
  -- This ensures all entries have all stored data present
  SELECT t1.*, t2.minor_elements, t3.trace_elements
  FROM (normalized_major_elements t1 INNER JOIN normalized_minor_elements t2 ON t1.entry_id = t2.entry_id)
  INNER JOIN normalized_trace_elements t3 ON t2.entry_id=t3.entry_id
);

CREATE VIEW group_technique_and_composition AS (
  -- View inner joins views groups_with_analysis_technique and condensed_elemental_composition
  -- Combination of Groups, Analysis_technique, and all compisitional tables.
  -- resulting table has entry_id, classification_group, and all compositional data 
  SELECT groups_with_analysis_technique.*, condensed_elemental_composition.major_elements,
         condensed_elemental_composition.minor_elements, condensed_elemental_composition.trace_elements
  FROM groups_with_analysis_technique
  INNER JOIN condensed_elemental_composition ON groups_with_analysis_technique.entry_id = condensed_elemental_composition.entry_id
  ORDER BY groups_with_analysis_technique.entry_id
);

CREATE VIEW entries_and_status_with_journals_papers_and_authors AS (
  -- Inner joins views basic_entries_with_status and journals_with_papers_and_authors
  -- Combintation of Entries, Entry_Status, Journals, Papers, and Authors tables
  SELECT t1.entry_id, t1.paper_id, t2.journal_id, t1.meteorite_name, t2.title, t2.authors, 
         t1.page_number, t2.journal_name, t2.issue_number, t2.published_year, 
         t1.insert_date, t1.inserted_by, t1.checked_by, t1.status
  FROM basic_entries_with_status t1
  INNER JOIN journals_with_papers_and_authors t2 ON t1.paper_id = t2.paper_id
  ORDER BY t1.meteorite_name
);

CREATE VIEW complete_table AS (
  -- Aggregates previous views to combine tables with entry data
  -- Exludes notes
  SELECT t1.entry_id, t1.paper_id, t1.journal_id, t1.meteorite_name, 
         t2.classification_group, t2.technique, t2.major_elements, 
         t2.minor_elements, t2.trace_elements, t1.title, t1.authors, 
         t1.page_number, t1.journal_name, t1.issue_number, t1.published_year, 
         t1.insert_date, t1.inserted_by, t1.checked_by, t1.status
  FROM entries_and_status_with_journals_papers_and_authors t1
  INNER JOIN group_technique_and_composition t2 ON t1.entry_id = t2.entry_id
  ORDER BY t1.meteorite_name
);


-------------------------
-- Insert example data --
-------------------------


INSERT INTO Journals (journal_name, issue_number, published_year) 
  VALUES ('Geochimica et Cosmochimica Acta', 'Vol. 44', 1980);

INSERT INTO Papers (journal_id, title)
  SELECT journal_id, 'Chemical classification of iron meteorites-IX. A new group (IIF), revision of IAB and IIICD, and data on 57 additional irons'
  FROM Journals
  WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue_number='Vol. 44';

INSERT INTO Authors (paper_id, author)
  SELECT paper_id, 'ALFRED KRACHER'
  FROM Papers
  WHERE title='Chemical classification of iron meteorites-IX. A new group (IIF), revision of IAB and IIICD, and data on 57 additional irons';

INSERT INTO Authors (paper_id, author)
  SELECT paper_id, 'JOHN WILLIS'
  FROM Papers
  WHERE title='Chemical classification of iron meteorites-IX. A new group (IIF), revision of IAB and IIICD, and data on 57 additional irons';

INSERT INTO Authors (paper_id, author)
  SELECT paper_id, 'JOHN T. WASSON'
  FROM Papers
  WHERE title='Chemical classification of iron meteorites-IX. A new group (IIF), revision of IAB and IIICD, and data on 57 additional irons';

INSERT INTO Entries (paper_id, meteorite_name, page_number)
  SELECT paper_id, 'Alt Bela', 774
  FROM Papers
  WHERE title='Chemical classification of iron meteorites-IX. A new group (IIF), revision of IAB and IIICD, and data on 57 additional irons';

INSERT INTO Entries (paper_id, meteorite_name, page_number)
  SELECT paper_id, 'Carver', 774
  FROM Papers
  WHERE title='Chemical classification of iron meteorites-IX. A new group (IIF), revision of IAB and IIICD, and data on 57 additional irons';

INSERT INTO Entries (paper_id, meteorite_name, page_number)
  SELECT paper_id, 'Old Woman', 774
  FROM Papers
  WHERE title='Chemical classification of iron meteorites-IX. A new group (IIF), revision of IAB and IIICD, and data on 57 additional irons';

INSERT INTO Analysis_technique (entry_id, technique)
  SELECT entry_id, 'INAA'
  FROM Entries
  WHERE meteorite_name='Alt Bela';

INSERT INTO Analysis_technique (entry_id, technique)
  SELECT entry_id, 'INAA'
  FROM Entries
  WHERE meteorite_name='Carver';

INSERT INTO Analysis_technique (entry_id, technique)
  SELECT entry_id, 'INAA'
  FROM Entries
  WHERE meteorite_name='Old Woman';

INSERT INTO Groups (entry_id, classification_group)
  SELECT entry_id, 'IID'
  FROM Entries
  WHERE meteorite_name='Alt Bela';

INSERT INTO Groups (entry_id, classification_group)
  SELECT entry_id, 'IIA'
  FROM Entries
  WHERE meteorite_name='Carver';

INSERT INTO Groups (entry_id, classification_group)
  SELECT entry_id, 'IIB'
  FROM Entries
  WHERE meteorite_name='Old Woman';

-- All measurments in wt.%, Major > 1%, Minor Between 1% and 0.1%, Trace < 0.1%
INSERT INTO Major_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ni', 10.04
  FROM Entries
  WHERE meteorite_name='Alt Bela';

INSERT INTO Major_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ni', 5.5
  FROM Entries
  WHERE meteorite_name='Carver';

INSERT INTO Major_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ni', 5.71
  FROM Entries
  WHERE meteorite_name='Old Woman';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ga', 0.0075
  FROM Entries
  WHERE meteorite_name='Alt Bela';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ga', 0.00587
  FROM Entries
  WHERE meteorite_name='Carver';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ga', 0.00585
  FROM Entries
  WHERE meteorite_name='Old Woman';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ge', 0.0084
  FROM Entries
  WHERE meteorite_name='Alt Bela';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ge', 0.0184
  FROM Entries
  WHERE meteorite_name='Carver';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ge', 0.019
  FROM Entries
  WHERE meteorite_name='Old Woman';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ir', 0.0016
  FROM Entries
  WHERE meteorite_name='Alt Bela';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ir', 0.0012
  FROM Entries
  WHERE meteorite_name='Carver';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ir', 0.00008
  FROM Entries
  WHERE meteorite_name='Old Woman';

INSERT INTO Entry_status (entry_id, status)
  SELECT entry_id, 'active'
  FROM Entries
  WHERE meteorite_name='Alt Bela';

INSERT INTO Entry_status (entry_id, status)
  SELECT entry_id, 'active'
  FROM Entries
  WHERE meteorite_name='Carver';

INSERT INTO Entry_status (entry_id, status)
  SELECT entry_id, 'active'
  FROM Entries
  WHERE meteorite_name='Old Woman';

-- More example data from different paper
INSERT INTO Journals (journal_name, issue_number, published_year) 
  VALUES ('Geochimica et Cosmochimica Acta', '197', 2017);

INSERT INTO Papers (journal_id, title)
  SELECT journal_id, 'Formation of non-magmatic iron-meteorite group IIE'
  FROM Journals
  WHERE journal_name='Geochimica et Cosmochimica Acta' AND issue_number='197';

INSERT INTO Authors (paper_id, author)
  SELECT paper_id, 'JOHN T. WASSON'
  FROM Papers
  WHERE title='Formation of non-magmatic iron-meteorite group IIE';

INSERT INTO Entries (paper_id, meteorite_name, page_number)
  SELECT paper_id, 'Leshan', 399
  FROM Papers
  WHERE title='Formation of non-magmatic iron-meteorite group IIE';

INSERT INTO Entries (paper_id, meteorite_name, page_number)
  SELECT paper_id, 'Tobychan', 399
  FROM Papers
  WHERE title='Formation of non-magmatic iron-meteorite group IIE';

INSERT INTO Analysis_technique (entry_id, technique)
  SELECT entry_id, 'INAA'
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Analysis_technique (entry_id, technique)
  SELECT entry_id, 'INAA'
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Groups (entry_id, classification_group)
  SELECT entry_id, 'IIE'
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Groups (entry_id, classification_group)
  SELECT entry_id, 'IIE'
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Major_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ni', 9.67
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Major_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ni', 7.56
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Minor_elements (entry_id, element, measurement)
  SELECT entry_id, 'Co', 0.451
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Minor_elements (entry_id, element, measurement)
  SELECT entry_id, 'Co', 0.436
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Cr', 0.0014
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Cr', 0.0012
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Cu', 0.0326
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Cu', 0.0174
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ga', 0.002
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ga', 0.00274
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ge', 0.00689
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ge', 0.00749
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'As', 0.00177
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'As', 0.00074
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Sb', 0.000049
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'W', 0.000119
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'W', 0.000122
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Re', 0.0000484
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Re', 0.0000650
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ir', 0.000429
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Trace_elements (entry_id, element, measurement)
  SELECT entry_id, 'Ir', 0.000653
  FROM Entries
  WHERE meteorite_name='Tobychan';

INSERT INTO Entry_status (entry_id, status)
  SELECT entry_id, 'active'
  FROM Entries
  WHERE meteorite_name='Leshan';

INSERT INTO Entry_status (entry_id, status)
  SELECT entry_id, 'active'
  FROM Entries
  WHERE meteorite_name='Tobychan';
