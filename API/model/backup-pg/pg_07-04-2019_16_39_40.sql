--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.submissions DROP CONSTRAINT submissions_username_fkey;
ALTER TABLE ONLY public.paper_status DROP CONSTRAINT paper_status_submission_id_fkey;
ALTER TABLE ONLY public.paper_status DROP CONSTRAINT paper_status_reviewed_by_fkey;
ALTER TABLE ONLY public.paper_status DROP CONSTRAINT paper_status_paper_id_fkey;
ALTER TABLE ONLY public.paper_review DROP CONSTRAINT paper_review_reviewed_by_fkey;
ALTER TABLE ONLY public.paper_review DROP CONSTRAINT paper_review_paper_id_fkey;
ALTER TABLE ONLY public.note_status DROP CONSTRAINT note_status_submission_id_fkey;
ALTER TABLE ONLY public.note_status DROP CONSTRAINT note_status_reviewed_by_fkey;
ALTER TABLE ONLY public.note_status DROP CONSTRAINT note_status_note_id_fkey;
ALTER TABLE ONLY public.note_review DROP CONSTRAINT note_review_reviewed_by_fkey;
ALTER TABLE ONLY public.note_review DROP CONSTRAINT note_review_note_id_fkey;
ALTER TABLE ONLY public.journal_status DROP CONSTRAINT journal_status_submission_id_fkey;
ALTER TABLE ONLY public.journal_status DROP CONSTRAINT journal_status_reviewed_by_fkey;
ALTER TABLE ONLY public.journal_status DROP CONSTRAINT journal_status_journal_id_fkey;
ALTER TABLE ONLY public.journal_review DROP CONSTRAINT journal_review_reviewed_by_fkey;
ALTER TABLE ONLY public.journal_review DROP CONSTRAINT journal_review_journal_id_fkey;
ALTER TABLE ONLY public.group_status DROP CONSTRAINT group_status_submission_id_fkey;
ALTER TABLE ONLY public.group_status DROP CONSTRAINT group_status_reviewed_by_fkey;
ALTER TABLE ONLY public.group_status DROP CONSTRAINT group_status_group_id_fkey;
ALTER TABLE ONLY public.group_review DROP CONSTRAINT group_review_reviewed_by_fkey;
ALTER TABLE ONLY public.group_review DROP CONSTRAINT group_review_group_id_fkey;
ALTER TABLE ONLY public.user_info DROP CONSTRAINT fk_users;
ALTER TABLE ONLY public.papers DROP CONSTRAINT fk_paper_status;
ALTER TABLE ONLY public.notes DROP CONSTRAINT fk_paper_id;
ALTER TABLE ONLY public.element_entries DROP CONSTRAINT fk_paper_id;
ALTER TABLE ONLY public.attributions DROP CONSTRAINT fk_paper_id;
ALTER TABLE ONLY public.notes DROP CONSTRAINT fk_note_status;
ALTER TABLE ONLY public.journals DROP CONSTRAINT fk_journal_status;
ALTER TABLE ONLY public.papers DROP CONSTRAINT fk_journal_id;
ALTER TABLE ONLY public.groups DROP CONSTRAINT fk_group_status;
ALTER TABLE ONLY public.element_entries DROP CONSTRAINT fk_element_status;
ALTER TABLE ONLY public.classifications DROP CONSTRAINT fk_classification_status;
ALTER TABLE ONLY public.bodies DROP CONSTRAINT fk_body_status;
ALTER TABLE ONLY public.element_entries DROP CONSTRAINT fk_body_id;
ALTER TABLE ONLY public.classifications DROP CONSTRAINT fk_body_id;
ALTER TABLE ONLY public.groups DROP CONSTRAINT fk_body_id;
ALTER TABLE ONLY public.authors DROP CONSTRAINT fk_author_status;
ALTER TABLE ONLY public.attributions DROP CONSTRAINT fk_author_id;
ALTER TABLE ONLY public.attributions DROP CONSTRAINT fk_attribution_status;
ALTER TABLE ONLY public.entry_store DROP CONSTRAINT entry_store_username_fkey;
ALTER TABLE ONLY public.element_status DROP CONSTRAINT element_status_submission_id_fkey;
ALTER TABLE ONLY public.element_status DROP CONSTRAINT element_status_reviewed_by_fkey;
ALTER TABLE ONLY public.element_status DROP CONSTRAINT element_status_element_id_fkey;
ALTER TABLE ONLY public.element_review DROP CONSTRAINT element_review_reviewed_by_fkey;
ALTER TABLE ONLY public.element_review DROP CONSTRAINT element_review_element_id_fkey;
ALTER TABLE ONLY public.data_entry_role_requests DROP CONSTRAINT data_entry_role_requests_requesting_user_fkey;
ALTER TABLE ONLY public.classification_status DROP CONSTRAINT classification_status_submission_id_fkey;
ALTER TABLE ONLY public.classification_status DROP CONSTRAINT classification_status_reviewed_by_fkey;
ALTER TABLE ONLY public.classification_status DROP CONSTRAINT classification_status_classification_id_fkey;
ALTER TABLE ONLY public.classification_review DROP CONSTRAINT classification_review_reviewed_by_fkey;
ALTER TABLE ONLY public.classification_review DROP CONSTRAINT classification_review_classification_id_fkey;
ALTER TABLE ONLY public.body_status DROP CONSTRAINT body_status_submission_id_fkey;
ALTER TABLE ONLY public.body_status DROP CONSTRAINT body_status_reviewed_by_fkey;
ALTER TABLE ONLY public.body_status DROP CONSTRAINT body_status_body_id_fkey;
ALTER TABLE ONLY public.body_review DROP CONSTRAINT body_review_reviewed_by_fkey;
ALTER TABLE ONLY public.body_review DROP CONSTRAINT body_review_body_id_fkey;
ALTER TABLE ONLY public.author_status DROP CONSTRAINT author_status_submission_id_fkey;
ALTER TABLE ONLY public.author_status DROP CONSTRAINT author_status_reviewed_by_fkey;
ALTER TABLE ONLY public.author_status DROP CONSTRAINT author_status_author_id_fkey;
ALTER TABLE ONLY public.author_review DROP CONSTRAINT author_review_reviewed_by_fkey;
ALTER TABLE ONLY public.author_review DROP CONSTRAINT author_review_author_id_fkey;
ALTER TABLE ONLY public.attribution_status DROP CONSTRAINT attribution_status_submission_id_fkey;
ALTER TABLE ONLY public.attribution_status DROP CONSTRAINT attribution_status_reviewed_by_fkey;
ALTER TABLE ONLY public.attribution_status DROP CONSTRAINT attribution_status_attribution_id_fkey;
ALTER TABLE ONLY public.attribution_review DROP CONSTRAINT attribution_review_reviewed_by_fkey;
ALTER TABLE ONLY public.attribution_review DROP CONSTRAINT attribution_review_attribution_id_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.user_info DROP CONSTRAINT user_info_pkey;
ALTER TABLE ONLY public.user_info DROP CONSTRAINT user_info_email_address_key;
ALTER TABLE ONLY public.submissions DROP CONSTRAINT submissions_pkey;
ALTER TABLE ONLY public.papers DROP CONSTRAINT papers_pkey;
ALTER TABLE ONLY public.paper_status DROP CONSTRAINT paper_status_pkey;
ALTER TABLE ONLY public.paper_review DROP CONSTRAINT paper_review_pkey;
ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_pkey;
ALTER TABLE ONLY public.note_status DROP CONSTRAINT note_status_pkey;
ALTER TABLE ONLY public.note_review DROP CONSTRAINT note_review_pkey;
ALTER TABLE ONLY public.journals DROP CONSTRAINT journals_pkey;
ALTER TABLE ONLY public.journal_status DROP CONSTRAINT journal_status_pkey;
ALTER TABLE ONLY public.journal_review DROP CONSTRAINT journal_review_pkey;
ALTER TABLE ONLY public.groups DROP CONSTRAINT groups_pkey;
ALTER TABLE ONLY public.group_status DROP CONSTRAINT group_status_pkey;
ALTER TABLE ONLY public.group_review DROP CONSTRAINT group_review_pkey;
ALTER TABLE ONLY public.entry_store DROP CONSTRAINT entry_store_pkey;
ALTER TABLE ONLY public.element_symbols DROP CONSTRAINT element_symbols_symbol_key;
ALTER TABLE ONLY public.element_symbols DROP CONSTRAINT element_symbols_pkey;
ALTER TABLE ONLY public.element_status DROP CONSTRAINT element_status_pkey;
ALTER TABLE ONLY public.element_review DROP CONSTRAINT element_review_pkey;
ALTER TABLE ONLY public.element_entries DROP CONSTRAINT element_entries_pkey;
ALTER TABLE ONLY public.data_entry_role_requests DROP CONSTRAINT data_entry_role_requests_pkey;
ALTER TABLE ONLY public.classifications DROP CONSTRAINT classifications_pkey;
ALTER TABLE ONLY public.classification_status DROP CONSTRAINT classification_status_pkey;
ALTER TABLE ONLY public.classification_review DROP CONSTRAINT classification_review_pkey;
ALTER TABLE ONLY public.body_status DROP CONSTRAINT body_status_pkey;
ALTER TABLE ONLY public.body_review DROP CONSTRAINT body_review_pkey;
ALTER TABLE ONLY public.bodies DROP CONSTRAINT bodies_pkey;
ALTER TABLE ONLY public.authors DROP CONSTRAINT authors_pkey;
ALTER TABLE ONLY public.author_status DROP CONSTRAINT author_status_pkey;
ALTER TABLE ONLY public.author_review DROP CONSTRAINT author_review_pkey;
ALTER TABLE ONLY public.attributions DROP CONSTRAINT attributions_pkey;
ALTER TABLE ONLY public.attributions DROP CONSTRAINT attributions_attribution_id_key;
ALTER TABLE ONLY public.attribution_status DROP CONSTRAINT attribution_status_pkey;
ALTER TABLE ONLY public.attribution_review DROP CONSTRAINT attribution_review_pkey;
ALTER TABLE ONLY public.analysis_techniques DROP CONSTRAINT analysis_techniques_pkey;
ALTER TABLE ONLY public.analysis_techniques DROP CONSTRAINT analysis_techniques_abbreviation_key;
ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE public.submissions ALTER COLUMN submission_id DROP DEFAULT;
ALTER TABLE public.papers ALTER COLUMN paper_id DROP DEFAULT;
ALTER TABLE public.paper_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.paper_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.notes ALTER COLUMN note_id DROP DEFAULT;
ALTER TABLE public.note_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.note_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.journals ALTER COLUMN journal_id DROP DEFAULT;
ALTER TABLE public.journal_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.journal_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.groups ALTER COLUMN group_id DROP DEFAULT;
ALTER TABLE public.group_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.group_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.entry_store ALTER COLUMN entry_id DROP DEFAULT;
ALTER TABLE public.element_symbols ALTER COLUMN symbol_id DROP DEFAULT;
ALTER TABLE public.element_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.element_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.element_entries ALTER COLUMN element_id DROP DEFAULT;
ALTER TABLE public.data_entry_role_requests ALTER COLUMN request_id DROP DEFAULT;
ALTER TABLE public.classifications ALTER COLUMN classification_id DROP DEFAULT;
ALTER TABLE public.classification_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.classification_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.body_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.body_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.bodies ALTER COLUMN body_id DROP DEFAULT;
ALTER TABLE public.authors ALTER COLUMN author_id DROP DEFAULT;
ALTER TABLE public.author_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.author_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.attributions ALTER COLUMN attribution_id DROP DEFAULT;
ALTER TABLE public.attribution_status ALTER COLUMN status_id DROP DEFAULT;
ALTER TABLE public.attribution_review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE public.analysis_techniques ALTER COLUMN technique_id DROP DEFAULT;
DROP VIEW public.users_with_info;
DROP SEQUENCE public.users_user_id_seq;
DROP TABLE public.users;
DROP TABLE public.user_info;
DROP VIEW public.trace_element_symbol_arrays_by_body_id;
DROP SEQUENCE public.submissions_submission_id_seq;
DROP VIEW public.pending_entries_panel;
DROP TABLE public.submissions;
DROP SEQUENCE public.papers_paper_id_seq;
DROP SEQUENCE public.paper_status_status_id_seq;
DROP SEQUENCE public.paper_review_review_id_seq;
DROP SEQUENCE public.notes_note_id_seq;
DROP TABLE public.notes;
DROP SEQUENCE public.note_status_status_id_seq;
DROP TABLE public.note_status;
DROP SEQUENCE public.note_review_review_id_seq;
DROP TABLE public.note_review;
DROP VIEW public.monolith_paper_pending;
DROP VIEW public.pending_agg_mz;
DROP VIEW public.pending_body_group_class;
DROP VIEW public.monolith_paper_active;
DROP VIEW public.minor_element_symbol_arrays_by_body_id;
DROP VIEW public.major_element_symbol_arrays_by_body_id;
DROP SEQUENCE public.journals_journal_id_seq;
DROP SEQUENCE public.journal_status_status_id_seq;
DROP SEQUENCE public.journal_review_review_id_seq;
DROP VIEW public.inactive_entries_panel;
DROP SEQUENCE public.groups_group_id_seq;
DROP SEQUENCE public.group_status_status_id_seq;
DROP SEQUENCE public.group_review_review_id_seq;
DROP VIEW public.full_attributions_pending;
DROP VIEW public.pending_elements_with_bodies_papers_journals;
DROP VIEW public.pending_papers_with_journals;
DROP VIEW public.pending_elements_with_bodies_groups;
DROP VIEW public.pending_aggregated_authors_by_paper_id;
DROP VIEW public.papers_pending;
DROP VIEW public.journals_pending;
DROP VIEW public.groups_pending;
DROP VIEW public.full_attributions_flagged;
DROP VIEW public.full_attributions_active;
DROP VIEW public.flagged_entries_panel;
DROP VIEW public.flagged_elements_with_bodies_papers_journals;
DROP VIEW public.flagged_papers_with_journals;
DROP VIEW public.flagged_papers;
DROP TABLE public.paper_review;
DROP VIEW public.flagged_journals;
DROP TABLE public.journal_review;
DROP VIEW public.flagged_elements_with_bodies_group;
DROP VIEW public.flagged_groups;
DROP TABLE public.group_review;
DROP VIEW public.flagged_elements;
DROP VIEW public.flagged_bodies;
DROP VIEW public.flagged_aggregated_authors_by_paper_id;
DROP VIEW public.flagged_authors;
DROP VIEW public.flagged_attributions;
DROP VIEW public.export_trace_element_symbols;
DROP VIEW public.export_minor_element_symbols;
DROP VIEW public.export_major_element_symbols;
DROP VIEW public.export_table;
DROP SEQUENCE public.entry_store_entry_id_seq;
DROP TABLE public.entry_store;
DROP VIEW public.elements_with_bodies_papers_journals_active_with_id;
DROP VIEW public.elements_with_bodies_papers_journals_active_no_id;
DROP VIEW public.elements_pending;
DROP SEQUENCE public.element_symbols_symbol_id_seq;
DROP TABLE public.element_symbols;
DROP SEQUENCE public.element_status_status_id_seq;
DROP SEQUENCE public.element_review_review_id_seq;
DROP TABLE public.element_review;
DROP SEQUENCE public.element_entries_element_id_seq;
DROP SEQUENCE public.data_entry_role_requests_request_id_seq;
DROP TABLE public.data_entry_role_requests;
DROP VIEW public.complete_table;
DROP VIEW public.papers_with_journals_active;
DROP VIEW public.papers_active;
DROP VIEW public.journals_active;
DROP SEQUENCE public.classifications_classification_id_seq;
DROP SEQUENCE public.classification_status_status_id_seq;
DROP TABLE public.classification_status;
DROP SEQUENCE public.classification_review_review_id_seq;
DROP TABLE public.classification_review;
DROP SEQUENCE public.body_status_status_id_seq;
DROP SEQUENCE public.body_review_review_id_seq;
DROP TABLE public.body_review;
DROP VIEW public.bodies_pending;
DROP SEQUENCE public.bodies_body_id_seq;
DROP VIEW public.authors_pending;
DROP SEQUENCE public.authors_author_id_seq;
DROP SEQUENCE public.author_status_status_id_seq;
DROP SEQUENCE public.author_review_review_id_seq;
DROP TABLE public.author_review;
DROP VIEW public.attributions_pending;
DROP SEQUENCE public.attributions_attribution_id_seq;
DROP SEQUENCE public.attribution_status_status_id_seq;
DROP SEQUENCE public.attribution_review_review_id_seq;
DROP TABLE public.attribution_review;
DROP SEQUENCE public.analysis_techniques_technique_id_seq;
DROP TABLE public.analysis_techniques;
DROP VIEW public.all_papers_with_authors;
DROP VIEW public.full_attributions_all;
DROP VIEW public.papers_all;
DROP TABLE public.papers;
DROP TABLE public.paper_status;
DROP VIEW public.journals_all;
DROP TABLE public.journals;
DROP TABLE public.journal_status;
DROP VIEW public.all_aggregated_authors_by_paper_id;
DROP VIEW public.authors_all;
DROP VIEW public.attributions_all;
DROP VIEW public.aggregated_elements_with_bodies_groups_active;
DROP VIEW public.aggregated_elements;
DROP VIEW public.normalize_trace_elements;
DROP VIEW public.normalize_minor_elements;
DROP VIEW public.normalize_major_elements;
DROP VIEW public.trace_elements;
DROP VIEW public.minor_elements;
DROP VIEW public.major_elements;
DROP VIEW public.elements_with_bodies_groups_active;
DROP VIEW public.groups_active;
DROP TABLE public.group_status;
DROP VIEW public.aggregated_authors_by_paper_id;
DROP VIEW public.authors_active;
DROP TABLE public.authors;
DROP TABLE public.author_status;
DROP VIEW public.attributions_active;
DROP TABLE public.attributions;
DROP TABLE public.attribution_status;
DROP VIEW public.active_agg_mz;
DROP VIEW public.elements_active;
DROP TABLE public.element_status;
DROP TABLE public.element_entries;
DROP VIEW public.active_body_group_class;
DROP TABLE public.groups;
DROP TABLE public.classifications;
DROP VIEW public.bodies_active;
DROP TABLE public.body_status;
DROP TABLE public.bodies;
DROP FUNCTION public.getmz(nomenclature text, the_group text, classification text, element_symbol text, less_than boolean, ppb_mean integer, sigfig integer, deviation integer, original_unit public.units, technique text, page_number integer);
DROP TYPE public.user_role;
DROP TYPE public.statuses;
DROP TYPE public.mz;
DROP TYPE public.units;
DROP EXTENSION citext;
DROP EXTENSION plpythonu;
--
-- Name: plpythonu; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpythonu WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpythonu; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpythonu IS 'PL/PythonU untrusted procedural language';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: units; Type: TYPE; Schema: public; Owner: group16
--

