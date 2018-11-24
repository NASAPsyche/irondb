
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

-- Insert example data
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
