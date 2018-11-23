--
-- PostgreSQL database dump
-- This is just an example for iron.sh testing

-- Dumped from database version 11.0
-- Dumped by pg_dump version 11.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.trace DROP CONSTRAINT trace_entry_id_fkey;
ALTER TABLE ONLY public.minor DROP CONSTRAINT minor_entry_id_fkey;
ALTER TABLE ONLY public.measurementtech DROP CONSTRAINT measurementtech_entry_id_fkey;
ALTER TABLE ONLY public.major DROP CONSTRAINT major_entry_id_fkey;
ALTER TABLE ONLY public.authors DROP CONSTRAINT authors_source_id_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.trace DROP CONSTRAINT trace_pkey;
ALTER TABLE ONLY public.sources DROP CONSTRAINT sources_pkey;
ALTER TABLE ONLY public.minor DROP CONSTRAINT minor_pkey;
ALTER TABLE ONLY public.major DROP CONSTRAINT major_pkey;
ALTER TABLE ONLY public.entries DROP CONSTRAINT entries_pkey;
ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE public.sources ALTER COLUMN source_id DROP DEFAULT;
ALTER TABLE public.entries ALTER COLUMN entry_id DROP DEFAULT;
DROP SEQUENCE public.users_user_id_seq;
DROP TABLE public.users;
DROP TABLE public.trace;
DROP SEQUENCE public.sources_source_id_seq;
DROP TABLE public.sources;
DROP TABLE public.minor;
DROP TABLE public.measurementtech;
DROP TABLE public.major;
DROP SEQUENCE public.entries_entry_id_seq;
DROP TABLE public.entries;
DROP TABLE public.authors;
SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.authors (
    source_id integer,
    author text NOT NULL
);


ALTER TABLE public.authors OWNER TO group16;

--
-- Name: entries; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.entries (
    entry_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.entries OWNER TO group16;

--
-- Name: entries_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.entries_entry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.entries_entry_id_seq OWNER TO group16;

--
-- Name: entries_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.entries_entry_id_seq OWNED BY public.entries.entry_id;


--
-- Name: major; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.major (
    entry_id integer NOT NULL,
    element character varying(10) NOT NULL,
    measure integer NOT NULL
);


ALTER TABLE public.major OWNER TO group16;

--
-- Name: measurementtech; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.measurementtech (
    entry_id integer NOT NULL,
    tech text NOT NULL
);


ALTER TABLE public.measurementtech OWNER TO group16;

--
-- Name: minor; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.minor (
    entry_id integer NOT NULL,
    element character varying(10) NOT NULL,
    measure integer NOT NULL
);


ALTER TABLE public.minor OWNER TO group16;

--
-- Name: sources; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.sources (
    source_id integer NOT NULL,
    title text NOT NULL,
    source text NOT NULL,
    published_date date NOT NULL
);


ALTER TABLE public.sources OWNER TO group16;

--
-- Name: sources_source_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.sources_source_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sources_source_id_seq OWNER TO group16;

--
-- Name: sources_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: group16
--

ALTER SEQUENCE public.sources_source_id_seq OWNED BY public.sources.source_id;


--
-- Name: trace; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.trace (
    entry_id integer NOT NULL,
    element character varying(10) NOT NULL,
    measure integer NOT NULL
);


ALTER TABLE public.trace OWNER TO group16;

--
-- Name: users; Type: TABLE; Schema: public; Owner: group16
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying(25),
    password character varying(255),
    role character varying(10),
    CONSTRAINT users_role_check CHECK ((((role)::text ~~ 'admin'::text) OR ((role)::text ~~ 'data-entry'::text)))
);


ALTER TABLE public.users OWNER TO group16;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: group16
--

CREATE SEQUENCE public.users_user_id_seq
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
-- Name: entries entry_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.entries ALTER COLUMN entry_id SET DEFAULT nextval('public.entries_entry_id_seq'::regclass);


--
-- Name: sources source_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.sources ALTER COLUMN source_id SET DEFAULT nextval('public.sources_source_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.authors (source_id, author) FROM stdin;
\.


--
-- Data for Name: entries; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.entries (entry_id, name) FROM stdin;
\.


--
-- Data for Name: major; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.major (entry_id, element, measure) FROM stdin;
\.


--
-- Data for Name: measurementtech; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.measurementtech (entry_id, tech) FROM stdin;
\.


--
-- Data for Name: minor; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.minor (entry_id, element, measure) FROM stdin;
\.


--
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.sources (source_id, title, source, published_date) FROM stdin;
\.


--
-- Data for Name: trace; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.trace (entry_id, element, measure) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: group16
--

COPY public.users (user_id, username, password, role) FROM stdin;
\.


--
-- Name: entries_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.entries_entry_id_seq', 1, false);


--
-- Name: sources_source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.sources_source_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: group16
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- Name: entries entries_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.entries
    ADD CONSTRAINT entries_pkey PRIMARY KEY (entry_id);


--
-- Name: major major_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.major
    ADD CONSTRAINT major_pkey PRIMARY KEY (entry_id, element);


--
-- Name: minor minor_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.minor
    ADD CONSTRAINT minor_pkey PRIMARY KEY (entry_id, element);


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (source_id);


--
-- Name: trace trace_pkey; Type: CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.trace
    ADD CONSTRAINT trace_pkey PRIMARY KEY (entry_id, element);


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
-- Name: authors authors_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(source_id);


--
-- Name: major major_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.major
    ADD CONSTRAINT major_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.entries(entry_id);


--
-- Name: measurementtech measurementtech_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.measurementtech
    ADD CONSTRAINT measurementtech_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.entries(entry_id);


--
-- Name: minor minor_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.minor
    ADD CONSTRAINT minor_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.entries(entry_id);


--
-- Name: trace trace_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: group16
--

ALTER TABLE ONLY public.trace
    ADD CONSTRAINT trace_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.entries(entry_id);


--
-- PostgreSQL database dump complete
--