CREATE TYPE public.units AS ENUM (
    'wt_percent',
    'ppm',
    'ppb',
    'mg_g',
    'ug_g',
    'ng_g'
);


ALTER TYPE public.units OWNER TO group16;

--
-- Name: mz; Type: TYPE; Schema: public; Owner: group16
--

CREATE TYPE public.mz AS (
	nomenclature text,
	the_group text,
	classification text,
	element_symbol text,
	less_than boolean,
	ppb_mean integer,
	sigfig integer,
	deviation integer,
	original_unit public.units,
	technique text,
	page_number integer
);


ALTER TYPE public.mz OWNER TO group16;

--
-- Name: statuses; Type: TYPE; Schema: public; Owner: group16
--

CREATE TYPE public.statuses AS ENUM (
    'pending',
    'rejected',
    'active',
    'historical'
);


ALTER TYPE public.statuses OWNER TO group16;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: group16
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'data-entry',
    'user'
);


ALTER TYPE public.user_role OWNER TO group16;

--
-- Name: getmz(text, text, text, text, boolean, integer, integer, integer, public.units, text, integer); Type: FUNCTION; Schema: public; Owner: group16
--

CREATE FUNCTION public.getmz(nomenclature text, the_group text, classification text, element_symbol text, less_than boolean, ppb_mean integer, sigfig integer, deviation integer, original_unit public.units, technique text, page_number integer) RETURNS public.mz
    LANGUAGE plpythonu
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
$$;


ALTER FUNCTION public.getmz(nomenclature text, the_group text, classification text, element_symbol text, less_than boolean, ppb_mean integer, sigfig integer, deviation integer, original_unit public.units, technique text, page_number integer) OWNER TO group16;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bodies; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.bodies (
    body_id integer NOT NULL,
    nomenclature public.citext NOT NULL,
    status_id bigint
);


ALTER TABLE public.bodies OWNER TO group16;

--
-- Name: body_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.body_status (
    status_id bigint NOT NULL,
    body_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.body_status OWNER TO group16;

--
-- Name: bodies_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.bodies_active AS
 SELECT t1.body_id,
    t1.nomenclature
   FROM (public.bodies t1
     JOIN public.body_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'active'::public.statuses))));


ALTER TABLE public.bodies_active OWNER TO group16;

--
-- Name: classifications; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.classifications (
    classification_id integer NOT NULL,
    body_id integer NOT NULL,
    classification text NOT NULL,
    status_id bigint
);


ALTER TABLE public.classifications OWNER TO group16;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.groups (
    group_id integer NOT NULL,
    body_id integer NOT NULL,
    the_group text NOT NULL,
    status_id bigint
);


ALTER TABLE public.groups OWNER TO group16;

--
-- Name: active_body_group_class; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.active_body_group_class AS
 SELECT t1.body_id,
    t1.nomenclature,
    t2.the_group,
    t3.classification
   FROM ((public.bodies_active t1
     LEFT JOIN public.groups t2 ON ((t1.body_id = t2.body_id)))
     LEFT JOIN public.classifications t3 ON ((t1.body_id = t3.body_id)));


ALTER TABLE public.active_body_group_class OWNER TO group16;

--
-- Name: element_entries; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.element_entries (
    element_id integer NOT NULL,
    body_id integer NOT NULL,
    element_symbol character varying(3) NOT NULL,
    paper_id integer NOT NULL,
    page_number integer NOT NULL,
    ppb_mean integer NOT NULL,
    sigfig integer,
    deviation integer DEFAULT 0 NOT NULL,
    less_than boolean DEFAULT false NOT NULL,
    original_unit public.units NOT NULL,
    technique text,
    note text,
    status_id bigint,
    CONSTRAINT lower_case CHECK (((element_symbol)::text = lower((element_symbol)::text))),
    CONSTRAINT positive_number_deviation CHECK ((deviation >= 0)),
    CONSTRAINT positive_number_mean CHECK ((ppb_mean >= 0)),
    CONSTRAINT sigfig_zero_or_greater CHECK ((sigfig >= 0)),
    CONSTRAINT too_big CHECK ((ppb_mean <= 1000000000))
);


ALTER TABLE public.element_entries OWNER TO group16;

--
-- Name: element_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.element_status (
    status_id bigint NOT NULL,
    element_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.element_status OWNER TO group16;

--
-- Name: elements_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.elements_active AS
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
   FROM (public.element_entries t1
     JOIN public.element_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'active'::public.statuses))));


ALTER TABLE public.elements_active OWNER TO group16;

--
-- Name: active_agg_mz; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.active_agg_mz AS
 SELECT t2.paper_id,
    t1.body_id,
    array_agg(public.getmz((t3.nomenclature)::text, t3.the_group, t3.classification, (t2.element_symbol)::text, t2.less_than, t2.ppb_mean, t2.sigfig, t2.deviation, t2.original_unit, t2.technique, t2.page_number)) AS measure
   FROM ((public.bodies_active t1
     JOIN public.elements_active t2 ON ((t1.body_id = t2.body_id)))
     JOIN public.active_body_group_class t3 ON ((t2.body_id = t3.body_id)))
  GROUP BY t2.paper_id, t1.body_id;


ALTER TABLE public.active_agg_mz OWNER TO group16;

--
-- Name: attribution_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.attribution_status (
    status_id bigint NOT NULL,
    attribution_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.attribution_status OWNER TO group16;

--
-- Name: attributions; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.attributions (
    attribution_id integer NOT NULL,
    paper_id integer NOT NULL,
    author_id integer NOT NULL,
    status_id bigint
);


ALTER TABLE public.attributions OWNER TO group16;

--
-- Name: attributions_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.attributions_active AS
 SELECT t1.attribution_id,
    t1.paper_id,
    t1.author_id
   FROM (public.attributions t1
     JOIN public.attribution_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'active'::public.statuses))));


ALTER TABLE public.attributions_active OWNER TO group16;

--
-- Name: author_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.author_status (
    status_id bigint NOT NULL,
    author_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.author_status OWNER TO group16;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.authors (
    author_id integer NOT NULL,
    primary_name public.citext NOT NULL,
    first_name public.citext,
    middle_name public.citext,
    single_entity boolean DEFAULT true NOT NULL,
    status_id bigint
);


ALTER TABLE public.authors OWNER TO group16;

--
-- Name: authors_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.authors_active AS
 SELECT t1.author_id,
    (((((t1.first_name)::text || ' '::text) || (t1.middle_name)::text) || ' '::text) || (t1.primary_name)::text) AS author_name,
    t1.single_entity
   FROM (public.authors t1
     JOIN public.author_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'active'::public.statuses))));


ALTER TABLE public.authors_active OWNER TO group16;

--
-- Name: aggregated_authors_by_paper_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.aggregated_authors_by_paper_id AS
 SELECT string_agg(t1.author_name, ', '::text) AS authors,
    t2.paper_id
   FROM (public.authors_active t1
     JOIN public.attributions_active t2 ON ((t1.author_id = t2.author_id)))
  GROUP BY t2.paper_id;


ALTER TABLE public.aggregated_authors_by_paper_id OWNER TO group16;

--
-- Name: group_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.group_status (
    status_id bigint NOT NULL,
    group_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.group_status OWNER TO group16;

--
-- Name: groups_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.groups_active AS
 SELECT t1.group_id,
    t1.body_id,
    t1.the_group
   FROM (public.groups t1
     JOIN public.group_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'active'::public.statuses))));


ALTER TABLE public.groups_active OWNER TO group16;

--
-- Name: elements_with_bodies_groups_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.elements_with_bodies_groups_active AS
 SELECT t1.nomenclature,
    t2.the_group,
    t3.element_id,
    t3.body_id,
    t3.element_symbol,
    t3.paper_id,
    t3.page_number,
    t3.ppb_mean,
    t3.sigfig,
    t3.deviation,
    t3.less_than,
    t3.original_unit,
    t3.technique,
    t3.note
   FROM ((public.bodies_active t1
     JOIN public.groups_active t2 ON ((t1.body_id = t2.body_id)))
     JOIN public.elements_active t3 ON ((t1.body_id = t3.body_id)));


ALTER TABLE public.elements_with_bodies_groups_active OWNER TO group16;

--
-- Name: major_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.major_elements AS
 SELECT elements_with_bodies_groups_active.body_id,
    elements_with_bodies_groups_active.paper_id,
    elements_with_bodies_groups_active.page_number,
    elements_with_bodies_groups_active.technique,
    array_agg((((((((((elements_with_bodies_groups_active.element_symbol)::text || ','::text) || elements_with_bodies_groups_active.ppb_mean) || ','::text) || elements_with_bodies_groups_active.deviation) || ','::text) || elements_with_bodies_groups_active.less_than) || ','::text) || elements_with_bodies_groups_active.sigfig)) AS major_elements
   FROM public.elements_with_bodies_groups_active
  WHERE (elements_with_bodies_groups_active.ppb_mean > 10000000)
  GROUP BY elements_with_bodies_groups_active.body_id, elements_with_bodies_groups_active.paper_id, elements_with_bodies_groups_active.page_number, elements_with_bodies_groups_active.technique;


ALTER TABLE public.major_elements OWNER TO group16;

--
-- Name: minor_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.minor_elements AS
 SELECT elements_with_bodies_groups_active.body_id,
    elements_with_bodies_groups_active.paper_id,
    elements_with_bodies_groups_active.page_number,
    elements_with_bodies_groups_active.technique,
    array_agg((((((((((elements_with_bodies_groups_active.element_symbol)::text || ','::text) || elements_with_bodies_groups_active.ppb_mean) || ','::text) || elements_with_bodies_groups_active.deviation) || ','::text) || elements_with_bodies_groups_active.less_than) || ','::text) || elements_with_bodies_groups_active.sigfig)) AS minor_elements
   FROM public.elements_with_bodies_groups_active
  WHERE ((elements_with_bodies_groups_active.ppb_mean <= 10000000) AND (elements_with_bodies_groups_active.ppb_mean >= 1000000))
  GROUP BY elements_with_bodies_groups_active.body_id, elements_with_bodies_groups_active.paper_id, elements_with_bodies_groups_active.page_number, elements_with_bodies_groups_active.technique;


