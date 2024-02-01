CREATE OR REPLACE FUNCTION query_tbl_test_crypto(sym_key varchar(50)) RETURNS TABLE (id bigint, firstname varchar(50), lastname varchar(50), creditcardnumber varchar(50) )
AS $$
select id, firstname, lastname, pgp_sym_decrypt(creditcardnumber::bytea, sym_key) as creditcardnumber from tbl_test_crypto
$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION query_by_id_tbl_test_crypto(id bigint, sym_key varchar(50)) RETURNS TABLE (id bigint, firstname varchar(50), lastname varchar(50), creditcardnumber varchar(50) )
AS $$
select id, firstname, lastname, pgp_sym_decrypt(creditcardnumber::bytea, sym_key) as creditcardnumber from tbl_test_crypto
where id = id
$$
LANGUAGE SQL;


CREATE OR REPLACE FUNCTION save_tbl_test_crypto(firstname varchar(50), lastname varchar(50), creditcardnumber varchar(50), sym_key varchar(50)) RETURNS bigint
AS $$
insert into tbl_test_crypto (id, firstname, lastname, creditcardnumber)
	select seq.id, tmp.fname, tmp.lname, pgp_sym_encrypt(tmp.creditcardnumber, sym_key) as creditcardnumber
	from (values(firstname, lastname, creditcardnumber)) as tmp(fname, lname, creditcardnumber), nextval('hibernate_sequence') as seq(id);

SELECT currval('hibernate_sequence')
$$
LANGUAGE SQL;




CREATE OR REPLACE FUNCTION login_user(in_username varchar(50), in_password varchar(50)) RETURNS TABLE (id bigint, first_name varchar(50), last_name varchar(50), username varchar(50), password varchar(50))
AS $$
select id, first_name, last_name, username, password from tbl_user
	where username = in_username and password = crypt(in_password, password)
$$
LANGUAGE SQL;


CREATE OR REPLACE FUNCTION public.save_tbl_raw_data(data bytea, type character varying, processed_data_id bigint, user_id bigint, datetime timestamp, sym_key character varying)
 RETURNS bigint
 LANGUAGE sql
AS $function$
insert into tbl_raw_data (id, data, type, processed_data_id, datetime)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data, tmp.type, tmp.processed_data_id, tmp.datetime
	from (values(data, type, processed_data_id, datetime)) as tmp(data, type, processed_data_id, datetime), nextval('hibernate_sequence') as seq(id);

insert into tbl_user_tbl_raw_data (tbl_user_id, rawdataids_id)
	select user_id, currval('hibernate_sequence');

select currval('hibernate_sequence')
$function$
;



CREATE OR REPLACE FUNCTION public.save_tbl_processed_data(data bytea, raw_data_id bigint, sym_key character varying)
 RETURNS bigint
 LANGUAGE sql
AS $function$
insert into tbl_processed_data (id, data)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data
	from (values(data)) as tmp(data), nextval('hibernate_sequence') as seq(id);

update tbl_raw_data set processed_data_id = currval('hibernate_sequence')
	where tbl_raw_data.id = raw_data_id;

select currval('hibernate_sequence')
$function$
;


CREATE OR REPLACE FUNCTION get_process_data_id(raw_data_id bigint)
RETURNS bigint
AS $$
select coalesce((select tbl_raw_data.processed_data_id from tbl_raw_data
	where tbl_raw_data.id = raw_data_id) , -1)
$$
LANGUAGE SQL;


CREATE OR REPLACE FUNCTION public.get_by_id_tbl_processed_data(processed_data_id bigint, sym_key character varying)
 RETURNS TABLE(id bigint, data bytea, datetime timestamp)
 LANGUAGE sql
AS $function$
select id, pgp_sym_decrypt_bytea(data::bytea, sym_key) as data, datetime from tbl_processed_data
	where id = processed_data_id
$function$
;


CREATE OR REPLACE FUNCTION public.save_tbl_predicted_data(data bytea, predictiontype character varying, processed_data_id bigint, sym_key character varying)
 RETURNS bigint
 LANGUAGE sql
AS $function$
insert into tbl_predicted_data (id, data, predictiontype)
	select seq.id, pgp_sym_encrypt_bytea(tmp.data, sym_key) as data, predictiontype
	from (values(data, predictiontype)) as tmp(data), nextval('hibernate_sequence') as seq(id);

insert into tbl_processed_data_tbl_predicted_data (tbl_processed_data_id, predicteddataids_id)
	select processed_data_id, currval('hibernate_sequence');

select currval('hibernate_sequence')
$function$
;



CREATE OR REPLACE FUNCTION public.get_predicted_data_id(processed_data_id bigint, in_predictiontype character varying)
 RETURNS bigint
 LANGUAGE sql
