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
  t1.sigfig,
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
  array_agg(element_symbol || ',' || ppb_mean || ',' || deviation || ',' || less_than || ',' || sigfig) as major_elements
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
  array_agg(element_symbol || ',' || ppb_mean || ',' || deviation || ',' || less_than || ',' || sigfig) as minor_elements
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
  array_agg(element_symbol || ',' || ppb_mean || ',' || deviation || ',' || less_than || ',' || sigfig) as trace_elements
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
  t1.sigfig,
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
  t2.volume,
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
  t1.sigfig,
  t1.title,
  t2.authors,
  t1.page_number,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.published_year
  FROM elements_with_bodies_papers_journals_active_with_id as t1 
  INNER JOIN aggregated_authors_by_paper_id as t2 on t1.paper_id = t2.paper_id
  ORDER BY body_id ASC, technique DESC, measurement DESC, element_symbol ASC, title, page_number
);

CREATE VIEW export_major_element_symbols AS (
  SELECT body_id, element_symbol
  FROM export_table
  WHERE measurement > 10000000
  ORDER BY element_symbol
);

CREATE VIEW export_minor_element_symbols AS (
  SELECT body_id, element_symbol
  FROM export_table
  WHERE measurement <= 10000000 AND measurement >= 1000000
  ORDER BY element_symbol
);

CREATE VIEW export_trace_element_symbols AS (
  SELECT body_id, element_symbol
  FROM export_table
  WHERE measurement < 1000000
  ORDER BY element_symbol
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
  t1.sigfig,
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
  SELECT t1.paper_id,
    t1.nomenclature,
    t1.title,
    t1.published_year,
    t2.authors
    FROM pending_elements_with_bodies_papers_journals as t1
    INNER JOIN pending_aggregated_authors_by_paper_id as t2 on t1.paper_id = t2.paper_id
);

CREATE VIEW pending_entries_panel AS (
  -- All papers associated with a pending submission
  -- Currently in use
  SELECT t1.paper_id,
  t1.title,
  t2.submission_date,
  t2.submitted_by,
  t2.submission_id
  FROM papers AS t1
  JOIN (SELECT submission_date, t4.submitted_by, t3.submission_id, paper_id 
        FROM paper_status AS t3
        JOIN (SELECT username as submitted_by, submission_id 
              FROM submissions
              WHERE pending = true) AS t4
        ON t3.submission_id = t4.submission_id) AS t2
  ON t1.paper_id = t2.paper_id
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

CREATE VIEW authors_all AS (
  SELECT t1.author_id,
    t1.first_name || ' ' || t1.middle_name || ' ' || t1.primary_name as author_name,
    t1.single_entity
    FROM authors as t1 
    INNER JOIN author_status as t2 on t1.status_id = t2.status_id
    WHERE current_status != 'rejected'
);

CREATE VIEW attributions_all AS (
  SELECT t1.attribution_id,
  t1.paper_id,
  t1.author_id
  FROM attributions as t1
  INNER JOIN attribution_status as t2 on t1.status_id = t2.status_id
);


CREATE VIEW journals_all AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year
  FROM journals as t1
  INNER JOIN journal_status as t2 on t1.status_id = t2.status_id
);

CREATE VIEW papers_all AS (
  SELECT t1.paper_id,
  t1.journal_id,
  t1.title,
  t1.doi,
  t2.current_status
  FROM papers as t1
  INNER JOIN paper_status as t2 on t1.status_id = t2.status_id
);

CREATE VIEW full_attributions_all AS (
  SELECT t1.journal_id,
  t1.journal_name,
  t1.volume,
  t1.issue,
  t1.series,
  t1.published_year,
  t2.paper_id,
  t2.title,
  t2.doi,
  t2.current_status,
  t3.author_id,
  t4.author_name,
  t4.single_entity
  FROM journals_all as t1 
  INNER JOIN papers_all as t2 on t1.journal_id = t2.journal_id
  INNER JOIN attributions_all as t3 on t2.paper_id = t3.paper_id
  INNER JOIN authors_all as t4 on t3.author_id = t4.author_id
);

CREATE VIEW all_aggregated_authors_by_paper_id AS (
  SELECT string_agg(t1.author_name, ', ') AS authors, 
  t2.paper_id FROM authors_all AS t1
  INNER JOIN attributions_all AS t2 ON t1.author_id = t2.author_id
  GROUP BY paper_id
);

CREATE VIEW all_papers_with_authors AS (
SELECT DISTINCT t1.paper_id,
   t1.title,
   t1.published_year,
   t2.authors,
   t1.current_status,
   t3.submitted_by,
   t3.submission_id
   FROM full_attributions_all AS t1
   INNER JOIN all_aggregated_authors_by_paper_id AS t2 ON t1.paper_id = t2.paper_id
   JOIN (SELECT t4.paper_id, t4.submission_id, 
         t5.username as submitted_by FROM paper_status AS t4
         JOIN submissions AS t5 ON t4.submission_id = t5.submission_id
         WHERE t4.submission_id IS NOT NULL 
         AND current_status != 'rejected') 
   AS t3 ON t1.paper_id = t3.paper_id
   ORDER BY t1.current_status ASC
);


-- aggregates the measures as an array of strings representing csv
-- CREATE VIEW agg_full_mz AS (
--   SELECT 
--     t2.paper_id,
--     t1.body_id,
--     array_agg(
--       t1.nomenclature || ',' || 
--       t2.element_symbol || ',' || 
--       t2.less_than || ',' || 
--       t2.ppb_mean || ',' || 
--       t2.sigfig || ',' || 
--       t2.deviation || ',' || 
--       t2.original_unit  || ',' || 
--       t2.technique  || ',' || 
--       t2.page_number
--     ) as measure
--   FROM bodies_active AS t1
--   INNER JOIN
--   element_entries AS t2 on (t1.body_id = t2.body_id)
--   GROUP BY 
--     t2.paper_id,
--     t1.body_id
-- );