ALTER TABLE public.minor_elements OWNER TO group16;

--
-- Name: trace_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.trace_elements AS
 SELECT elements_with_bodies_groups_active.body_id,
    elements_with_bodies_groups_active.paper_id,
    elements_with_bodies_groups_active.page_number,
    elements_with_bodies_groups_active.technique,
    array_agg((((((((((elements_with_bodies_groups_active.element_symbol)::text || ','::text) || elements_with_bodies_groups_active.ppb_mean) || ','::text) || elements_with_bodies_groups_active.deviation) || ','::text) || elements_with_bodies_groups_active.less_than) || ','::text) || elements_with_bodies_groups_active.sigfig)) AS trace_elements
   FROM public.elements_with_bodies_groups_active
  WHERE (elements_with_bodies_groups_active.ppb_mean < 1000000)
  GROUP BY elements_with_bodies_groups_active.body_id, elements_with_bodies_groups_active.paper_id, elements_with_bodies_groups_active.page_number, elements_with_bodies_groups_active.technique;


ALTER TABLE public.trace_elements OWNER TO group16;

--
-- Name: normalize_major_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.normalize_major_elements AS
 SELECT t1.body_id,
    t1.paper_id,
    t1.page_number,
    t1.technique,
    t1.major_elements,
    t2.minor_elements,
    t3.trace_elements
   FROM ((public.major_elements t1
     LEFT JOIN public.minor_elements t2 ON (((t1.body_id = t2.body_id) AND (t1.paper_id = t2.paper_id) AND (t1.page_number = t2.page_number) AND (t1.technique = t2.technique))))
     LEFT JOIN public.trace_elements t3 ON (((t1.body_id = t3.body_id) AND (t1.paper_id = t3.paper_id) AND (t1.page_number = t3.page_number) AND (t1.technique = t3.technique))));


ALTER TABLE public.normalize_major_elements OWNER TO group16;

--
-- Name: normalize_minor_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.normalize_minor_elements AS
 SELECT t1.body_id,
    t1.paper_id,
    t1.page_number,
    t1.technique,
    t2.major_elements,
    t1.minor_elements,
    t3.trace_elements
   FROM ((public.minor_elements t1
     LEFT JOIN public.major_elements t2 ON (((t1.body_id = t2.body_id) AND (t1.paper_id = t2.paper_id) AND (t1.page_number = t2.page_number) AND (t1.technique = t2.technique))))
     LEFT JOIN public.trace_elements t3 ON (((t1.body_id = t3.body_id) AND (t1.paper_id = t3.paper_id) AND (t1.page_number = t3.page_number) AND (t1.technique = t3.technique))));


ALTER TABLE public.normalize_minor_elements OWNER TO group16;

--
-- Name: normalize_trace_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.normalize_trace_elements AS
 SELECT t1.body_id,
    t1.paper_id,
    t1.page_number,
    t1.technique,
    t2.major_elements,
    t3.minor_elements,
    t1.trace_elements
   FROM ((public.trace_elements t1
     LEFT JOIN public.major_elements t2 ON (((t1.body_id = t2.body_id) AND (t1.paper_id = t2.paper_id) AND (t1.page_number = t2.page_number) AND (t1.technique = t2.technique))))
     LEFT JOIN public.minor_elements t3 ON (((t1.body_id = t3.body_id) AND (t1.paper_id = t3.paper_id) AND (t1.page_number = t3.page_number) AND (t1.technique = t3.technique))));


ALTER TABLE public.normalize_trace_elements OWNER TO group16;

--
-- Name: aggregated_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.aggregated_elements AS
 SELECT normalize_major_elements.body_id,
    normalize_major_elements.paper_id,
    normalize_major_elements.page_number,
    normalize_major_elements.technique,
    normalize_major_elements.major_elements,
    normalize_major_elements.minor_elements,
    normalize_major_elements.trace_elements
   FROM public.normalize_major_elements
UNION
 SELECT normalize_minor_elements.body_id,
    normalize_minor_elements.paper_id,
    normalize_minor_elements.page_number,
    normalize_minor_elements.technique,
    normalize_minor_elements.major_elements,
    normalize_minor_elements.minor_elements,
    normalize_minor_elements.trace_elements
   FROM public.normalize_minor_elements
UNION
 SELECT normalize_trace_elements.body_id,
    normalize_trace_elements.paper_id,
    normalize_trace_elements.page_number,
    normalize_trace_elements.technique,
    normalize_trace_elements.major_elements,
    normalize_trace_elements.minor_elements,
    normalize_trace_elements.trace_elements
   FROM public.normalize_trace_elements
  ORDER BY 1, 2, 3, 4;


ALTER TABLE public.aggregated_elements OWNER TO group16;

--
-- Name: aggregated_elements_with_bodies_groups_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.aggregated_elements_with_bodies_groups_active AS
 SELECT t1.nomenclature,
    t2.the_group,
    t3.body_id,
    t3.paper_id,
    t3.page_number,
    t3.technique,
    t3.major_elements,
    t3.minor_elements,
    t3.trace_elements
   FROM ((public.bodies_active t1
     JOIN public.groups_active t2 ON ((t1.body_id = t2.body_id)))
     JOIN public.aggregated_elements t3 ON ((t1.body_id = t3.body_id)));


ALTER TABLE public.aggregated_elements_with_bodies_groups_active OWNER TO group16;

--
-- Name: attributions_all; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.attributions_all AS
 SELECT t1.attribution_id,
    t1.paper_id,
    t1.author_id
   FROM (public.attributions t1
     JOIN public.attribution_status t2 ON ((t1.status_id = t2.status_id)));


ALTER TABLE public.attributions_all OWNER TO group16;

--
-- Name: authors_all; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.authors_all AS
 SELECT t1.author_id,
    (((((t1.first_name)::text || ' '::text) || (t1.middle_name)::text) || ' '::text) || (t1.primary_name)::text) AS author_name,
    t1.single_entity
   FROM (public.authors t1
     JOIN public.author_status t2 ON ((t1.status_id = t2.status_id)));


ALTER TABLE public.authors_all OWNER TO group16;

--
-- Name: all_aggregated_authors_by_paper_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.all_aggregated_authors_by_paper_id AS
 SELECT string_agg(t1.author_name, ', '::text) AS authors,
    t2.paper_id
   FROM (public.authors_all t1
     JOIN public.attributions_all t2 ON ((t1.author_id = t2.author_id)))
  GROUP BY t2.paper_id;


ALTER TABLE public.all_aggregated_authors_by_paper_id OWNER TO group16;

--
-- Name: journal_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.journal_status (
    status_id bigint NOT NULL,
    journal_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.journal_status OWNER TO group16;

--
-- Name: journals; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.journals (
    journal_id integer NOT NULL,
    journal_name text NOT NULL,
    volume public.citext,
    issue public.citext,
    series public.citext,
    published_year integer NOT NULL,
    status_id bigint,
    CONSTRAINT journals_published_year_check CHECK ((published_year >= 1900))
);


ALTER TABLE public.journals OWNER TO group16;

--
-- Name: journals_all; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.journals_all AS
 SELECT t1.journal_id,
    t1.journal_name,
    t1.volume,
    t1.issue,
    t1.series,
    t1.published_year
   FROM (public.journals t1
     JOIN public.journal_status t2 ON ((t1.status_id = t2.status_id)));


ALTER TABLE public.journals_all OWNER TO group16;

--
-- Name: paper_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.paper_status (
    status_id bigint NOT NULL,
    paper_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.paper_status OWNER TO group16;

--
-- Name: papers; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.papers (
    paper_id integer NOT NULL,
    journal_id integer NOT NULL,
    title public.citext NOT NULL,
    doi public.citext,
    status_id bigint
);


ALTER TABLE public.papers OWNER TO group16;

--
-- Name: papers_all; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.papers_all AS
 SELECT t1.paper_id,
    t1.journal_id,
    t1.title,
    t1.doi,
    t2.current_status
   FROM (public.papers t1
     JOIN public.paper_status t2 ON ((t1.status_id = t2.status_id)));


ALTER TABLE public.papers_all OWNER TO group16;

--
-- Name: full_attributions_all; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.full_attributions_all AS
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
   FROM (((public.journals_all t1
     JOIN public.papers_all t2 ON ((t1.journal_id = t2.journal_id)))
     JOIN public.attributions_all t3 ON ((t2.paper_id = t3.paper_id)))
     JOIN public.authors_all t4 ON ((t3.author_id = t4.author_id)));


ALTER TABLE public.full_attributions_all OWNER TO group16;

--
-- Name: all_papers_with_authors; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.all_papers_with_authors AS
 SELECT DISTINCT t1.paper_id,
    t1.title,
    t1.published_year,
    t2.authors,
    t1.current_status
   FROM (public.full_attributions_all t1
     JOIN public.all_aggregated_authors_by_paper_id t2 ON ((t1.paper_id = t2.paper_id)))
  ORDER BY t1.current_status;


ALTER TABLE public.all_papers_with_authors OWNER TO group16;

--
-- Name: analysis_techniques; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.analysis_techniques (
    technique_id integer NOT NULL,
    abbreviation text NOT NULL
);


ALTER TABLE public.analysis_techniques OWNER TO group16;

--
-- Name: analysis_techniques_technique_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.analysis_techniques_technique_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.analysis_techniques_technique_id_seq OWNER TO group16;

--
-- Name: analysis_techniques_technique_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.analysis_techniques_technique_id_seq OWNED BY public.analysis_techniques.technique_id;


--
-- Name: attribution_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.attribution_review (
    review_id bigint NOT NULL,
    attribution_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.attribution_review OWNER TO group16;

--
-- Name: attribution_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.attribution_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attribution_review_review_id_seq OWNER TO group16;

--
-- Name: attribution_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.attribution_review_review_id_seq OWNED BY public.attribution_review.review_id;


--
-- Name: attribution_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.attribution_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attribution_status_status_id_seq OWNER TO group16;

--
-- Name: attribution_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.attribution_status_status_id_seq OWNED BY public.attribution_status.status_id;


--
-- Name: attributions_attribution_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.attributions_attribution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attributions_attribution_id_seq OWNER TO group16;

--
-- Name: attributions_attribution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.attributions_attribution_id_seq OWNED BY public.attributions.attribution_id;


--
-- Name: attributions_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.attributions_pending AS
 SELECT t1.attribution_id,
    t1.paper_id,
    t1.author_id
   FROM (public.attributions t1
     JOIN public.attribution_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'pending'::public.statuses))));


ALTER TABLE public.attributions_pending OWNER TO group16;

--
-- Name: author_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.author_review (
    review_id bigint NOT NULL,
    author_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.author_review OWNER TO group16;

--
-- Name: author_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.author_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.author_review_review_id_seq OWNER TO group16;

--
-- Name: author_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.author_review_review_id_seq OWNED BY public.author_review.review_id;


--
-- Name: author_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.author_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.author_status_status_id_seq OWNER TO group16;

--
-- Name: author_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.author_status_status_id_seq OWNED BY public.author_status.status_id;


--
-- Name: authors_author_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.authors_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.authors_author_id_seq OWNER TO group16;

--
-- Name: authors_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.authors_author_id_seq OWNED BY public.authors.author_id;


--
-- Name: authors_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.authors_pending AS
 SELECT t1.author_id,
    (((((t1.first_name)::text || ' '::text) || (t1.middle_name)::text) || ' '::text) || (t1.primary_name)::text) AS author_name,
    t1.single_entity
   FROM (public.authors t1
     JOIN public.author_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'pending'::public.statuses))));


ALTER TABLE public.authors_pending OWNER TO group16;

--
-- Name: bodies_body_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.bodies_body_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bodies_body_id_seq OWNER TO group16;

--
-- Name: bodies_body_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.bodies_body_id_seq OWNED BY public.bodies.body_id;


--
-- Name: bodies_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.bodies_pending AS
 SELECT t1.body_id,
    t1.nomenclature
   FROM (public.bodies t1
     JOIN public.body_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'pending'::public.statuses))));


ALTER TABLE public.bodies_pending OWNER TO group16;

--
-- Name: body_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.body_review (
    review_id bigint NOT NULL,
    body_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.body_review OWNER TO group16;

--
-- Name: body_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.body_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.body_review_review_id_seq OWNER TO group16;

--
-- Name: body_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.body_review_review_id_seq OWNED BY public.body_review.review_id;


--
-- Name: body_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.body_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.body_status_status_id_seq OWNER TO group16;

--
-- Name: body_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.body_status_status_id_seq OWNED BY public.body_status.status_id;


--
-- Name: classification_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.classification_review (
    review_id bigint NOT NULL,
    classification_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.classification_review OWNER TO group16;

--
-- Name: classification_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.classification_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classification_review_review_id_seq OWNER TO group16;

--
-- Name: classification_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.classification_review_review_id_seq OWNED BY public.classification_review.review_id;


--
-- Name: classification_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.classification_status (
    status_id bigint NOT NULL,
    classification_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.classification_status OWNER TO group16;

--
-- Name: classification_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.classification_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classification_status_status_id_seq OWNER TO group16;

--
-- Name: classification_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.classification_status_status_id_seq OWNED BY public.classification_status.status_id;


--
-- Name: classifications_classification_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.classifications_classification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classifications_classification_id_seq OWNER TO group16;

--
-- Name: classifications_classification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.classifications_classification_id_seq OWNED BY public.classifications.classification_id;


--
-- Name: journals_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.journals_active AS
 SELECT t1.journal_id,
    t1.journal_name,
    t1.volume,
    t1.issue,
    t1.series,
    t1.published_year
   FROM (public.journals t1
     JOIN public.journal_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'active'::public.statuses))));


ALTER TABLE public.journals_active OWNER TO group16;

--
-- Name: papers_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.papers_active AS
 SELECT t1.paper_id,
    t1.journal_id,
    t1.title,
    t1.doi
   FROM (public.papers t1
     JOIN public.paper_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'active'::public.statuses))));


