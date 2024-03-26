CREATE EXTENSION IF NOT EXISTS pgcrypto;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

COMMENT ON SCHEMA public IS 'standard public schema';

CREATE FUNCTION public.delete_raw_data(raw_data_id bigint) RETURNS void
    LANGUAGE sql
    AS $$ 
delete from tbl_user_tbl_raw_data where tbl_user_tbl_raw_data.rawdataids_id = raw_data_id;
delete from tbl_raw_data where tbl_raw_data.id = raw_data_id

$$;


ALTER FUNCTION public.delete_raw_data(raw_data_id bigint) OWNER TO root;

CREATE FUNCTION public.get_by_id_tbl_predict_data(predict_data_id bigint, sym_key character varying) RETURNS TABLE(id bigint, data bytea, datetime timestamp without time zone, predictiontype character varying)
    LANGUAGE sql
    AS $$ 
select id, pgp_sym_decrypt_bytea(data::bytea, sym_key) as data, datetime, predictiontype from tbl_predicted_data
	where id = predict_data_id
$$;


ALTER FUNCTION public.get_by_id_tbl_predict_data(predict_data_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.get_by_id_tbl_processed_data(processed_data_id bigint, sym_key character varying) RETURNS TABLE(id bigint, data bytea, datetime timestamp without time zone)
    LANGUAGE sql
    AS $$ 
select id, pgp_sym_decrypt_bytea(data::bytea, sym_key) as data, datetime from tbl_processed_data
	where id = processed_data_id
$$;


ALTER FUNCTION public.get_by_id_tbl_processed_data(processed_data_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.get_by_id_tbl_raw_data(raw_data_id bigint, sym_key character varying) RETURNS TABLE(id bigint, data bytea, processed_data_id bigint, type character varying, datetime timestamp without time zone, year character varying)
    LANGUAGE sql
    AS $$ 
select id, pgp_sym_decrypt_bytea(data::bytea, sym_key) as data, processed_data_id, type, datetime, year from tbl_raw_data 
	where id = raw_data_id
$$;


ALTER FUNCTION public.get_by_id_tbl_raw_data(raw_data_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.get_incorrect_logins_by_user_id(in_user_id bigint) RETURNS TABLE(id bigint, incorrectattempts integer, locked boolean, user_id bigint, lockeddate timestamp without time zone)
    LANGUAGE sql
    AS $$ 
select id, incorrectattempts , locked, user_id, lockeddate from tbl_incorrect_logins
	where user_id = in_user_id
$$;


ALTER FUNCTION public.get_incorrect_logins_by_user_id(in_user_id bigint) OWNER TO root;

CREATE FUNCTION public.get_predicted_data_id(processed_data_id bigint, in_predictiontype character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
select coalesce(
(select tbl_processed_data_tbl_predicted_data.predicteddataids_id from tbl_processed_data, tbl_processed_data_tbl_predicted_data, tbl_predicted_data
	where tbl_processed_data.id = processed_data_id and
		  tbl_processed_data.id = tbl_processed_data_tbl_predicted_data.tbl_processed_data_id and 
		  tbl_processed_data_tbl_predicted_data.predicteddataids_id = tbl_predicted_data.id and
		  tbl_predicted_data.predictiontype = in_predictiontype
	)
	, -1)
$$;


ALTER FUNCTION public.get_predicted_data_id(processed_data_id bigint, in_predictiontype character varying) OWNER TO root;

CREATE FUNCTION public.get_process_data_id(raw_data_id bigint) RETURNS bigint
    LANGUAGE sql
    AS $$
select coalesce((select tbl_raw_data.processed_data_id from tbl_raw_data 
	where tbl_raw_data.id = raw_data_id) , -1)
$$;


ALTER FUNCTION public.get_process_data_id(raw_data_id bigint) OWNER TO root;

CREATE FUNCTION public.increment(i integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
        BEGIN
                RETURN i + 1;
        END;
$$;


ALTER FUNCTION public.increment(i integer) OWNER TO root;


CREATE FUNCTION public.list_predicted_data(user_id bigint, in_type character varying) RETURNS TABLE(id bigint, datetime timestamp without time zone, predictiontype character varying, year character varying)
    LANGUAGE sql
    AS $$
select tbl_predicted_data.id, tbl_predicted_data.datetime, tbl_predicted_data.predictiontype, tbl_raw_data.year
from tbl_predicted_data, tbl_processed_data_tbl_predicted_data, tbl_processed_data, tbl_raw_data, tbl_user_tbl_raw_data
	where tbl_user_tbl_raw_data.tbl_user_id = user_id and 
		  tbl_user_tbl_raw_data.rawdataids_id = tbl_raw_data.id and 
		  tbl_raw_data."type" = in_type and
		  tbl_raw_data.processed_data_id = tbl_processed_data.id and 
		  tbl_processed_data.id = tbl_processed_data_tbl_predicted_data.tbl_processed_data_id and 
		  tbl_processed_data_tbl_predicted_data.predicteddataids_id = tbl_predicted_data.id 
$$;


ALTER FUNCTION public.list_predicted_data(user_id bigint, in_type character varying) OWNER TO root;


CREATE FUNCTION public.list_processed_data(user_id bigint, in_type character varying) RETURNS TABLE(id bigint, datetime timestamp without time zone, predicted_data_id bigint, prediction_type character varying, year character varying)
    LANGUAGE sql
    AS $$
select tbl_processed_data.id, tbl_processed_data.datetime,
	coalesce(tbl_processed_data_tbl_predicted_data.predicteddataids_id, -1) as predicted_data_id,
	coalesce(tbl_predicted_data.predictiontype, '') as prediction_type,
	tbl_raw_data.year
 from tbl_user_tbl_raw_data 
 	join tbl_raw_data on tbl_user_tbl_raw_data.rawdataids_id = tbl_raw_data.id
 	join tbl_processed_data on tbl_raw_data.processed_data_id = tbl_processed_data.id
 	left join tbl_processed_data_tbl_predicted_data on tbl_processed_data.id = tbl_processed_data_tbl_predicted_data.tbl_processed_data_id
 	left join tbl_predicted_data on tbl_predicted_data.id = tbl_processed_data_tbl_predicted_data.predicteddataids_id
 where 	tbl_user_tbl_raw_data.tbl_user_id = user_id and tbl_raw_data."type" = in_type
$$;


ALTER FUNCTION public.list_processed_data(user_id bigint, in_type character varying) OWNER TO root;


CREATE FUNCTION public.list_raw_data(user_id bigint, in_type character varying) RETURNS TABLE(id bigint, datetime timestamp without time zone, year character varying, processed_data_id bigint)
    LANGUAGE sql
    AS $$
select tbl_raw_data.id, tbl_raw_data.datetime, tbl_raw_data.year, tbl_raw_data.processed_data_id from tbl_raw_data, tbl_user_tbl_raw_data
	where tbl_user_tbl_raw_data.tbl_user_id = user_id and 
		  tbl_user_tbl_raw_data.rawdataids_id = tbl_raw_data.id and 
		  tbl_raw_data."type" = in_type
$$;


ALTER FUNCTION public.list_raw_data(user_id bigint, in_type character varying) OWNER TO root;


CREATE FUNCTION public.login_user(in_username character varying, in_password character varying) RETURNS TABLE(id bigint, first_name character varying, last_name character varying, username character varying, password character varying)
    LANGUAGE sql
    AS $$ 
select id, first_name, last_name, username, password from tbl_user
	where username = in_username and password = crypt(in_password, password)
$$;


ALTER FUNCTION public.login_user(in_username character varying, in_password character varying) OWNER TO root;

CREATE FUNCTION public.query_by_id_tbl_test_crypto(id bigint, sym_key character varying) RETURNS TABLE(id bigint, firstname character varying, lastname character varying, creditcardnumber character varying)
    LANGUAGE sql
    AS $$ 
select id, firstname, lastname, pgp_sym_decrypt(creditcardnumber::bytea, sym_key) as creditcardnumber from tbl_test_crypto 
where id = id
$$;


ALTER FUNCTION public.query_by_id_tbl_test_crypto(id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.query_tbl_test_crypto(sym_key character varying) RETURNS TABLE(id bigint, firstname character varying, lastname character varying, creditcardnumber character varying)
    LANGUAGE sql
    AS $$ 
select id, firstname, lastname, pgp_sym_decrypt(creditcardnumber::bytea, sym_key) as creditcardnumber from tbl_test_crypto
$$;


ALTER FUNCTION public.query_tbl_test_crypto(sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_predicted_data(data bytea, predictiontype character varying, processed_data_id bigint, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
insert into tbl_predicted_data (id, data, predictiontype)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data, predictiontype
	from (values(data, predictiontype)) as tmp(data), nextval('hibernate_sequence') as seq(id);

insert into tbl_processed_data_tbl_predicted_data (tbl_processed_data_id, predicteddataids_id)
	select processed_data_id, currval('hibernate_sequence');
	
select currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_predicted_data(data bytea, predictiontype character varying, processed_data_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_predicted_data(data bytea, predictiontype character varying, datetime timestamp without time zone, processed_data_id bigint, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
insert into tbl_predicted_data (id, data, predictiontype, datetime)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data, predictiontype, datetime
	from (values(data, predictiontype, datetime)) as tmp(data), nextval('hibernate_sequence') as seq(id);

insert into tbl_processed_data_tbl_predicted_data (tbl_processed_data_id, predicteddataids_id)
	select processed_data_id, currval('hibernate_sequence');
	
select currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_predicted_data(data bytea, predictiontype character varying, datetime timestamp without time zone, processed_data_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_processed_data(data bytea, raw_data_id bigint, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
insert into tbl_processed_data (id, data)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data
	from (values(data)) as tmp(data), nextval('hibernate_sequence') as seq(id);

update tbl_raw_data set processed_data_id = currval('hibernate_sequence') 
	where tbl_raw_data.id = raw_data_id;
	
select currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_processed_data(data bytea, raw_data_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_processed_data(data bytea, datetime timestamp without time zone, raw_data_id bigint, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
insert into tbl_processed_data (id, datetime, data)
	select seq.id, tmp.datetime, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data
	from (values(data, datetime)) as tmp(data, datetime), nextval('hibernate_sequence') as seq(id);

update tbl_raw_data set processed_data_id = currval('hibernate_sequence') 
	where tbl_raw_data.id = raw_data_id;
	
select currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_processed_data(data bytea, datetime timestamp without time zone, raw_data_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_raw_data(data bytea, type character varying, processed_data_id bigint, user_id bigint, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
insert into tbl_raw_data (id, data, type, processed_data_id)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data, tmp.type, tmp.processed_data_id
	from (values(data, type, processed_data_id)) as tmp(data, type, processed_data_id), nextval('hibernate_sequence') as seq(id);

insert into tbl_user_tbl_raw_data (tbl_user_id, rawdataids_id)
	select user_id, currval('hibernate_sequence');
	
select currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_raw_data(data bytea, type character varying, processed_data_id bigint, user_id bigint, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_raw_data(data bytea, type character varying, processed_data_id bigint, user_id bigint, datetime timestamp without time zone, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
insert into tbl_raw_data (id, data, type, processed_data_id, datetime)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data, tmp.type, tmp.processed_data_id, tmp.datetime
	from (values(data, type, processed_data_id, datetime)) as tmp(data, type, processed_data_id, datetime), nextval('hibernate_sequence') as seq(id);

insert into tbl_user_tbl_raw_data (tbl_user_id, rawdataids_id)
	select user_id, currval('hibernate_sequence');
	
select currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_raw_data(data bytea, type character varying, processed_data_id bigint, user_id bigint, datetime timestamp without time zone, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_raw_data(data bytea, type character varying, processed_data_id bigint, user_id bigint, datetime timestamp without time zone, year character varying, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$
insert into tbl_raw_data (id, data, type, processed_data_id, datetime, year)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data, tmp.type, tmp.processed_data_id, tmp.datetime, tmp.year
	from (values(data, type, processed_data_id, datetime, year)) as tmp(data, type, processed_data_id, datetime, year), nextval('hibernate_sequence') as seq(id);

insert into tbl_user_tbl_raw_data (tbl_user_id, rawdataids_id)
	select user_id, currval('hibernate_sequence');
	
select currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_raw_data(data bytea, type character varying, processed_data_id bigint, user_id bigint, datetime timestamp without time zone, year character varying, sym_key character varying) OWNER TO root;

CREATE FUNCTION public.save_tbl_test_crypto(firstname character varying, lastname character varying, creditcardnumber character varying, sym_key character varying) RETURNS bigint
    LANGUAGE sql
    AS $$ 
insert into tbl_test_crypto (id, firstname, lastname, creditcardnumber) 
	select seq.id, tmp.fname, tmp.lname, pgp_sym_encrypt(tmp.creditcardnumber, sym_key) as creditcardnumber
	from (values(firstname, lastname, creditcardnumber)) as tmp(fname, lname, creditcardnumber), nextval('hibernate_sequence') as seq(id);
	
SELECT currval('hibernate_sequence')
$$;


ALTER FUNCTION public.save_tbl_test_crypto(firstname character varying, lastname character varying, creditcardnumber character varying, sym_key character varying) OWNER TO root;

CREATE SEQUENCE public.hibernate_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hibernate_sequence OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.tbl_access_group (
    id bigint NOT NULL,
    access_group_name character varying(255),
    created_date timestamp without time zone,
    description character varying(255),
    last_modified_date timestamp without time zone
);


ALTER TABLE public.tbl_access_group OWNER TO root;

CREATE TABLE public.tbl_incorrect_logins (
    id bigint NOT NULL,
    incorrectattempts integer,
    locked boolean,
    lockeddate timestamp without time zone,
    user_id bigint
);


ALTER TABLE public.tbl_incorrect_logins OWNER TO root;

CREATE TABLE public.tbl_login_user (
    id bigint NOT NULL,
    date timestamp without time zone,
    locked boolean,
    password_token character varying(255),
    user_id bigint
);


ALTER TABLE public.tbl_login_user OWNER TO root;

CREATE TABLE public.tbl_predicted_data (
    id bigint NOT NULL,
    data bytea,
    predictiontype character varying(255),
    datetime timestamp without time zone
);


ALTER TABLE public.tbl_predicted_data OWNER TO root;

CREATE TABLE public.tbl_processed_data (
    id bigint NOT NULL,
    data bytea,
    datetime timestamp without time zone
);


ALTER TABLE public.tbl_processed_data OWNER TO root;

CREATE TABLE public.tbl_processed_data_tbl_predicted_data (
    tbl_processed_data_id bigint NOT NULL,
    predicteddataids_id bigint NOT NULL
);


ALTER TABLE public.tbl_processed_data_tbl_predicted_data OWNER TO root;

CREATE TABLE public.tbl_raw_data (
    id bigint NOT NULL,
    data bytea,
    processed_data_id bigint,
    type character varying(255),
    datetime timestamp without time zone,
    year character varying(255)
);


ALTER TABLE public.tbl_raw_data OWNER TO root;

CREATE TABLE public.tbl_role (
    id bigint NOT NULL,
    description character varying(255),
    role_name character varying(255)
);


ALTER TABLE public.tbl_role OWNER TO root;

CREATE TABLE public.tbl_user (
    id bigint NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    password character varying(255),
    username character varying(255)
);


ALTER TABLE public.tbl_user OWNER TO root;

CREATE TABLE public.tbl_user_tbl_access_group (
    tbl_user_id bigint NOT NULL,
    accessgroupids_id bigint NOT NULL
);


ALTER TABLE public.tbl_user_tbl_access_group OWNER TO root;

CREATE TABLE public.tbl_user_tbl_raw_data (
    tbl_user_id bigint NOT NULL,
    rawdataids_id bigint NOT NULL
);


ALTER TABLE public.tbl_user_tbl_raw_data OWNER TO root;

CREATE TABLE public.tbl_user_tbl_role (
    tbl_user_id bigint NOT NULL,
    roleids_id bigint NOT NULL
);

CREATE TABLE public.test_table (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),

    CONSTRAINT uk_gafrg3m3c615etla3ll182w0p UNIQUE (name, email)
);

ALTER TABLE public.tbl_user_tbl_role OWNER TO root;

ALTER TABLE ONLY public.tbl_access_group
    ADD CONSTRAINT tbl_access_group_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_incorrect_logins
    ADD CONSTRAINT tbl_incorrect_logins_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_login_user
    ADD CONSTRAINT tbl_login_user_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_predicted_data
    ADD CONSTRAINT tbl_predicted_data_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_processed_data
    ADD CONSTRAINT tbl_processed_data_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_processed_data_tbl_predicted_data
    ADD CONSTRAINT tbl_processed_data_tbl_predicted_data_pkey PRIMARY KEY (tbl_processed_data_id, predicteddataids_id);

ALTER TABLE ONLY public.tbl_raw_data
    ADD CONSTRAINT tbl_raw_data_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_role
    ADD CONSTRAINT tbl_role_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_user
    ADD CONSTRAINT tbl_user_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tbl_user_tbl_access_group
    ADD CONSTRAINT tbl_user_tbl_access_group_pkey PRIMARY KEY (tbl_user_id, accessgroupids_id);

ALTER TABLE ONLY public.tbl_user_tbl_raw_data
    ADD CONSTRAINT tbl_user_tbl_raw_data_pkey PRIMARY KEY (tbl_user_id, rawdataids_id);

ALTER TABLE ONLY public.tbl_user_tbl_role
    ADD CONSTRAINT tbl_user_tbl_role_pkey PRIMARY KEY (tbl_user_id, roleids_id);

ALTER TABLE ONLY public.tbl_user_tbl_raw_data
    ADD CONSTRAINT uk_gx85yqq1hjw0fjn883y0n604x UNIQUE (rawdataids_id);

ALTER TABLE ONLY public.tbl_processed_data_tbl_predicted_data
    ADD CONSTRAINT uk_sa73d5ss7h2lojnhqd3ggdvsg UNIQUE (predicteddataids_id);

ALTER TABLE ONLY public.tbl_user_tbl_access_group
    ADD CONSTRAINT fk_5j7c1y9jud045mewx4nwjahel FOREIGN KEY (tbl_user_id) REFERENCES public.tbl_user(id);

ALTER TABLE ONLY public.tbl_user_tbl_role
    ADD CONSTRAINT fk_djc0wico031yvuj8rie3l2g5v FOREIGN KEY (roleids_id) REFERENCES public.tbl_role(id);

ALTER TABLE ONLY public.tbl_user_tbl_access_group
    ADD CONSTRAINT fk_gafrg3m3c615etla3ll182w0p FOREIGN KEY (accessgroupids_id) REFERENCES public.tbl_access_group(id);

ALTER TABLE ONLY public.tbl_user_tbl_raw_data
    ADD CONSTRAINT fk_gx85yqq1hjw0fjn883y0n604x FOREIGN KEY (rawdataids_id) REFERENCES public.tbl_raw_data(id);

ALTER TABLE ONLY public.tbl_incorrect_logins
    ADD CONSTRAINT fk_i9emajdyooyxlmdaicabr41wb FOREIGN KEY (user_id) REFERENCES public.tbl_user(id);

ALTER TABLE ONLY public.tbl_processed_data_tbl_predicted_data
    ADD CONSTRAINT fk_mgq92albwlcf0aijckdsl69hv FOREIGN KEY (tbl_processed_data_id) REFERENCES public.tbl_processed_data(id);

ALTER TABLE ONLY public.tbl_user_tbl_role
    ADD CONSTRAINT fk_p7216v4ow303f0limxis9yyu4 FOREIGN KEY (tbl_user_id) REFERENCES public.tbl_user(id);


ALTER TABLE ONLY public.tbl_login_user
    ADD CONSTRAINT fk_pb2qbts4dc4p1af27rnn7ep20 FOREIGN KEY (user_id) REFERENCES public.tbl_user(id);

ALTER TABLE ONLY public.tbl_user_tbl_raw_data
    ADD CONSTRAINT fk_pkrw5guofvq85akbwj7fh0ypu FOREIGN KEY (tbl_user_id) REFERENCES public.tbl_user(id);

ALTER TABLE ONLY public.tbl_processed_data_tbl_predicted_data
    ADD CONSTRAINT fk_sa73d5ss7h2lojnhqd3ggdvsg FOREIGN KEY (predicteddataids_id) REFERENCES public.tbl_predicted_data(id);

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;

-- Initial required data for tables
INSERT INTO public.tbl_access_group (id, access_group_name, created_date, description, last_modified_date)
VALUES
   (3, 'ADMIN', '2020-05-28 00:00:00', 'Admin', '2020-05-28 00:00:00'),
   (4, 'USER', '2020-05-28 00:00:00', 'Regular Users', '2020-05-28 00:00:00');

INSERT INTO public.tbl_role (id, description, role_name)
VALUES
   (4, 'Administrator role', 'ROLE_ADMIN'),
   (5, 'User role', 'ROLE_USER');

INSERT INTO public.tbl_user (id, first_name, last_name, password, username)
VALUES (1, 'Test', 'Tester', public.crypt('123', public.gen_salt('md5')), 'hello');

INSERT INTO public.tbl_user_tbl_access_group (tbl_user_id, accessgroupids_id)
VALUES (1, 4);

INSERT INTO public.tbl_user_tbl_role (tbl_user_id, roleids_id)
VALUES (1, 5);