--------------------------
-- Build monolith views --
--------------------------

------------
-- ACTIVE --
------------

-- ACTIVE BODY_GROUP_CLASS
-- Match bodies to group and classification with possible null values
-- This is an intermediate view
CREATE VIEW active_body_group_class AS (
  SELECT 
    t1.body_id,
    t1.nomenclature,
    t2.the_group,
    t3.classification
  FROM bodies_active as t1
  LEFT OUTER JOIN 
  groups as t2 on t1.body_id = t2.body_id
  LEFT OUTER JOIN
  classifications as t3 on t1.body_id = t3.body_id
);


-- ACTIVE AGGREGATE OF MEASUREMENTS
-- Aggregates the measurements of active bodies and ties it to a paper
-- This is an intermediate view
CREATE VIEW active_agg_mz AS (
  SELECT 
    t2.paper_id,
    t1.body_id,
    array_agg(
      getMz(
      t3.nomenclature,
      t3.the_group,
      t3.classification,
      t2.element_symbol,
      t2.less_than,
      t2.ppb_mean,
      t2.sigfig,
      t2.deviation,
      t2.original_unit,
      t2.technique,
      t2.page_number
    ) )as measure
  FROM bodies_active AS t1
  INNER JOIN
    elements_active AS t2 ON (t1.body_id = t2.body_id)
  INNER JOIN
    active_body_group_class AS t3 ON (t2.body_id = t3.body_id)
  GROUP BY 
    t2.paper_id,
    t1.body_id
);



-- ACTIVE MONOLITH VIEW OF INFORMATION ASSOCIATED WITH PAPERS
CREATE VIEW monolith_paper_active as (
  SELECT
    t1.paper_id,
    t1.title,
    t1.doi,
    t3.authors,
    t4.journal_id,
    t4.journal_name,
    t4.volume,
    t4.issue,
    t4.series,
    t4.published_year,
    array_agg(
      array_to_string( 
        t2.measure
        , ';', '*'
      ) 
    ) as measure
  FROM 
    papers_active AS t1
  LEFT OUTER JOIN 
    active_agg_mz AS t2 ON  (t1.paper_id = t2.paper_id)
  INNER JOIN 
    aggregated_authors_by_paper_id AS t3 ON (t1.paper_id = t3.paper_id)
  INNER JOIN 
    journals_active AS t4 ON (t1.journal_id = t4.journal_id)
  GROUP BY
    t1.paper_id,
    t1.title,
    t1.doi,
    t3.authors,
    t4.journal_id,
    t4.journal_name,
    t4.volume,
    t4.issue,
    t4.series,
    t4.published_year
);

-------------
-- PENDING --
-------------

-- PENDING BODY_GROUP_CLASS
-- Match bodies to group and classification with possible null values
-- This is an intermediate view
CREATE VIEW pending_body_group_class AS (
  SELECT 
    t1.body_id,
    t1.nomenclature,
    t2.the_group,
    t3.classification
  FROM bodies_pending as t1
  LEFT OUTER JOIN 
  groups as t2 on t1.body_id = t2.body_id
  LEFT OUTER JOIN
  classifications as t3 on t1.body_id = t3.body_id
);

-- PENDING AGGREGATE OF MEASUREMENTS
-- Aggregates the measurements of pending bodies and ties it to a paper
-- This is an intermediate view
CREATE VIEW pending_agg_mz AS (
  SELECT 
    t2.paper_id,
    t1.body_id,
    array_agg(
      getMz(
      t3.nomenclature,
      t3.the_group,
      t3.classification,
      t2.element_symbol,
      t2.less_than,
      t2.ppb_mean,
      t2.sigfig,
      t2.deviation,
      t2.original_unit,
      t2.technique,
      t2.page_number
    ) )as measure
  FROM bodies_pending AS t1
  INNER JOIN
    elements_pending AS t2 ON (t1.body_id = t2.body_id)
  INNER JOIN
    pending_body_group_class AS t3 ON (t2.body_id = t3.body_id)
  GROUP BY 
    t2.paper_id,
    t1.body_id
);

-- PENDING MONOLITH VIEW OF INFORMATION ASSOCIATED WITH PAPERS
CREATE VIEW monolith_paper_pending as (
  SELECT
    t1.paper_id,
    t1.title,
    t1.doi,
    t3.authors,
    t4.journal_id,
    t4.journal_name,
    t4.volume,
    t4.issue,
    t4.series,
    t4.published_year,
    array_agg(
      array_to_string( 
        t2.measure
        , ';', '*'
      ) 
    ) as measure
  FROM 
    papers_pending AS t1
  LEFT OUTER JOIN 
    pending_agg_mz AS t2 ON  (t1.paper_id = t2.paper_id)
  INNER JOIN 
    pending_aggregated_authors_by_paper_id AS t3 ON (t1.paper_id = t3.paper_id)
  INNER JOIN 
    journals_pending AS t4 ON (t1.journal_id = t4.journal_id)
  GROUP BY
    t1.paper_id,
    t1.title,
    t1.doi,
    t3.authors,
    t4.journal_id,
    t4.journal_name,
    t4.volume,
    t4.issue,
    t4.series,
    t4.published_year
);

-- Joining 'users' and 'user_info' table without password
CREATE VIEW users_with_info AS (
  SELECT t1.user_id,
  t1.username,
  t2.first_name,
  t2.last_name,
  t2.email_address,
  t1.role_of
  FROM users AS t1
  INNER JOIN user_info as t2 ON t1.user_id = t2.user_id
  ORDER BY t1.role_of ASC
);