ALTER TABLE public.papers_active OWNER TO group16;

--
-- Name: papers_with_journals_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.papers_with_journals_active AS
 SELECT t1.journal_id,
    t1.journal_name,
    t1.volume,
    t1.issue,
    t1.series,
    t1.published_year,
    t2.title,
    t2.paper_id,
    t2.doi
   FROM (public.journals_active t1
     JOIN public.papers_active t2 ON ((t1.journal_id = t2.journal_id)));


ALTER TABLE public.papers_with_journals_active OWNER TO group16;

--
-- Name: complete_table; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.complete_table AS
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
    t2.journal_name,
    t2.volume,
    t2.published_year
   FROM ((public.aggregated_elements_with_bodies_groups_active t1
     JOIN public.papers_with_journals_active t2 ON ((t1.paper_id = t2.paper_id)))
     JOIN public.aggregated_authors_by_paper_id t3 ON ((t1.paper_id = t3.paper_id)))
  ORDER BY t1.body_id, t2.title, t2.published_year;


ALTER TABLE public.complete_table OWNER TO group16;

--
-- Name: data_entry_role_requests; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.data_entry_role_requests (
    request_id integer NOT NULL,
    requesting_user public.citext NOT NULL,
    requested_date timestamp without time zone DEFAULT now() NOT NULL,
    pending boolean DEFAULT true NOT NULL
);


ALTER TABLE public.data_entry_role_requests OWNER TO group16;

--
-- Name: data_entry_role_requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.data_entry_role_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_entry_role_requests_request_id_seq OWNER TO group16;

--
-- Name: data_entry_role_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.data_entry_role_requests_request_id_seq OWNED BY public.data_entry_role_requests.request_id;


--
-- Name: element_entries_element_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.element_entries_element_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.element_entries_element_id_seq OWNER TO group16;

--
-- Name: element_entries_element_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.element_entries_element_id_seq OWNED BY public.element_entries.element_id;


--
-- Name: element_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.element_review (
    review_id bigint NOT NULL,
    element_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.element_review OWNER TO group16;

--
-- Name: element_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.element_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.element_review_review_id_seq OWNER TO group16;

--
-- Name: element_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.element_review_review_id_seq OWNED BY public.element_review.review_id;


--
-- Name: element_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.element_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.element_status_status_id_seq OWNER TO group16;

--
-- Name: element_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.element_status_status_id_seq OWNED BY public.element_status.status_id;


--
-- Name: element_symbols; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.element_symbols (
    symbol_id integer NOT NULL,
    symbol text NOT NULL
);


ALTER TABLE public.element_symbols OWNER TO group16;

--
-- Name: element_symbols_symbol_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.element_symbols_symbol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.element_symbols_symbol_id_seq OWNER TO group16;

--
-- Name: element_symbols_symbol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.element_symbols_symbol_id_seq OWNED BY public.element_symbols.symbol_id;


--
-- Name: elements_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.elements_pending AS
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
   FROM (public.element_entries t1
     JOIN public.element_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'pending'::public.statuses))));


ALTER TABLE public.elements_pending OWNER TO group16;