AS $function$
select coalesce(
(select tbl_processed_data_tbl_predicted_data.predicteddataids_id from tbl_processed_data, tbl_processed_data_tbl_predicted_data, tbl_predicted_data
	where tbl_processed_data.id = processed_data_id and
		  tbl_processed_data.id = tbl_processed_data_tbl_predicted_data.tbl_processed_data_id and
		  tbl_processed_data_tbl_predicted_data.predicteddataids_id = tbl_predicted_data.id and
		  tbl_predicted_data.predictiontype = in_predictiontype
	)
	, -1)
$function$
;


CREATE OR REPLACE FUNCTION public.get_by_id_tbl_predict_data(predict_data_id bigint, sym_key character varying)
 RETURNS TABLE(id bigint, data bytea, datetime timestamp without time zone, predictiontype varchar(255))
 LANGUAGE sql
AS $function$
select id, pgp_sym_decrypt_bytea(data::bytea, sym_key) as data, datetime, predictiontype from tbl_predicted_data
	where id = predict_data_id
$function$
;



CREATE OR REPLACE FUNCTION public.list_raw_data(user_id bigint, in_type character varying)
 RETURNS TABLE(id bigint, datetime timestamp without time zone, processed_data_id bigint)
 LANGUAGE sql
AS $function$
select tbl_raw_data.id, tbl_raw_data.datetime, tbl_raw_data.processed_data_id from tbl_raw_data, tbl_user_tbl_raw_data
	where tbl_user_tbl_raw_data.tbl_user_id = user_id and
		  tbl_user_tbl_raw_data.rawdataids_id = tbl_raw_data.id and
		  tbl_raw_data."type" = in_type
$function$
;


CREATE OR REPLACE FUNCTION public.list_processed_data(user_id bigint, in_type character varying)
 RETURNS TABLE(id bigint, datetime timestamp without time zone, predicted_data_id bigint, prediction_type varchar)
 LANGUAGE sql
AS $function$
select tbl_processed_data.id, tbl_processed_data.datetime,
	coalesce(tbl_processed_data_tbl_predicted_data.predicteddataids_id, -1) as predicted_data_id,
	coalesce(tbl_predicted_data.predictiontype, '') as prediction_type
 from tbl_user_tbl_raw_data
 	join tbl_raw_data on tbl_user_tbl_raw_data.rawdataids_id = tbl_raw_data.id
 	join tbl_processed_data on tbl_raw_data.processed_data_id = tbl_processed_data.id
 	left join tbl_processed_data_tbl_predicted_data on tbl_processed_data.id = tbl_processed_data_tbl_predicted_data.tbl_processed_data_id
 	left join tbl_predicted_data on tbl_predicted_data.id = tbl_processed_data_tbl_predicted_data.predicteddataids_id
 where 	tbl_user_tbl_raw_data.tbl_user_id = user_id and tbl_raw_data."type" = in_type
$function$
;






CREATE OR REPLACE FUNCTION public.list_predicted_data(user_id bigint, in_type character varying)
 RETURNS TABLE(id bigint, datetime timestamp without time zone, predictiontype character varying)
 LANGUAGE sql
AS $function$
select tbl_predicted_data.id, tbl_predicted_data.datetime, tbl_predicted_data.predictiontype from tbl_predicted_data, tbl_processed_data_tbl_predicted_data, tbl_processed_data, tbl_raw_data, tbl_user_tbl_raw_data
	where tbl_user_tbl_raw_data.tbl_user_id = user_id and
		  tbl_user_tbl_raw_data.rawdataids_id = tbl_raw_data.id and
		  tbl_raw_data."type" = in_type and
		  tbl_raw_data.processed_data_id = tbl_processed_data.id and
		  tbl_processed_data.id = tbl_processed_data_tbl_predicted_data.tbl_processed_data_id and
		  tbl_processed_data_tbl_predicted_data.predicteddataids_id = tbl_predicted_data.id
$function$
;


CREATE OR REPLACE FUNCTION public.get_by_id_tbl_raw_data(raw_data_id bigint, sym_key character varying)
 RETURNS TABLE(id bigint, data bytea, processed_data_id bigint, type character varying, datetime timestamp)
 LANGUAGE sql
AS $function$
select id, pgp_sym_decrypt_bytea(data::bytea, sym_key) as data, processed_data_id, type, datetime from tbl_raw_data
	where id = raw_data_id
$function$
;



CREATE OR REPLACE FUNCTION public.get_incorrect_logins_by_user_id(in_user_id bigint)
 RETURNS TABLE(id bigint, incorrectattempts integer, locked boolean, user_id bigint, lockeddate timestamp without time zone)
 LANGUAGE sql
AS $function$
select id, incorrectattempts , locked, user_id, lockeddate from tbl_incorrect_logins
	where user_id = in_user_id
$function$
;