--
-- Name: elements_with_bodies_papers_journals_active_no_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.elements_with_bodies_papers_journals_active_no_id AS
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
   FROM (public.elements_with_bodies_groups_active t1
     JOIN public.papers_with_journals_active t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.elements_with_bodies_papers_journals_active_no_id OWNER TO group16;

--
-- Name: elements_with_bodies_papers_journals_active_with_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.elements_with_bodies_papers_journals_active_with_id AS
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
   FROM (public.elements_with_bodies_groups_active t1
     JOIN public.papers_with_journals_active t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.elements_with_bodies_papers_journals_active_with_id OWNER TO group16;

--
-- Name: entry_store; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.entry_store (
    entry_id bigint NOT NULL,
    username public.citext NOT NULL,
    savedata jsonb NOT NULL,
    pdf_path text,
    pending boolean DEFAULT true NOT NULL,
    last_saved_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.entry_store OWNER TO group16;

--
-- Name: entry_store_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.entry_store_entry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.entry_store_entry_id_seq OWNER TO group16;

--
-- Name: entry_store_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.entry_store_entry_id_seq OWNED BY public.entry_store.entry_id;


--
-- Name: export_table; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.export_table AS
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
   FROM (public.elements_with_bodies_papers_journals_active_with_id t1
     JOIN public.aggregated_authors_by_paper_id t2 ON ((t1.paper_id = t2.paper_id)))
  ORDER BY t1.body_id, t1.technique DESC, t1.ppb_mean DESC, t1.element_symbol, t1.title, t1.page_number;


ALTER TABLE public.export_table OWNER TO group16;

--
-- Name: export_major_element_symbols; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.export_major_element_symbols AS
 SELECT export_table.body_id,
    export_table.element_symbol
   FROM public.export_table
  WHERE (export_table.measurement > 10000000)
  ORDER BY export_table.element_symbol;


ALTER TABLE public.export_major_element_symbols OWNER TO group16;

--
-- Name: export_minor_element_symbols; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.export_minor_element_symbols AS
 SELECT export_table.body_id,
    export_table.element_symbol
   FROM public.export_table
  WHERE ((export_table.measurement <= 10000000) AND (export_table.measurement >= 1000000))
  ORDER BY export_table.element_symbol;


ALTER TABLE public.export_minor_element_symbols OWNER TO group16;

--
-- Name: export_trace_element_symbols; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.export_trace_element_symbols AS
 SELECT export_table.body_id,
    export_table.element_symbol
   FROM public.export_table
  WHERE (export_table.measurement < 1000000)
  ORDER BY export_table.element_symbol;


ALTER TABLE public.export_trace_element_symbols OWNER TO group16;

--
-- Name: flagged_attributions; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_attributions AS
 SELECT t1.attribution_id,
    t1.paper_id,
    t1.author_id
   FROM (public.attributions t1
     JOIN public.attribution_review t2 ON ((t1.attribution_id = t2.attribution_id)));


ALTER TABLE public.flagged_attributions OWNER TO group16;

--
-- Name: flagged_authors; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_authors AS
 SELECT t1.author_id,
    (((((t1.first_name)::text || ' '::text) || (t1.middle_name)::text) || ' '::text) || (t1.primary_name)::text) AS author_name,
    t1.single_entity
   FROM (public.authors t1
     JOIN public.author_review t2 ON ((t1.author_id = t2.author_id)));


ALTER TABLE public.flagged_authors OWNER TO group16;

--
-- Name: flagged_aggregated_authors_by_paper_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_aggregated_authors_by_paper_id AS
 SELECT string_agg(t1.author_name, ', '::text) AS authors,
    t2.paper_id
   FROM (public.flagged_authors t1
     JOIN public.flagged_attributions t2 ON ((t1.author_id = t2.author_id)))
  GROUP BY t2.paper_id;


ALTER TABLE public.flagged_aggregated_authors_by_paper_id OWNER TO group16;

--
-- Name: flagged_bodies; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_bodies AS
 SELECT t1.body_id,
    t1.nomenclature
   FROM (public.bodies t1
     JOIN public.body_review t2 ON ((t1.body_id = t2.body_id)));


ALTER TABLE public.flagged_bodies OWNER TO group16;

--
-- Name: flagged_elements; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_elements AS
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
   FROM (public.element_entries t1
     JOIN public.element_review t2 ON ((t1.element_id = t2.element_id)));


ALTER TABLE public.flagged_elements OWNER TO group16;

--
-- Name: group_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.group_review (
    review_id bigint NOT NULL,
    group_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.group_review OWNER TO group16;

--
-- Name: flagged_groups; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_groups AS
 SELECT t1.group_id,
    t1.body_id,
    t1.the_group
   FROM (public.groups t1
     JOIN public.group_review t2 ON ((t2.group_id = t1.group_id)));


ALTER TABLE public.flagged_groups OWNER TO group16;

--
-- Name: flagged_elements_with_bodies_group; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_elements_with_bodies_group AS
 SELECT t1.nomenclature,
    t2.the_group,
    t3.element_id,
    t3.body_id,
    t3.element_symbol,
    t3.paper_id,
    t3.page_number,
    t3.ppb_mean,
    t3.deviation,
    t3.less_than,
    t3.original_unit,
    t3.technique,
    t3.note
   FROM ((public.flagged_bodies t1
     JOIN public.flagged_groups t2 ON ((t1.body_id = t2.body_id)))
     JOIN public.flagged_elements t3 ON ((t1.body_id = t3.body_id)));


ALTER TABLE public.flagged_elements_with_bodies_group OWNER TO group16;

--
-- Name: journal_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.journal_review (
    review_id bigint NOT NULL,
    journal_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.journal_review OWNER TO group16;

--
-- Name: flagged_journals; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_journals AS
 SELECT t1.journal_id,
    t1.journal_name,
    t1.volume,
    t1.issue,
    t1.series,
    t1.published_year
   FROM (public.journals t1
     JOIN public.journal_review t2 ON ((t1.journal_id = t2.journal_id)));


ALTER TABLE public.flagged_journals OWNER TO group16;

--
-- Name: paper_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.paper_review (
    review_id bigint NOT NULL,
    paper_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.paper_review OWNER TO group16;

--
-- Name: flagged_papers; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_papers AS
 SELECT t1.paper_id,
    t1.journal_id,
    t1.title,
    t1.doi
   FROM (public.papers t1
     JOIN public.paper_review t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.flagged_papers OWNER TO group16;

--
-- Name: flagged_papers_with_journals; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_papers_with_journals AS
 SELECT t1.journal_id,
    t1.journal_name,
    t1.volume,
    t1.issue,
    t1.series,
    t1.published_year,
    t2.title,
    t2.paper_id,
    t2.doi
   FROM (public.flagged_journals t1
     JOIN public.flagged_papers t2 ON ((t1.journal_id = t2.journal_id)));


ALTER TABLE public.flagged_papers_with_journals OWNER TO group16;

--
-- Name: flagged_elements_with_bodies_papers_journals; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_elements_with_bodies_papers_journals AS
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
   FROM (public.flagged_elements_with_bodies_group t1
     JOIN public.flagged_papers_with_journals t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.flagged_elements_with_bodies_papers_journals OWNER TO group16;

--
-- Name: flagged_entries_panel; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.flagged_entries_panel AS
 SELECT t1.element_id AS entry_id,
    t1.note,
    t1.submission_date
   FROM public.element_review t1
  WHERE (NOT (t1.element_id IN ( SELECT t2.element_id
           FROM public.element_status t2)));


ALTER TABLE public.flagged_entries_panel OWNER TO group16;

--
-- Name: full_attributions_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.full_attributions_active AS
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
   FROM (((public.journals_active t1
     JOIN public.papers_active t2 ON ((t1.journal_id = t2.journal_id)))
     JOIN public.attributions_active t3 ON ((t2.paper_id = t3.paper_id)))
     JOIN public.authors_active t4 ON ((t3.author_id = t4.author_id)));


ALTER TABLE public.full_attributions_active OWNER TO group16;

--
-- Name: full_attributions_flagged; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.full_attributions_flagged AS
 SELECT t1.nomenclature,
    t1.title,
    t1.published_year,
    t2.authors
   FROM (public.flagged_elements_with_bodies_papers_journals t1
     JOIN public.flagged_aggregated_authors_by_paper_id t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.full_attributions_flagged OWNER TO group16;

--
-- Name: groups_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.groups_pending AS
 SELECT t1.group_id,
    t1.body_id,
    t1.the_group
   FROM (public.groups t1
     JOIN public.group_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'pending'::public.statuses))));


ALTER TABLE public.groups_pending OWNER TO group16;

--
-- Name: journals_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.journals_pending AS
 SELECT t1.journal_id,
    t1.journal_name,
    t1.volume,
    t1.issue,
    t1.series,
    t1.published_year
   FROM (public.journals t1
     JOIN public.journal_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'pending'::public.statuses))));


ALTER TABLE public.journals_pending OWNER TO group16;

--
-- Name: papers_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.papers_pending AS
 SELECT t1.paper_id,
    t1.journal_id,
    t1.title,
    t1.doi
   FROM (public.papers t1
     JOIN public.paper_status t2 ON (((t1.status_id = t2.status_id) AND (t2.current_status = 'pending'::public.statuses))));


ALTER TABLE public.papers_pending OWNER TO group16;

--
-- Name: pending_aggregated_authors_by_paper_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.pending_aggregated_authors_by_paper_id AS
 SELECT string_agg(t1.author_name, ', '::text) AS authors,
    t2.paper_id
   FROM (public.authors_pending t1
     JOIN public.attributions_pending t2 ON ((t1.author_id = t2.author_id)))
  GROUP BY t2.paper_id;


ALTER TABLE public.pending_aggregated_authors_by_paper_id OWNER TO group16;

--
-- Name: pending_elements_with_bodies_groups; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.pending_elements_with_bodies_groups AS
 SELECT t1.nomenclature,
    t2.the_group,
    t3.element_id,
    t3.body_id,
    t3.element_symbol,
    t3.paper_id,
    t3.page_number,
    t3.ppb_mean,
    t3.sigfig,
    t3.deviation,
    t3.less_than,
    t3.original_unit,
    t3.technique,
    t3.note
   FROM ((public.bodies_pending t1
     JOIN public.groups_pending t2 ON ((t1.body_id = t2.body_id)))
     JOIN public.elements_pending t3 ON ((t1.body_id = t3.body_id)));


ALTER TABLE public.pending_elements_with_bodies_groups OWNER TO group16;

--
-- Name: pending_papers_with_journals; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.pending_papers_with_journals AS
 SELECT t1.journal_id,
    t1.journal_name,
    t1.volume,
    t1.issue,
    t1.series,
    t1.published_year,
    t2.title,
    t2.paper_id,
    t2.doi
   FROM (public.journals_pending t1
     JOIN public.papers_pending t2 ON ((t1.journal_id = t2.journal_id)));


ALTER TABLE public.pending_papers_with_journals OWNER TO group16;

--
-- Name: pending_elements_with_bodies_papers_journals; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.pending_elements_with_bodies_papers_journals AS
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
   FROM (public.pending_elements_with_bodies_groups t1
     JOIN public.pending_papers_with_journals t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.pending_elements_with_bodies_papers_journals OWNER TO group16;

--
-- Name: full_attributions_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.full_attributions_pending AS
 SELECT t1.paper_id,
    t1.nomenclature,
    t1.title,
    t1.published_year,
    t2.authors
   FROM (public.pending_elements_with_bodies_papers_journals t1
     JOIN public.pending_aggregated_authors_by_paper_id t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.full_attributions_pending OWNER TO group16;

--
-- Name: group_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.group_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.group_review_review_id_seq OWNER TO group16;

--
-- Name: group_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.group_review_review_id_seq OWNED BY public.group_review.review_id;


--
-- Name: group_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.group_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.group_status_status_id_seq OWNER TO group16;

--
-- Name: group_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.group_status_status_id_seq OWNED BY public.group_status.status_id;


--
-- Name: groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_group_id_seq OWNER TO group16;

--
-- Name: groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.groups_group_id_seq OWNED BY public.groups.group_id;


--
-- Name: inactive_entries_panel; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.inactive_entries_panel AS
 SELECT t1.element_id AS entry_id,
    t1.note,
    t1.submission_date
   FROM public.element_review t1
  WHERE (t1.element_id IN ( SELECT t2.element_id
           FROM public.element_status t2));


ALTER TABLE public.inactive_entries_panel OWNER TO group16;

--
-- Name: journal_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.journal_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.journal_review_review_id_seq OWNER TO group16;

--
-- Name: journal_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.journal_review_review_id_seq OWNED BY public.journal_review.review_id;


--
-- Name: journal_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.journal_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.journal_status_status_id_seq OWNER TO group16;

--
-- Name: journal_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.journal_status_status_id_seq OWNED BY public.journal_status.status_id;


--
-- Name: journals_journal_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.journals_journal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.journals_journal_id_seq OWNER TO group16;

--
-- Name: journals_journal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.journals_journal_id_seq OWNED BY public.journals.journal_id;


--
-- Name: major_element_symbol_arrays_by_body_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.major_element_symbol_arrays_by_body_id AS
 SELECT elements_with_bodies_groups_active.body_id,
    array_agg(elements_with_bodies_groups_active.element_symbol) AS array_agg
   FROM public.elements_with_bodies_groups_active
  WHERE (elements_with_bodies_groups_active.ppb_mean > 10000000)
  GROUP BY elements_with_bodies_groups_active.body_id;


ALTER TABLE public.major_element_symbol_arrays_by_body_id OWNER TO group16;

--
-- Name: minor_element_symbol_arrays_by_body_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.minor_element_symbol_arrays_by_body_id AS
 SELECT elements_with_bodies_groups_active.body_id,
    array_agg(elements_with_bodies_groups_active.element_symbol) AS array_agg
   FROM public.elements_with_bodies_groups_active
  WHERE ((elements_with_bodies_groups_active.ppb_mean <= 10000000) AND (elements_with_bodies_groups_active.ppb_mean >= 1000000))
  GROUP BY elements_with_bodies_groups_active.body_id;


ALTER TABLE public.minor_element_symbol_arrays_by_body_id OWNER TO group16;

--
-- Name: monolith_paper_active; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.monolith_paper_active AS
 SELECT t1.paper_id,
    t1.title,
    t1.doi,
    t3.authors,
    t4.journal_id,
    t4.journal_name,
    t4.volume,
    t4.issue,
    t4.series,
    t4.published_year,
    array_agg(array_to_string(t2.measure, ';'::text, '*'::text)) AS measure
   FROM (((public.papers_active t1
     LEFT JOIN public.active_agg_mz t2 ON ((t1.paper_id = t2.paper_id)))
     JOIN public.aggregated_authors_by_paper_id t3 ON ((t1.paper_id = t3.paper_id)))
     JOIN public.journals_active t4 ON ((t1.journal_id = t4.journal_id)))
  GROUP BY t1.paper_id, t1.title, t1.doi, t3.authors, t4.journal_id, t4.journal_name, t4.volume, t4.issue, t4.series, t4.published_year;


ALTER TABLE public.monolith_paper_active OWNER TO group16;

--
-- Name: pending_body_group_class; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.pending_body_group_class AS
 SELECT t1.body_id,
    t1.nomenclature,
    t2.the_group,
    t3.classification
   FROM ((public.bodies_pending t1
     LEFT JOIN public.groups t2 ON ((t1.body_id = t2.body_id)))
     LEFT JOIN public.classifications t3 ON ((t1.body_id = t3.body_id)));


ALTER TABLE public.pending_body_group_class OWNER TO group16;

--
-- Name: pending_agg_mz; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.pending_agg_mz AS
 SELECT t2.paper_id,
    t1.body_id,
    array_agg(public.getmz((t3.nomenclature)::text, t3.the_group, t3.classification, (t2.element_symbol)::text, t2.less_than, t2.ppb_mean, t2.sigfig, t2.deviation, t2.original_unit, t2.technique, t2.page_number)) AS measure
   FROM ((public.bodies_pending t1
     JOIN public.elements_pending t2 ON ((t1.body_id = t2.body_id)))
     JOIN public.pending_body_group_class t3 ON ((t2.body_id = t3.body_id)))
  GROUP BY t2.paper_id, t1.body_id;


ALTER TABLE public.pending_agg_mz OWNER TO group16;

--
-- Name: monolith_paper_pending; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.monolith_paper_pending AS
 SELECT t1.paper_id,
    t1.title,
    t1.doi,
    t3.authors,
    t4.journal_id,
    t4.journal_name,
    t4.volume,
    t4.issue,
    t4.series,
    t4.published_year,
    array_agg(array_to_string(t2.measure, ';'::text, '*'::text)) AS measure
   FROM (((public.papers_pending t1
     LEFT JOIN public.pending_agg_mz t2 ON ((t1.paper_id = t2.paper_id)))
     JOIN public.pending_aggregated_authors_by_paper_id t3 ON ((t1.paper_id = t3.paper_id)))
     JOIN public.journals_pending t4 ON ((t1.journal_id = t4.journal_id)))
  GROUP BY t1.paper_id, t1.title, t1.doi, t3.authors, t4.journal_id, t4.journal_name, t4.volume, t4.issue, t4.series, t4.published_year;


ALTER TABLE public.monolith_paper_pending OWNER TO group16;

--
-- Name: note_review; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.note_review (
    review_id bigint NOT NULL,
    note_id integer NOT NULL,
    note text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    email_address public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    resolution_date timestamp without time zone,
    action_taken text
);


ALTER TABLE public.note_review OWNER TO group16;

--
-- Name: note_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.note_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.note_review_review_id_seq OWNER TO group16;

--
-- Name: note_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.note_review_review_id_seq OWNED BY public.note_review.review_id;


--
-- Name: note_status; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.note_status (
    status_id bigint NOT NULL,
    note_id integer NOT NULL,
    current_status public.statuses NOT NULL,
    submitted_by public.citext NOT NULL,
    reviewed_by integer,
    submission_date timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_date timestamp without time zone,
    submission_id bigint
);


ALTER TABLE public.note_status OWNER TO group16;

--
-- Name: note_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.note_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.note_status_status_id_seq OWNER TO group16;

--
-- Name: note_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.note_status_status_id_seq OWNED BY public.note_status.status_id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.notes (
    note_id integer NOT NULL,
    paper_id integer NOT NULL,
    note text NOT NULL,
    status_id bigint
);


ALTER TABLE public.notes OWNER TO group16;

--
-- Name: notes_note_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.notes_note_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notes_note_id_seq OWNER TO group16;

--
-- Name: notes_note_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.notes_note_id_seq OWNED BY public.notes.note_id;


--
-- Name: paper_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.paper_review_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.paper_review_review_id_seq OWNER TO group16;

--
-- Name: paper_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.paper_review_review_id_seq OWNED BY public.paper_review.review_id;


--
-- Name: paper_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.paper_status_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.paper_status_status_id_seq OWNER TO group16;

--
-- Name: paper_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.paper_status_status_id_seq OWNED BY public.paper_status.status_id;


--
-- Name: papers_paper_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.papers_paper_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.papers_paper_id_seq OWNER TO group16;

--
-- Name: papers_paper_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.papers_paper_id_seq OWNED BY public.papers.paper_id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.submissions (
    submission_id bigint NOT NULL,
    pdf_path text,
    pending boolean DEFAULT true NOT NULL,
    username public.citext NOT NULL
);


ALTER TABLE public.submissions OWNER TO group16;

--
-- Name: pending_entries_panel; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.pending_entries_panel AS
 SELECT t1.paper_id,
    t1.title,
    t2.submission_date,
    t2.submitted_by,
    t2.submission_id
   FROM (public.papers t1
     JOIN ( SELECT t3.submission_date,
            t3.submitted_by,
            t3.submission_id,
            t3.paper_id
           FROM (public.paper_status t3
             JOIN ( SELECT submissions.submission_id
                   FROM public.submissions
                  WHERE (submissions.pending = true)) t4 ON ((t3.submission_id = t4.submission_id)))) t2 ON ((t1.paper_id = t2.paper_id)));


ALTER TABLE public.pending_entries_panel OWNER TO group16;

--
-- Name: submissions_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.submissions_submission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submissions_submission_id_seq OWNER TO group16;

--
-- Name: submissions_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.submissions_submission_id_seq OWNED BY public.submissions.submission_id;


--
-- Name: trace_element_symbol_arrays_by_body_id; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.trace_element_symbol_arrays_by_body_id AS
 SELECT elements_with_bodies_groups_active.body_id,
    array_agg(elements_with_bodies_groups_active.element_symbol) AS array_agg
   FROM public.elements_with_bodies_groups_active
  WHERE (elements_with_bodies_groups_active.ppb_mean < 1000000)
  GROUP BY elements_with_bodies_groups_active.body_id;


ALTER TABLE public.trace_element_symbol_arrays_by_body_id OWNER TO group16;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.user_info (
    user_id integer NOT NULL,
    first_name public.citext NOT NULL,
    last_name public.citext NOT NULL,
    email_address public.citext NOT NULL
);


ALTER TABLE public.user_info OWNER TO group16;

--
-- Name: users; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username public.citext NOT NULL,
    password_hash text NOT NULL,
    role_of public.user_role NOT NULL
);


ALTER TABLE public.users OWNER TO group16;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO group16;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users_with_info; Type: VIEW; Schema: public; Owner: group16
--

CREATE VIEW public.users_with_info AS
 SELECT t1.user_id,
    t1.username,
    t2.first_name,
    t2.last_name,
    t2.email_address,
    t1.role_of
   FROM (public.users t1
     JOIN public.user_info t2 ON ((t1.user_id = t2.user_id)))
  ORDER BY t1.role_of;


ALTER TABLE public.users_with_info OWNER TO group16;

--
-- Name: analysis_techniques technique_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.analysis_techniques ALTER COLUMN technique_id SET DEFAULT nextval('public.analysis_techniques_technique_id_seq'::regclass);


--
-- Name: attribution_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_review ALTER COLUMN review_id SET DEFAULT nextval('public.attribution_review_review_id_seq'::regclass);


--
-- Name: attribution_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_status ALTER COLUMN status_id SET DEFAULT nextval('public.attribution_status_status_id_seq'::regclass);


--
-- Name: attributions attribution_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attributions ALTER COLUMN attribution_id SET DEFAULT nextval('public.attributions_attribution_id_seq'::regclass);


--
-- Name: author_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_review ALTER COLUMN review_id SET DEFAULT nextval('public.author_review_review_id_seq'::regclass);


--
-- Name: author_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_status ALTER COLUMN status_id SET DEFAULT nextval('public.author_status_status_id_seq'::regclass);


--
-- Name: authors author_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.authors ALTER COLUMN author_id SET DEFAULT nextval('public.authors_author_id_seq'::regclass);


--
-- Name: bodies body_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.bodies ALTER COLUMN body_id SET DEFAULT nextval('public.bodies_body_id_seq'::regclass);


--
-- Name: body_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_review ALTER COLUMN review_id SET DEFAULT nextval('public.body_review_review_id_seq'::regclass);


--
-- Name: body_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_status ALTER COLUMN status_id SET DEFAULT nextval('public.body_status_status_id_seq'::regclass);


--
-- Name: classification_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_review ALTER COLUMN review_id SET DEFAULT nextval('public.classification_review_review_id_seq'::regclass);


--
-- Name: classification_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_status ALTER COLUMN status_id SET DEFAULT nextval('public.classification_status_status_id_seq'::regclass);


--
-- Name: classifications classification_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classifications ALTER COLUMN classification_id SET DEFAULT nextval('public.classifications_classification_id_seq'::regclass);


--
-- Name: data_entry_role_requests request_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.data_entry_role_requests ALTER COLUMN request_id SET DEFAULT nextval('public.data_entry_role_requests_request_id_seq'::regclass);


--
-- Name: element_entries element_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_entries ALTER COLUMN element_id SET DEFAULT nextval('public.element_entries_element_id_seq'::regclass);


--
-- Name: element_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_review ALTER COLUMN review_id SET DEFAULT nextval('public.element_review_review_id_seq'::regclass);


--
-- Name: element_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_status ALTER COLUMN status_id SET DEFAULT nextval('public.element_status_status_id_seq'::regclass);


--
-- Name: element_symbols symbol_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_symbols ALTER COLUMN symbol_id SET DEFAULT nextval('public.element_symbols_symbol_id_seq'::regclass);


--
-- Name: entry_store entry_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.entry_store ALTER COLUMN entry_id SET DEFAULT nextval('public.entry_store_entry_id_seq'::regclass);


--
-- Name: group_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_review ALTER COLUMN review_id SET DEFAULT nextval('public.group_review_review_id_seq'::regclass);


--
-- Name: group_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_status ALTER COLUMN status_id SET DEFAULT nextval('public.group_status_status_id_seq'::regclass);


--
-- Name: groups group_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.groups ALTER COLUMN group_id SET DEFAULT nextval('public.groups_group_id_seq'::regclass);


--
-- Name: journal_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_review ALTER COLUMN review_id SET DEFAULT nextval('public.journal_review_review_id_seq'::regclass);


--
-- Name: journal_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_status ALTER COLUMN status_id SET DEFAULT nextval('public.journal_status_status_id_seq'::regclass);


--
-- Name: journals journal_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journals ALTER COLUMN journal_id SET DEFAULT nextval('public.journals_journal_id_seq'::regclass);


--
-- Name: note_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_review ALTER COLUMN review_id SET DEFAULT nextval('public.note_review_review_id_seq'::regclass);


--
-- Name: note_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_status ALTER COLUMN status_id SET DEFAULT nextval('public.note_status_status_id_seq'::regclass);


--
-- Name: notes note_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.notes ALTER COLUMN note_id SET DEFAULT nextval('public.notes_note_id_seq'::regclass);


--
-- Name: paper_review review_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_review ALTER COLUMN review_id SET DEFAULT nextval('public.paper_review_review_id_seq'::regclass);


--
-- Name: paper_status status_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_status ALTER COLUMN status_id SET DEFAULT nextval('public.paper_status_status_id_seq'::regclass);


--
-- Name: papers paper_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.papers ALTER COLUMN paper_id SET DEFAULT nextval('public.papers_paper_id_seq'::regclass);


--
-- Name: submissions submission_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.submissions ALTER COLUMN submission_id SET DEFAULT nextval('public.submissions_submission_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: analysis_techniques; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.analysis_techniques (technique_id, abbreviation) FROM stdin;
1	INAA
2	RNAA
\.


--
-- Data for Name: attribution_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.attribution_review (review_id, attribution_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	2	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.565872	\N	\N
2	5	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.565872	\N	\N
\.


--
-- Data for Name: attribution_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.attribution_status (status_id, attribution_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.562482	\N	\N
2	3	active	Ken	\N	2019-04-07 21:32:49.562482	\N	\N
3	4	active	Ken	\N	2019-04-07 21:32:49.562482	\N	\N
4	6	active	Michael	\N	2019-04-07 21:32:49.562482	\N	\N
5	7	active	Michael	\N	2019-04-07 21:32:49.562482	\N	\N
6	9	active	Michael	\N	2019-04-07 21:32:49.562482	\N	\N
7	8	active	Michael	\N	2019-04-07 21:32:49.562482	\N	\N
8	11	pending	Michael	\N	2019-04-07 21:32:49.562482	\N	\N
9	10	pending	Michael	\N	2019-04-07 21:32:49.562482	\N	\N
10	5	historical	Michael	\N	2019-04-07 21:32:49.562482	\N	\N
11	12	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: attributions; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.attributions (attribution_id, paper_id, author_id, status_id) FROM stdin;
1	1	1	1
2	2	2	\N
3	3	3	2
4	3	4	3
5	4	5	10
6	5	3	4
7	6	3	5
8	6	6	7
9	6	7	6
10	7	3	9
11	7	8	8
12	8	9	11
\.


--
-- Data for Name: author_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.author_review (review_id, author_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	2	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.559709	\N	\N
2	5	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.559709	\N	\N
\.


--
-- Data for Name: author_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.author_status (status_id, author_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.557226	\N	\N
2	3	active	Ken	\N	2019-04-07 21:32:49.557226	\N	\N
3	4	active	Ken	\N	2019-04-07 21:32:49.557226	\N	\N
4	6	active	Michael	\N	2019-04-07 21:32:49.557226	\N	\N
5	7	active	Michael	\N	2019-04-07 21:32:49.557226	\N	\N
6	8	pending	Michael	\N	2019-04-07 21:32:49.557226	\N	\N
7	5	historical	Michael	\N	2019-04-07 21:32:49.557226	\N	\N
8	9	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.authors (author_id, primary_name, first_name, middle_name, single_entity, status_id) FROM stdin;
1	Dummy	Michael		t	1
2	Fake			t	\N
3	Wasson	John	T.	t	2
4	Choe	Won-Hie		t	3
5	Historical	Fake		t	7
6	Choi	Byeon-Gak		t	4
7	Ouyang	Xinwei		t	5
8	Richardson	J.	W.	t	6
9	Venture	Jonas		f	8
\.


--
-- Data for Name: bodies; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.bodies (body_id, nomenclature, status_id) FROM stdin;
1	Dummy	1
2	Fake	\N
3	Guanaco	2
4	Tombigbee R.	3
5	Bellsbank	4
6	Twannberg	5
7	La Primitiva	6
8	Historical	16
9	NWA 0854	7
10	Zagora	8
11	NWA 2743	9
12	Foum Zguid	10
13	Tamentit	11
14	Anoka	12
15	Elephant Moraine 83333	13
16	Otchinjau	14
17	Gan Gan	15
18	Big Rock	17
19	Little Rock	18
\.


--
-- Data for Name: body_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.body_review (review_id, body_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	2	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.544845	\N	\N
2	8	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.544845	\N	\N
\.


--
-- Data for Name: body_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.body_status (status_id, body_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.541861	\N	\N
2	3	active	Ken	\N	2019-04-07 21:32:49.541861	\N	\N
3	4	active	Ken	\N	2019-04-07 21:32:49.541861	\N	\N
4	5	active	Ken	\N	2019-04-07 21:32:49.541861	\N	\N
5	6	active	Ken	\N	2019-04-07 21:32:49.541861	\N	\N
6	7	active	Ken	\N	2019-04-07 21:32:49.541861	\N	\N
7	9	active	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
8	10	active	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
9	11	active	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
10	12	active	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
11	13	active	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
12	14	active	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
13	15	active	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
14	16	pending	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
15	17	pending	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
16	8	historical	Michael	\N	2019-04-07 21:32:49.541861	\N	\N
17	18	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
18	19	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: classification_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.classification_review (review_id, classification_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	4	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.539358	\N	\N
2	5	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.539358	\N	\N
\.


--
-- Data for Name: classification_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.classification_status (status_id, classification_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.537105	\N	\N
2	5	historical	Michael	\N	2019-04-07 21:32:49.537105	\N	\N
3	2	active	Michael	\N	2019-04-07 21:32:49.537105	\N	\N
4	3	active	Michael	\N	2019-04-07 21:32:49.537105	\N	\N
\.


--
-- Data for Name: classifications; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.classifications (classification_id, body_id, classification, status_id) FROM stdin;
1	1	Dummy	1
2	9	IAB-MG	3
3	10	IAB-sLL	4
4	2	Fake	\N
5	8	Historical	2
\.


--
-- Data for Name: data_entry_role_requests; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.data_entry_role_requests (request_id, requesting_user, requested_date, pending) FROM stdin;
\.


--
-- Data for Name: element_entries; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.element_entries (element_id, body_id, element_symbol, paper_id, page_number, ppb_mean, sigfig, deviation, less_than, original_unit, technique, note, status_id) FROM stdin;
143	18	h	8	1	10000000	1	0	f	wt_percent	INAA	\N	142
144	18	he	8	2	20000000	1	0	f	wt_percent	INAA	\N	143
145	19	li	8	3	30000000	1	0	f	wt_percent	INAA	\N	144
146	19	be	8	4	40000000	1	0	f	wt_percent	INAA	\N	145
1	1	cr	1	1	1	1	1	f	ug_g	INAA	\N	1
2	2	cr	2	1	1	1	1	f	ug_g	INAA	\N	\N
3	8	co	4	1	1	1	1	f	ug_g	INAA	\N	3
4	3	cr	3	4880	14000	3	0	f	ug_g	INAA	\N	2
5	3	co	3	4880	5080000	3	0	f	mg_g	INAA	\N	4
6	3	ni	3	4880	44300000	3	0	f	mg_g	INAA	\N	5
7	3	cu	3	4880	93000	3	0	f	ug_g	INAA	\N	6
8	3	ga	3	4880	44700	3	0	f	ug_g	INAA	\N	7
9	3	ge	3	4880	71000	3	0	f	ug_g	RNAA	\N	8
10	3	as	3	4880	14600	3	0	f	ug_g	INAA	\N	9
11	3	w	3	4880	260	3	0	f	ug_g	INAA	\N	10
12	3	re	3	4880	36	2	0	t	ng_g	INAA	\N	11
13	3	ir	3	4880	13	2	0	f	ug_g	INAA	\N	12
14	3	pt	3	4880	800	1	0	f	ug_g	INAA	\N	13
15	3	au	3	4880	1194	4	0	f	ug_g	INAA	\N	14
16	4	cr	3	4880	10000	3	0	f	ug_g	INAA	\N	15
17	4	co	3	4880	5080000	3	0	f	mg_g	INAA	\N	16
18	4	ni	3	4880	44300000	4	0	f	mg_g	INAA	\N	17
19	4	cu	3	4880	86000	3	0	f	ug_g	INAA	\N	18
20	4	ga	3	4880	40600	3	0	f	ug_g	INAA	\N	19
21	4	ge	3	4880	62500	3	0	f	ug_g	RNAA	\N	20
22	4	as	3	4880	16800	3	0	f	ug_g	INAA	\N	21
23	4	w	3	4880	200	3	0	f	ug_g	INAA	\N	22
24	4	re	3	4880	30	2	0	t	ng_g	INAA	\N	23
25	4	ir	3	4880	7	1	0	f	ug_g	INAA	\N	24
26	4	pt	3	4880	700	1	0	f	ug_g	INAA	\N	25
27	4	au	3	4880	1281	4	0	f	ug_g	INAA	\N	26
28	4	p	3	4880	18000000	3	0	f	mg_g	\N	\N	27
29	4	s	3	4880	1000000	3	0	t	ug_g	\N	\N	28
30	9	cr	5	1760	30000	2	0	f	ug_g	INAA	\N	29
31	9	co	5	1760	4540000	3	0	f	mg_g	INAA	\N	30
32	9	ni	5	1760	67500000	3	0	f	mg_g	INAA	\N	31
33	9	cu	5	1760	140000	3	0	f	ug_g	INAA	\N	32
34	9	ga	5	1760	89100	3	0	f	ug_g	INAA	\N	33
35	9	ge	5	1760	400000	3	0	f	ug_g	INAA	\N	34
36	9	as	5	1760	10700	3	0	f	ug_g	INAA	\N	35
37	9	sb	5	1760	180	3	0	f	ng_g	INAA	\N	36
38	9	w	5	1760	1200	3	0	f	ug_g	INAA	\N	37
39	9	re	5	1760	210	3	0	f	ng_g	INAA	\N	38
40	9	ir	5	1760	2070	3	0	f	ug_g	INAA	\N	39
41	9	pt	5	1760	6900	2	0	f	ug_g	INAA	\N	40
42	9	au	5	1760	1461	4	0	f	ug_g	INAA	\N	41
43	10	cr	5	1760	64000	2	0	f	ug_g	INAA	\N	42
44	10	co	5	1760	4830000	3	0	f	mg_g	INAA	\N	43
45	10	ni	5	1760	92600000	3	0	f	mg_g	INAA	\N	44
46	10	cu	5	1760	267000	3	0	f	ug_g	INAA	\N	45
47	10	ga	5	1760	70100	3	0	f	ug_g	INAA	\N	46
48	10	ge	5	1760	226000	3	0	f	ug_g	INAA	\N	47
49	10	as	5	1760	15600	3	0	f	ug_g	INAA	\N	48
50	10	sb	5	1760	250	3	0	f	ng_g	INAA	\N	49
51	10	w	5	1760	880	3	0	f	ug_g	INAA	\N	50
52	10	re	5	1760	267	3	0	f	ng_g	INAA	\N	51
53	10	ir	5	1760	2880	3	0	f	ug_g	INAA	\N	52
54	10	pt	5	1760	6300	2	0	f	ug_g	INAA	\N	53
55	10	au	5	1760	1768	4	0	f	ug_g	INAA	\N	54
56	12	cr	5	1760	22000	2	0	f	ug_g	INAA	\N	68
57	12	co	5	1760	4970000	3	0	f	mg_g	INAA	\N	69
58	12	ni	5	1760	58100000	3	0	f	mg_g	INAA	\N	70
59	12	cu	5	1760	113000	3	0	f	ug_g	INAA	\N	71
60	12	ga	5	1760	55500	3	0	f	ug_g	INAA	\N	72
61	12	ge	5	1760	153000	3	0	f	ug_g	INAA	\N	73
62	12	as	5	1760	9910	3	0	f	ug_g	INAA	\N	74
63	12	sb	5	1760	200	3	0	t	ng_g	INAA	\N	75
64	12	w	5	1760	720	2	0	f	ug_g	INAA	\N	76
65	12	re	5	1760	40	2	0	t	ng_g	INAA	\N	77
66	12	ir	5	1760	21	3	0	f	ug_g	INAA	\N	78
67	12	pt	5	1760	5300	2	0	f	ug_g	INAA	\N	79
68	12	au	5	1760	1078	4	0	f	ug_g	INAA	\N	80
69	11	cr	5	1760	53000	2	0	f	ug_g	INAA	\N	55
70	11	co	5	1760	4760000	3	0	f	mg_g	INAA	\N	56
71	11	ni	5	1760	67500000	3	0	f	mg_g	INAA	\N	57
72	11	cu	5	1760	137000	3	0	f	ug_g	INAA	\N	58
73	11	ga	5	1760	52600	3	0	f	ug_g	INAA	\N	59
74	11	ge	5	1760	195000	3	0	f	ug_g	INAA	\N	60
75	11	as	5	1760	8280	3	0	f	ug_g	INAA	\N	61
76	11	sb	5	1760	150	3	0	t	ng_g	INAA	\N	62
77	11	w	5	1760	880	3	0	f	ug_g	INAA	\N	63
78	11	re	5	1760	20	2	0	f	ng_g	INAA	\N	64
79	11	ir	5	1760	127	3	0	f	ug_g	INAA	\N	65
80	11	pt	5	1760	5400	2	0	f	ug_g	INAA	\N	66
81	11	au	5	1760	971	3	0	f	ug_g	INAA	\N	67
82	13	cr	5	1760	31000	2	0	f	ug_g	INAA	\N	81
83	13	co	5	1760	5180000	3	0	f	mg_g	INAA	\N	82
84	13	ni	5	1760	85200000	3	0	f	mg_g	INAA	\N	83
85	13	cu	5	1760	144000	3	0	f	ug_g	INAA	\N	84
86	13	ga	5	1760	20800	3	0	f	ug_g	INAA	\N	85
87	13	ge	5	1760	43000	2	0	f	ug_g	INAA	\N	86
88	13	as	5	1760	8290	3	0	f	ug_g	INAA	\N	87
89	13	sb	5	1760	120	3	0	t	ng_g	INAA	\N	88
90	13	w	5	1760	750	2	0	f	ug_g	INAA	\N	89
91	13	re	5	1760	203	3	0	f	ng_g	INAA	\N	90
92	13	ir	5	1760	2500	3	0	f	ug_g	INAA	\N	91
93	13	pt	5	1760	8000	2	0	f	ug_g	INAA	\N	92
94	13	au	5	1760	1039	4	0	f	ug_g	INAA	\N	93
95	14	cr	6	595	21000	2	0	f	ug_g	INAA	\N	94
96	14	co	6	595	5600000	3	0	f	mg_g	INAA	\N	95
97	14	ni	6	595	118800000	4	0	f	mg_g	INAA	\N	96
98	14	cu	6	595	193000	3	0	f	ug_g	INAA	\N	97
99	14	ga	6	595	17400	3	0	f	ug_g	INAA	\N	98
100	14	ge	6	595	16000	2	0	f	ug_g	RNAA	\N	99
101	14	as	6	595	20600	3	0	f	ug_g	INAA	\N	100
102	14	sb	6	595	480	3	0	f	ng_g	INAA	\N	101
103	14	w	6	595	110	3	0	f	ng_g	INAA	\N	102
104	14	ir	6	595	160	2	0	f	ug_g	INAA	\N	103
105	14	pt	6	595	1200	2	0	t	ug_g	INAA	\N	104
106	14	au	6	595	1580	3	0	f	ug_g	INAA	\N	105
107	15	cr	6	595	19000	2	0	f	ug_g	INAA	\N	106
108	15	co	6	595	4880000	3	0	f	mg_g	INAA	\N	107
109	15	ni	6	595	80600000	3	0	f	mg_g	INAA	\N	108
110	15	cu	6	595	184000	3	0	f	ug_g	INAA	\N	109
111	15	ga	6	595	74800	3	0	f	ug_g	INAA	\N	110
112	15	ge	6	595	226000	2	0	f	ug_g	RNAA	\N	111
113	15	as	6	595	15700	3	0	f	ug_g	INAA	\N	112
114	15	sb	6	595	450	3	0	f	ng_g	INAA	\N	113
115	15	w	6	595	800	3	0	f	ng_g	INAA	\N	114
116	15	re	6	595	280	3	0	f	ng_g	INAA	\N	115
117	15	ir	6	595	2880	3	0	f	ug_g	INAA	\N	116
118	15	pt	6	595	6800	2	0	t	ug_g	INAA	\N	117
119	15	au	6	595	1750	3	0	f	ug_g	INAA	\N	118
120	16	cr	7	952	165000	3	0	f	ug_g	INAA	\N	119
121	16	co	7	952	3900000	3	0	f	mg_g	INAA	\N	120
122	16	ni	7	952	78300000	3	0	f	mg_g	INAA	\N	121
123	16	cu	7	952	160000	3	0	f	ug_g	INAA	\N	122
124	16	ga	7	952	2090	3	0	f	ug_g	INAA	\N	123
125	16	ge	7	952	119	3	0	f	ug_g	RNAA	\N	124
126	16	as	7	952	4230	3	0	f	ug_g	INAA	\N	125
127	16	w	7	952	690	2	0	f	ug_g	INAA	\N	126
128	16	re	7	952	277	3	0	f	ng_g	INAA	\N	127
129	16	ir	7	952	2460	3	0	f	ug_g	INAA	\N	128
130	16	pt	7	952	4900	2	0	f	ug_g	INAA	\N	129
131	16	au	7	952	983	3	0	f	ug_g	INAA	\N	130
132	17	cr	7	952	23000	2	0	f	ug_g	INAA	\N	131
133	17	co	7	952	4130000	3	0	f	mg_g	INAA	\N	132
134	17	ni	7	952	91800000	3	0	f	mg_g	INAA	\N	133
135	17	cu	7	952	116000	3	0	f	ug_g	INAA	\N	134
136	17	ga	7	952	2360	3	0	f	ug_g	INAA	\N	135
137	17	as	7	952	12100	3	0	f	ug_g	INAA	\N	136
138	17	w	7	952	430	2	0	f	ug_g	INAA	\N	137
139	17	re	7	952	117	3	0	f	ng_g	INAA	\N	138
140	17	ir	7	952	1110	3	0	f	ug_g	INAA	\N	139
141	17	pt	7	952	5000	2	0	f	ug_g	INAA	\N	140
142	17	au	7	952	2216	4	0	f	ug_g	INAA	\N	141
\.


--
-- Data for Name: element_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.element_review (review_id, element_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	2	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.598849	\N	\N
2	3	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.598849	\N	\N
\.


--
-- Data for Name: element_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.element_status (status_id, element_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
2	4	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
3	3	historical	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
4	5	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
5	6	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
6	7	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
7	8	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
8	9	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
9	10	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
10	11	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
11	12	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
12	13	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
13	14	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
14	15	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
15	16	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
16	17	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
17	18	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
18	19	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
19	20	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
20	21	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
21	22	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
22	23	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
23	24	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
24	25	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
25	26	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
26	27	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
27	28	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
28	29	active	Ken	\N	2019-04-07 21:32:49.573381	\N	\N
29	30	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
30	31	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
31	32	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
32	33	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
33	34	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
34	35	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
35	36	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
36	37	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
37	38	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
38	39	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
39	40	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
40	41	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
41	42	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
42	43	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
43	44	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
44	45	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
45	46	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
46	47	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
47	48	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
48	49	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
49	50	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
50	51	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
51	52	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
52	53	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
53	54	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
54	55	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
55	69	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
56	70	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
57	71	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
58	72	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
59	73	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
60	74	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
61	75	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
62	76	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
63	77	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
64	78	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
65	79	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
66	80	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
67	81	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
68	56	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
69	57	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
70	58	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
71	59	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
72	60	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
73	61	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
74	62	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
75	63	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
76	64	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
77	65	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
78	66	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
79	67	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
80	68	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
81	82	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
82	83	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
83	84	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
84	85	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
85	86	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
86	87	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
87	88	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
88	89	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
89	90	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
90	91	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
91	92	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
92	93	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
93	94	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
94	95	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
95	96	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
96	97	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
97	98	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
98	99	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
99	100	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
100	101	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
101	102	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
102	103	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
103	104	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
104	105	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
105	106	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
106	107	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
107	108	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
108	109	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
109	110	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
110	111	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
111	112	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
112	113	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
113	114	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
114	115	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
115	116	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
116	117	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
117	118	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
118	119	active	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
119	120	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
120	121	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
121	122	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
122	123	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
123	124	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
124	125	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
125	126	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
126	127	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
127	128	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
128	129	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
129	130	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
130	131	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
131	132	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
132	133	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
133	134	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
134	135	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
135	136	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
136	137	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
137	138	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
138	139	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
139	140	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
140	141	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
141	142	pending	Michael	\N	2019-04-07 21:32:49.573381	\N	\N
142	143	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
143	144	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
144	145	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
145	146	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: element_symbols; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.element_symbols (symbol_id, symbol) FROM stdin;
1	H
2	He
3	Li
4	Be
5	B
6	C
7	N
8	O
9	F
10	Ne
11	Na
12	Mg
13	Al
14	Si
15	P
16	S
17	Cl
18	Ar
19	K
20	Ca
21	Sc
22	Ti
23	V
24	Cr
25	Mn
26	Fe
27	Co
28	Ni
29	Cu
30	Zn
31	Ga
32	Ge
33	As
34	Se
35	Br
36	Kr
37	Rb
38	Sr
39	Y
40	Zr
41	Nb
42	Mo
43	Tc
44	Ru
45	Rh
46	Pd
47	Ag
48	Cd
49	In
50	Sn
51	Sb
52	Te
53	I
54	Xe
55	Cs
56	Ba
57	La
58	Ce
59	Pr
60	Nd
61	Pm
62	Sm
63	Eu
64	Gd
65	Tb
66	Dy
67	Ho
68	Er
69	Tm
70	Yb
71	Lu
72	Hf
73	Ta
74	W
75	Re
76	Os
77	Ir
78	Pt
79	Au
80	Hg
81	Tl
82	Pb
83	Bi
84	Po
85	At
86	Rn
87	Fr
88	Ra
89	Ac
90	Th
91	Pa
92	U
93	Np
94	Pu
95	Am
96	Cm
97	Bk
98	Cf
99	Es
100	Fm
101	Md
102	No
103	Lr
104	Rf
105	Db
106	Sg
107	Bh
108	Hs
109	Mt
110	Ds
111	Rg
112	Cn
113	Nh
114	Fl
115	Mc
116	Lv
117	Ts
118	Og
\.


--
-- Data for Name: entry_store; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.entry_store (entry_id, username, savedata, pdf_path, pending, last_saved_date) FROM stdin;
\.


--
-- Data for Name: group_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.group_review (review_id, group_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	2	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.5348	\N	\N
2	17	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.5348	\N	\N
\.


--
-- Data for Name: group_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.group_status (status_id, group_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.531254	\N	\N
2	3	active	Troy	\N	2019-04-07 21:32:49.531254	\N	\N
3	4	active	Troy	\N	2019-04-07 21:32:49.531254	\N	\N
4	5	active	Troy	\N	2019-04-07 21:32:49.531254	\N	\N
5	6	active	Troy	\N	2019-04-07 21:32:49.531254	\N	\N
6	7	active	Troy	\N	2019-04-07 21:32:49.531254	\N	\N
7	8	active	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
8	10	active	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
9	9	active	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
10	11	active	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
11	12	active	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
12	13	active	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
13	14	active	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
14	15	pending	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
15	16	pending	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
16	17	historical	Michael	\N	2019-04-07 21:32:49.531254	\N	\N
17	18	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
18	19	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.groups (group_id, body_id, the_group, status_id) FROM stdin;
1	1	Dummy	1
2	2	Fake	\N
3	3	IIG	2
4	4	IIG	3
5	5	IIG	4
6	6	IIG	5
7	7	IIG	6
8	9	IAB	7
9	11	IC	9
10	10	IAB	8
11	12	IIAB	10
12	13	IIIAB	11
13	14	IIICD	12
14	15	IAB	13
15	16	IVA	14
16	17	IVA	15
17	8	Historical	16
18	18	IIG	17
19	19	IIG	18
\.


--
-- Data for Name: journal_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.journal_review (review_id, journal_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	2	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.549923	\N	\N
2	7	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.549923	\N	\N
\.


--
-- Data for Name: journal_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.journal_status (status_id, journal_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.547405	\N	\N
2	3	active	Ken	\N	2019-04-07 21:32:49.547405	\N	\N
3	4	active	Michael	\N	2019-04-07 21:32:49.547405	\N	\N
4	5	active	Michael	\N	2019-04-07 21:32:49.547405	\N	\N
5	6	pending	Michael	\N	2019-04-07 21:32:49.547405	\N	\N
6	7	historical	Michael	\N	2019-04-07 21:32:49.547405	\N	\N
7	8	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: journals; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.journals (journal_id, journal_name, volume, issue, series, published_year, status_id) FROM stdin;
1	Dummy	1	1	\N	1900	1
2	Fake	420	69	\N	2000	\N
3	Geochimica et Cosmochimica Acta	73	16	\N	2009	2
4	Geochimica et Cosmochimica Acta	75	7	\N	2011	3
5	Geochimica et Cosmochimica Acta	59	3	\N	1995	4
6	Geochimica et Cosmochimica Acta	65	6	\N	2001	5
7	Fake Historical Paper	1	1	\N	2019	6
8	Super Science Quarterly	11			2003	7
\.


--
-- Data for Name: note_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.note_review (review_id, note_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
\.


--
-- Data for Name: note_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.note_status (status_id, note_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.notes (note_id, paper_id, note, status_id) FROM stdin;
1	8	This is just a super note	1
\.


--
-- Data for Name: paper_review; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.paper_review (review_id, paper_id, note, resolved, email_address, reviewed_by, submission_date, resolution_date, action_taken) FROM stdin;
1	2	not correct	f	fake@gmail.com	1	2019-04-07 21:32:49.55476	\N	\N
2	4	Inactive entry	f	fake@yahoo.com	1	2019-04-07 21:32:49.55476	\N	\N
\.


--
-- Data for Name: paper_status; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.paper_status (status_id, paper_id, current_status, submitted_by, reviewed_by, submission_date, reviewed_date, submission_id) FROM stdin;
1	1	pending	Ken	\N	2019-04-07 21:32:49.552285	\N	\N
2	3	active	Ken	\N	2019-04-07 21:32:49.552285	\N	\N
3	5	active	Michael	\N	2019-04-07 21:32:49.552285	\N	\N
4	6	active	Michael	\N	2019-04-07 21:32:49.552285	\N	\N
5	7	pending	Michael	\N	2019-04-07 21:32:49.552285	\N	\N
6	4	historical	Michael	\N	2019-04-07 21:32:49.552285	\N	\N
7	8	pending	user2	\N	2019-04-07 21:39:00.503943	\N	1
\.


--
-- Data for Name: papers; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.papers (paper_id, journal_id, title, doi, status_id) FROM stdin;
1	1	Dummy	\N	1
2	2	Fake	\N	\N
3	3	The IIG iron meteorites: Probable formation in the IIAB core	\N	2
4	7	Fake Historical Paper	\N	6
5	4	Relationship between iron-meteorite composition and size: Compositional distribution of irons from North Africa	\N	3
6	5	Classification and origin of IAB and IIICD iron meteorites	\N	4
7	6	Fractionation trends among IVA iron meteorites: Contrasts with IIIAB trends	\N	5
8	8	Science Stuff		7
\.


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.submissions (submission_id, pdf_path, pending, username) FROM stdin;
1	null	t	user2
\.


--
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.user_info (user_id, first_name, last_name, email_address) FROM stdin;
1	Dummy	Data	email@email.email
4	Alice	Apache	alice@email.email
3	Bob	Bandit	bob@email.email
2	Candy	Comanche	candy@email.email
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.users (user_id, username, password_hash, role_of) FROM stdin;
1	dummy	digest	user
4	user1	$2b$10$iiUXFCgfrIH/UHDo/pvDnOKeW6dTuz9iuo/EpKKBsIK8.yLl1SQXK	admin
3	user2	$2b$10$HGKtbUvhRs4j.ooZNH0rWOQYxaQYamuS5fKZicqEBghXuihTIi.1S	data-entry
2	user3	$2b$10$EitMyEsJ3/Q0CCM0932jy..IpOYREQsNvFy2qiDjQ6wxn3o0I5fVS	user
\.


--
-- Name: analysis_techniques_technique_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.analysis_techniques_technique_id_seq', 2, true);


--
-- Name: attribution_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.attribution_review_review_id_seq', 2, true);


--
-- Name: attribution_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.attribution_status_status_id_seq', 11, true);


--
-- Name: attributions_attribution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.attributions_attribution_id_seq', 12, true);


--
-- Name: author_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.author_review_review_id_seq', 2, true);


--
-- Name: author_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.author_status_status_id_seq', 8, true);


--
-- Name: authors_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.authors_author_id_seq', 9, true);


--
-- Name: bodies_body_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.bodies_body_id_seq', 19, true);


--
-- Name: body_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.body_review_review_id_seq', 2, true);


--
-- Name: body_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.body_status_status_id_seq', 18, true);


--
-- Name: classification_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.classification_review_review_id_seq', 2, true);


--
-- Name: classification_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.classification_status_status_id_seq', 4, true);


--
-- Name: classifications_classification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.classifications_classification_id_seq', 5, true);


--
-- Name: data_entry_role_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.data_entry_role_requests_request_id_seq', 1, false);


--
-- Name: element_entries_element_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.element_entries_element_id_seq', 146, true);


--
-- Name: element_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.element_review_review_id_seq', 2, true);


--
-- Name: element_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.element_status_status_id_seq', 145, true);


--
-- Name: element_symbols_symbol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.element_symbols_symbol_id_seq', 118, true);


--
-- Name: entry_store_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.entry_store_entry_id_seq', 1, false);


--
-- Name: group_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.group_review_review_id_seq', 2, true);


--
-- Name: group_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.group_status_status_id_seq', 18, true);


--
-- Name: groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.groups_group_id_seq', 19, true);


--
-- Name: journal_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.journal_review_review_id_seq', 2, true);


--
-- Name: journal_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.journal_status_status_id_seq', 7, true);


--
-- Name: journals_journal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.journals_journal_id_seq', 8, true);


--
-- Name: note_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.note_review_review_id_seq', 1, false);


--
-- Name: note_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.note_status_status_id_seq', 1, true);


--
-- Name: notes_note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.notes_note_id_seq', 1, true);


--
-- Name: paper_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.paper_review_review_id_seq', 2, true);


--
-- Name: paper_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.paper_status_status_id_seq', 7, true);


--
-- Name: papers_paper_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.papers_paper_id_seq', 8, true);


--
-- Name: submissions_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.submissions_submission_id_seq', 1, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- Name: analysis_techniques analysis_techniques_abbreviation_key; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.analysis_techniques
    ADD CONSTRAINT analysis_techniques_abbreviation_key UNIQUE (abbreviation);


--
-- Name: analysis_techniques analysis_techniques_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.analysis_techniques
    ADD CONSTRAINT analysis_techniques_pkey PRIMARY KEY (technique_id);


--
-- Name: attribution_review attribution_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_review
    ADD CONSTRAINT attribution_review_pkey PRIMARY KEY (review_id);


--
-- Name: attribution_status attribution_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_status
    ADD CONSTRAINT attribution_status_pkey PRIMARY KEY (status_id);


--
-- Name: attributions attributions_attribution_id_key; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attributions
    ADD CONSTRAINT attributions_attribution_id_key UNIQUE (attribution_id);


--
-- Name: attributions attributions_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attributions
    ADD CONSTRAINT attributions_pkey PRIMARY KEY (paper_id, author_id);


--
-- Name: author_review author_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_review
    ADD CONSTRAINT author_review_pkey PRIMARY KEY (review_id);


--
-- Name: author_status author_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_status
    ADD CONSTRAINT author_status_pkey PRIMARY KEY (status_id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (author_id);


--
-- Name: bodies bodies_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.bodies
    ADD CONSTRAINT bodies_pkey PRIMARY KEY (body_id);


--
-- Name: body_review body_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_review
    ADD CONSTRAINT body_review_pkey PRIMARY KEY (review_id);


--
-- Name: body_status body_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_status
    ADD CONSTRAINT body_status_pkey PRIMARY KEY (status_id);


--
-- Name: classification_review classification_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_review
    ADD CONSTRAINT classification_review_pkey PRIMARY KEY (review_id);


--
-- Name: classification_status classification_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_status
    ADD CONSTRAINT classification_status_pkey PRIMARY KEY (status_id);


--
-- Name: classifications classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classifications
    ADD CONSTRAINT classifications_pkey PRIMARY KEY (classification_id);


--
-- Name: data_entry_role_requests data_entry_role_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.data_entry_role_requests
    ADD CONSTRAINT data_entry_role_requests_pkey PRIMARY KEY (request_id);


--
-- Name: element_entries element_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_entries
    ADD CONSTRAINT element_entries_pkey PRIMARY KEY (element_id);


--
-- Name: element_review element_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_review
    ADD CONSTRAINT element_review_pkey PRIMARY KEY (review_id);


--
-- Name: element_status element_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_status
    ADD CONSTRAINT element_status_pkey PRIMARY KEY (status_id);


--
-- Name: element_symbols element_symbols_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_symbols
    ADD CONSTRAINT element_symbols_pkey PRIMARY KEY (symbol_id);


--
-- Name: element_symbols element_symbols_symbol_key; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_symbols
    ADD CONSTRAINT element_symbols_symbol_key UNIQUE (symbol);


--
-- Name: entry_store entry_store_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.entry_store
    ADD CONSTRAINT entry_store_pkey PRIMARY KEY (entry_id);


--
-- Name: group_review group_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_review
    ADD CONSTRAINT group_review_pkey PRIMARY KEY (review_id);


--
-- Name: group_status group_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_status
    ADD CONSTRAINT group_status_pkey PRIMARY KEY (status_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);


--
-- Name: journal_review journal_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_review
    ADD CONSTRAINT journal_review_pkey PRIMARY KEY (review_id);


--
-- Name: journal_status journal_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_status
    ADD CONSTRAINT journal_status_pkey PRIMARY KEY (status_id);


--
-- Name: journals journals_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journals_pkey PRIMARY KEY (journal_id);


--
-- Name: note_review note_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_review
    ADD CONSTRAINT note_review_pkey PRIMARY KEY (review_id);


--
-- Name: note_status note_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_status
    ADD CONSTRAINT note_status_pkey PRIMARY KEY (status_id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (note_id);


--
-- Name: paper_review paper_review_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_review
    ADD CONSTRAINT paper_review_pkey PRIMARY KEY (review_id);


--
-- Name: paper_status paper_status_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_status
    ADD CONSTRAINT paper_status_pkey PRIMARY KEY (status_id);


--
-- Name: papers papers_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.papers
    ADD CONSTRAINT papers_pkey PRIMARY KEY (paper_id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (submission_id);


--
-- Name: user_info user_info_email_address_key; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_email_address_key UNIQUE (email_address);


--
-- Name: user_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: attribution_review attribution_review_attribution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_review
    ADD CONSTRAINT attribution_review_attribution_id_fkey FOREIGN KEY (attribution_id) REFERENCES public.attributions(attribution_id);


--
-- Name: attribution_review attribution_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_review
    ADD CONSTRAINT attribution_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: attribution_status attribution_status_attribution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_status
    ADD CONSTRAINT attribution_status_attribution_id_fkey FOREIGN KEY (attribution_id) REFERENCES public.attributions(attribution_id);


--
-- Name: attribution_status attribution_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_status
    ADD CONSTRAINT attribution_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: attribution_status attribution_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attribution_status
    ADD CONSTRAINT attribution_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: author_review author_review_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_review
    ADD CONSTRAINT author_review_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(author_id);


--
-- Name: author_review author_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_review
    ADD CONSTRAINT author_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: author_status author_status_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_status
    ADD CONSTRAINT author_status_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(author_id);


--
-- Name: author_status author_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_status
    ADD CONSTRAINT author_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: author_status author_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.author_status
    ADD CONSTRAINT author_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: body_review body_review_body_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_review
    ADD CONSTRAINT body_review_body_id_fkey FOREIGN KEY (body_id) REFERENCES public.bodies(body_id);


--
-- Name: body_review body_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_review
    ADD CONSTRAINT body_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: body_status body_status_body_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_status
    ADD CONSTRAINT body_status_body_id_fkey FOREIGN KEY (body_id) REFERENCES public.bodies(body_id);


--
-- Name: body_status body_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_status
    ADD CONSTRAINT body_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: body_status body_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.body_status
    ADD CONSTRAINT body_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: classification_review classification_review_classification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_review
    ADD CONSTRAINT classification_review_classification_id_fkey FOREIGN KEY (classification_id) REFERENCES public.classifications(classification_id);


--
-- Name: classification_review classification_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_review
    ADD CONSTRAINT classification_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: classification_status classification_status_classification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_status
    ADD CONSTRAINT classification_status_classification_id_fkey FOREIGN KEY (classification_id) REFERENCES public.classifications(classification_id);


--
-- Name: classification_status classification_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_status
    ADD CONSTRAINT classification_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: classification_status classification_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classification_status
    ADD CONSTRAINT classification_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: data_entry_role_requests data_entry_role_requests_requesting_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.data_entry_role_requests
    ADD CONSTRAINT data_entry_role_requests_requesting_user_fkey FOREIGN KEY (requesting_user) REFERENCES public.users(username);


--
-- Name: element_review element_review_element_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_review
    ADD CONSTRAINT element_review_element_id_fkey FOREIGN KEY (element_id) REFERENCES public.element_entries(element_id);


--
-- Name: element_review element_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_review
    ADD CONSTRAINT element_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: element_status element_status_element_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_status
    ADD CONSTRAINT element_status_element_id_fkey FOREIGN KEY (element_id) REFERENCES public.element_entries(element_id);


--
-- Name: element_status element_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_status
    ADD CONSTRAINT element_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: element_status element_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_status
    ADD CONSTRAINT element_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: entry_store entry_store_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.entry_store
    ADD CONSTRAINT entry_store_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- Name: attributions fk_attribution_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attributions
    ADD CONSTRAINT fk_attribution_status FOREIGN KEY (status_id) REFERENCES public.attribution_status(status_id);


--
-- Name: attributions fk_author_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attributions
    ADD CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES public.authors(author_id);


--
-- Name: authors fk_author_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT fk_author_status FOREIGN KEY (status_id) REFERENCES public.author_status(status_id);


--
-- Name: groups fk_body_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT fk_body_id FOREIGN KEY (body_id) REFERENCES public.bodies(body_id);


--
-- Name: classifications fk_body_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classifications
    ADD CONSTRAINT fk_body_id FOREIGN KEY (body_id) REFERENCES public.bodies(body_id);


--
-- Name: element_entries fk_body_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_entries
    ADD CONSTRAINT fk_body_id FOREIGN KEY (body_id) REFERENCES public.bodies(body_id);


--
-- Name: bodies fk_body_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.bodies
    ADD CONSTRAINT fk_body_status FOREIGN KEY (status_id) REFERENCES public.body_status(status_id);


--
-- Name: classifications fk_classification_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.classifications
    ADD CONSTRAINT fk_classification_status FOREIGN KEY (status_id) REFERENCES public.classification_status(status_id);


--
-- Name: element_entries fk_element_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_entries
    ADD CONSTRAINT fk_element_status FOREIGN KEY (status_id) REFERENCES public.element_status(status_id);


--
-- Name: groups fk_group_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT fk_group_status FOREIGN KEY (status_id) REFERENCES public.group_status(status_id);


--
-- Name: papers fk_journal_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.papers
    ADD CONSTRAINT fk_journal_id FOREIGN KEY (journal_id) REFERENCES public.journals(journal_id);


--
-- Name: journals fk_journal_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT fk_journal_status FOREIGN KEY (status_id) REFERENCES public.journal_status(status_id);


--
-- Name: notes fk_note_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_note_status FOREIGN KEY (status_id) REFERENCES public.note_status(status_id);


--
-- Name: attributions fk_paper_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.attributions
    ADD CONSTRAINT fk_paper_id FOREIGN KEY (paper_id) REFERENCES public.papers(paper_id);


--
-- Name: element_entries fk_paper_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.element_entries
    ADD CONSTRAINT fk_paper_id FOREIGN KEY (paper_id) REFERENCES public.papers(paper_id);


--
-- Name: notes fk_paper_id; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_paper_id FOREIGN KEY (paper_id) REFERENCES public.papers(paper_id);


--
-- Name: papers fk_paper_status; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.papers
    ADD CONSTRAINT fk_paper_status FOREIGN KEY (status_id) REFERENCES public.paper_status(status_id);


--
-- Name: user_info fk_users; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: group_review group_review_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_review
    ADD CONSTRAINT group_review_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id);


--
-- Name: group_review group_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_review
    ADD CONSTRAINT group_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: group_status group_status_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_status
    ADD CONSTRAINT group_status_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id);


--
-- Name: group_status group_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_status
    ADD CONSTRAINT group_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: group_status group_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.group_status
    ADD CONSTRAINT group_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: journal_review journal_review_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_review
    ADD CONSTRAINT journal_review_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.journals(journal_id);


--
-- Name: journal_review journal_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_review
    ADD CONSTRAINT journal_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: journal_status journal_status_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_status
    ADD CONSTRAINT journal_status_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.journals(journal_id);


--
-- Name: journal_status journal_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_status
    ADD CONSTRAINT journal_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: journal_status journal_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.journal_status
    ADD CONSTRAINT journal_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: note_review note_review_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_review
    ADD CONSTRAINT note_review_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(note_id);


--
-- Name: note_review note_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_review
    ADD CONSTRAINT note_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: note_status note_status_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_status
    ADD CONSTRAINT note_status_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(note_id);


--
-- Name: note_status note_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_status
    ADD CONSTRAINT note_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: note_status note_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.note_status
    ADD CONSTRAINT note_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: paper_review paper_review_paper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_review
    ADD CONSTRAINT paper_review_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES public.papers(paper_id);


--
-- Name: paper_review paper_review_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_review
    ADD CONSTRAINT paper_review_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: paper_status paper_status_paper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_status
    ADD CONSTRAINT paper_status_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES public.papers(paper_id);


--
-- Name: paper_status paper_status_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_status
    ADD CONSTRAINT paper_status_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: paper_status paper_status_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.paper_status
    ADD CONSTRAINT paper_status_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(submission_id);


--
-- Name: submissions submissions_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- PostgreSQL database dump complete
--

