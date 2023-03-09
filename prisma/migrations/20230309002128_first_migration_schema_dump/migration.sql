CREATE SCHEMA IF NOT EXISTS "crypto";
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "crypto";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5
-- Dumped by pg_dump version 14.2

-- Started on 2023-03-08 15:48:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
--This line breaks the migration
--SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 16 (class 2615 OID 16392)
-- Name: critterbase; Type: SCHEMA; Schema: -; Owner: critterbase
--

--CREATE SCHEMA critterbase;


ALTER SCHEMA critterbase OWNER TO critterbase;

--
-- TOC entry 1543 (class 1247 OID 19645)
-- Name: cod_confidence; Type: TYPE; Schema: critterbase; Owner: critterbase
--

CREATE TYPE critterbase.cod_confidence AS ENUM (
    'Probable',
    'Definite'
);


ALTER TYPE critterbase.cod_confidence OWNER TO critterbase;

--
-- TOC entry 1452 (class 1247 OID 40966)
-- Name: coordinate_uncertainty_unit; Type: TYPE; Schema: critterbase; Owner: critterbase
--

CREATE TYPE critterbase.coordinate_uncertainty_unit AS ENUM (
    'm'
);


ALTER TYPE critterbase.coordinate_uncertainty_unit OWNER TO critterbase;

--
-- TOC entry 1557 (class 1247 OID 33574)
-- Name: frequency_unit; Type: TYPE; Schema: critterbase; Owner: critterbase
--

CREATE TYPE critterbase.frequency_unit AS ENUM (
    'Hz',
    'KHz',
    'MHz'
);


ALTER TYPE critterbase.frequency_unit OWNER TO critterbase;

--
-- TOC entry 1471 (class 1247 OID 16691)
-- Name: measurement_unit; Type: TYPE; Schema: critterbase; Owner: critterbase
--

CREATE TYPE critterbase.measurement_unit AS ENUM (
    'millimeter',
    'centimeter',
    'meter',
    'milligram',
    'gram',
    'kilogram'
);


ALTER TYPE critterbase.measurement_unit OWNER TO critterbase;

--
-- TOC entry 1494 (class 1247 OID 17810)
-- Name: sex; Type: TYPE; Schema: critterbase; Owner: critterbase
--

CREATE TYPE critterbase.sex AS ENUM (
    'Male',
    'Female',
    'Unknown',
    'Hermaphroditic'
);


ALTER TYPE critterbase.sex OWNER TO critterbase;

--
-- TOC entry 1027 (class 1255 OID 41171)
-- Name: api_get_context_user_id(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.api_get_context_user_id() RETURNS uuid
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: api_get_context_user_id
-- Purpose: returns the context user id from the invokers temp table
--
-- Credit to Charlie Garett-Jones, original implementation at Biohub
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2022-02-03  initial release
-- *******************************************************************
DECLARE
  internal_user_id uuid;
BEGIN
  CREATE temp TABLE if not EXISTS critterbase_context (tag varchar(200), value varchar(200));
  SELECT value::uuid INTO internal_user_id FROM critterbase_context WHERE tag = 'user_id';
 
  IF internal_user_id IS NULL THEN 
  	SELECT api_set_context('SYSTEM', 'SYSTEM') INTO internal_user_id;
  END IF;

  RETURN internal_user_id;
END;
$$;


ALTER FUNCTION critterbase.api_get_context_user_id() OWNER TO critterbase;

--
-- TOC entry 1028 (class 1255 OID 41175)
-- Name: api_set_context(text, text); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.api_set_context(_system_user_id text, _system_name text) RETURNS uuid
    LANGUAGE plpgsql
    SET client_min_messages TO 'warning'
    AS $$
-- *******************************************************************
-- Procedure: api_set_context
-- Purpose: sets the initial context for api users
-- 
-- Credit to Charlie Garett-Jones, original implementation at BioHub
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--					2023-02-03  initial release
-- *******************************************************************
DECLARE 
internal_user_id uuid;
--_user_identity_source_id user_identity_source.user_identity_source_id%type;
BEGIN
  /*SELECT user_identity_source_id INTO   strict _user_identity_source_id FROM user_identity_source
  WHERE  NAME = p_user_identity_source_name
  AND    record_end_date IS NULL;*/
  
  SELECT user_id INTO strict internal_user_id FROM "user"
  WHERE _system_user_id = system_user_id AND _system_name = system_name;
  
  CREATE temp TABLE if not EXISTS critterbase_context (tag varchar(200), value varchar(200));
  
  DELETE FROM critterbase_context WHERE  tag = 'user_id';
  
  INSERT INTO critterbase_context (tag,value) VALUES ('user_id', internal_user_id::varchar(200));
  
  RETURN internal_user_id;
  exception
	WHEN others THEN
  raise;
END;$$;


ALTER FUNCTION critterbase.api_set_context(_system_user_id text, _system_name text) OWNER TO critterbase;

--
-- TOC entry 1025 (class 1255 OID 19850)
-- Name: check_latitude_range(double precision); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.check_latitude_range(lat double precision) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: check_latitude_range
-- Purpose: checks whether the float arg is within the valid range for
-- latitude 
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
	BEGIN
		RETURN lat >= -90 AND lat <= 90 ;
	END;
$$;


ALTER FUNCTION critterbase.check_latitude_range(lat double precision) OWNER TO critterbase;

--
-- TOC entry 1026 (class 1255 OID 19851)
-- Name: check_longitude_range(double precision); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.check_longitude_range(lon double precision) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: check_longitude_range
-- Purpose: checks whether the float arg is within the valid range for
-- longitude 
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
	BEGIN
		RETURN lon >= -180 AND lon <= 180 ;
	END;
$$;


ALTER FUNCTION critterbase.check_longitude_range(lon double precision) OWNER TO critterbase;

--
-- TOC entry 1019 (class 1255 OID 19708)
-- Name: get_env_region_id(text); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.get_env_region_id(regionname text) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: get_env_region_id
-- Purpose: retrieves the 
-- UUID of a ENV region from an exact name match
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
	BEGIN
		RETURN (SELECT region_env_id FROM lk_region_env WHERE region_env_name = regionname);
	END;
$$;


ALTER FUNCTION critterbase.get_env_region_id(regionname text) OWNER TO critterbase;

--
-- TOC entry 1018 (class 1255 OID 18381)
-- Name: get_nr_region_id(text); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.get_nr_region_id(regionname text) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: get_env_region_id
-- Purpose: retrieves the UUID of a natural resource 
-- region from an exact name match
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
	BEGIN
		RETURN (SELECT region_nr_id FROM lk_region_nr WHERE region_nr_name = regionname);
	END;
$$;


ALTER FUNCTION critterbase.get_nr_region_id(regionname text) OWNER TO critterbase;

--
-- TOC entry 1031 (class 1255 OID 41236)
-- Name: get_table_primary_key(text); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.get_table_primary_key(table_name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
	DECLARE 
		column_name text := '{}';
	BEGIN
		column_name := (
		SELECT a.attname AS data_type
		FROM   pg_index i
		JOIN   pg_attribute a ON a.attrelid = i.indrelid
		                     AND a.attnum = ANY(i.indkey)
		WHERE  i.indrelid = table_name::regclass
		AND    i.indisprimary
		);
		RETURN column_name;
	END;
$$;


ALTER FUNCTION critterbase.get_table_primary_key(table_name text) OWNER TO critterbase;

--
-- TOC entry 1016 (class 1255 OID 32860)
-- Name: get_taxon_ids(text); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.get_taxon_ids(t_id text) RETURNS uuid[]
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: get_taxon_ids
-- Purpose: retrieves the entire taxonomic hierarchy above this 
-- taxon rank latin name by exact match, excludes NULL's
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- mac.deluca@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
	DECLARE
	
	ids uuid[] := (SELECT array_remove(ARRAY [
		taxon_id,
		kingdom_id,
		phylum_id,
		class_id,
		order_id,
		family_id,
		genus_id,
		species_id,
		sub_species_id], NULL)
		FROM lk_taxon
		WHERE taxon_name_latin = t_id
		OR taxon_id = t_id::uuid);


	BEGIN
		RETURN ids;
	END;
$$;


ALTER FUNCTION critterbase.get_taxon_ids(t_id text) OWNER TO critterbase;

--
-- TOC entry 1020 (class 1255 OID 32859)
-- Name: get_taxon_ids(uuid); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.get_taxon_ids(t_id uuid) RETURNS uuid[]
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: get_taxon_ids
-- Purpose: retrieves the entire taxonomic hierarchy above this 
-- taxon rank UUID, excludes NULL's
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- mac.deluca@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
	DECLARE
	
	ids uuid[] := (SELECT array_remove(ARRAY [
		taxon_id,
		kingdom_id,
		phylum_id,
		class_id,
		order_id,
		family_id,
		genus_id,
		species_id,
		sub_species_id], NULL)
		FROM lk_taxon
		WHERE taxon_id = t_id);


	BEGIN
		RETURN ids;
	END;
$$;


ALTER FUNCTION critterbase.get_taxon_ids(t_id uuid) OWNER TO critterbase;

--
-- TOC entry 1017 (class 1255 OID 17233)
-- Name: getuserid(text); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.getuserid(sys_user_id text) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: getuserid
-- Purpose: retrieves the internal UUID for this system based off an
-- external user id string 
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- mac.deluca@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
  BEGIN
	  RETURN (SELECT user_id FROM critterbase.USER WHERE system_user_id = sys_user_id) AS s;
  END;
$$;


ALTER FUNCTION critterbase.getuserid(sys_user_id text) OWNER TO critterbase;

--
-- TOC entry 1014 (class 1255 OID 16684)
-- Name: isbetween(double precision, double precision, double precision); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.isbetween(val double precision, low_limit double precision, high_limit double precision) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: isbetween
-- Purpose: checks whether a value is within a range, where a NULL on
-- either end is effectively treated as infinity 
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- mac.deluca@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
  BEGIN
	  RETURN (low_limit IS NULL OR val >= low_limit) AND (high_limit IS NULL OR val <= high_limit);
  END;
$$;


ALTER FUNCTION critterbase.isbetween(val double precision, low_limit double precision, high_limit double precision) OWNER TO critterbase;

--
-- TOC entry 1032 (class 1255 OID 41257)
-- Name: restore_audit_log(uuid, boolean); Type: PROCEDURE; Schema: critterbase; Owner: critterbase
--

CREATE PROCEDURE critterbase.restore_audit_log(archive_version_id uuid, select_before boolean)
    LANGUAGE plpgsql
    AS $$
DECLARE
	update_user_id uuid;
	primary_key text := '';
	target_table text := '';
	archived_json jsonb;
BEGIN 
	update_user_id := (SELECT api_get_context_user_id());
	SELECT 
		split_part(table_name, '.', 2), 
		(CASE WHEN select_before IS TRUE THEN before_value ELSE after_value END) 
	INTO 
		target_table, 
		archived_json 
	FROM audit_log WHERE audit_log_id = archive_version_id;
	
	IF archived_json IS NULL THEN 
		RAISE EXCEPTION 'The JSON object you selected was NULL';
	END IF;
	
	primary_key := (SELECT get_table_primary_key(target_table));
	archived_json := (SELECT archived_json || jsonb_build_object('update_user', update_user_id, 'update_timestamp', now()));
	
	EXECUTE ( 
		format('DELETE FROM %I WHERE %I = %L', target_table, primary_key, archived_json->>primary_key)
	);

	EXECUTE (
		format('INSERT INTO %I SELECT * FROM jsonb_populate_record(NULL::%I, %L)', target_table, target_table, archived_json)
	);
END;
$$;


ALTER PROCEDURE critterbase.restore_audit_log(archive_version_id uuid, select_before boolean) OWNER TO critterbase;

--
-- TOC entry 1030 (class 1255 OID 41174)
-- Name: trg_audit_trigger(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_audit_trigger() RETURNS trigger
    LANGUAGE plpgsql
    SET client_min_messages TO 'warning'
    AS $$
-- *******************************************************************
-- Procedure: tr_audit_trigger
-- Purpose: audits user and date information during DML execution
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- charlie.garrettjones@quartech.com
--                  2021-01-03  initial biohub release
-- mac.deluca@quartech.com
--					2023-02-03	ported to critterbase. Removed revision_count / modified temp patch for line 29. Defaults to SYSTEM account.
-- mac.deluca@quartech.com
--					2023-02-03 combined journal code + audit column code together.
-- *******************************************************************
DECLARE
	critterbase_user_id uuid := NULL;
	old_row json := null;
  	new_row json := null;
BEGIN
-- api users will hopefully have created the temp table using an api helper function
-- this create temp table statement is for database users
	
	critterbase_user_id := api_get_context_user_id();
	IF (TG_OP = 'INSERT') THEN
		--Set the new_row json for audit_log
		new_row = row_to_json(NEW);
	
	    NEW.create_user = critterbase_user_id;
	
	ELSIF (TG_OP = 'UPDATE') THEN
		--Set new and after row json for audit_log
		old_row = row_to_json(OLD);
		new_row = row_to_json(NEW);

	    NEW.update_user = critterbase_user_id;
	
		NEW.update_timestamp = now();
		-- create audit fields are immutable
		NEW.create_user = OLD.create_user;
	
		NEW.create_timestamp = OLD.create_timestamp;
	END IF;
	
	IF (tg_op = 'DELETE') THEN
		old_row = row_to_json(OLD);
	END IF;

-- Insert the before and after values into the audit log table
	  INSERT INTO audit_log(
	    table_name,
	    operation,
	    before_value,
	    after_value) 
	  VALUES (
	    tg_table_schema || '.' || tg_table_name,
	    tg_op,
	    old_row,
	    new_row);
	   
	IF (tg_op != 'DELETE') THEN RETURN NEW; END IF;

	RETURN OLD;

	EXCEPTION
	WHEN OTHERS THEN
	    RAISE;
END;

$$;


ALTER FUNCTION critterbase.trg_audit_trigger() OWNER TO critterbase;

--
-- TOC entry 1023 (class 1255 OID 32876)
-- Name: trg_critter_collection_unit_upsert(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_critter_collection_unit_upsert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: trg_critter_collection_unit_upsert
-- Purpose: after an insert into the critter table with a non-NULL
-- collection unit, confirm that the collection unit is usable by 
-- the critter's taxon 
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
DECLARE 
valid_units uuid[] := '{}'::uuid[];
BEGIN
	RETURN NEW;
	/*
	WITH ranks AS (
		SELECT unnest(get_taxon_ids(NEW.taxon_id)) AS taxon_id
	)
	SELECT array_agg(emp.taxon_collection_unit_id) INTO valid_units
	FROM lk_taxon t JOIN ranks r ON t.taxon_id = r.taxon_id JOIN xref_taxon_collection_unit emp ON emp.taxon_id = t.taxon_id ; 

	IF NEW.taxon_collection_unit_id IS NOT NULL AND NEW.taxon_collection_unit_id != ALL(valid_units) THEN
		RAISE EXCEPTION 'You are trying to assign a collection unit that is not registered to this critter''s taxon.';
	ELSE 
		RETURN NEW;
	END IF;*/
END
$$;


ALTER FUNCTION critterbase.trg_critter_collection_unit_upsert() OWNER TO critterbase;

--
-- TOC entry 1033 (class 1255 OID 42725)
-- Name: trg_default_release_location(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_default_release_location() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: trg_default_release_location
-- Purpose: after an insert into the capture table. Fill in the release location
-- using the same id as the capture location, if release location not provided.
-- Assumption release location is usually where animal was captured.
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- mac.deluca@quartech.com
--                  2023-02-13  initial release
-- *******************************************************************
BEGIN
--	IF EXISTS (SELECT 1 FROM lk_taxon WHERE taxon_id = NEW.taxon_id AND genus_id IS NOT NULL) THEN 
--		RETURN NEW;
--	ELSE 
--		RAISE EXCEPTION 'Cannot create a collection unit for any taxon above species level.';
--	END IF;
	
	IF (NEW.release_location_id IS NULL) THEN 
		NEW.release_location_id := NEW.capture_location_id;
	END IF;
	RETURN NEW;
END
$$;


ALTER FUNCTION critterbase.trg_default_release_location() OWNER TO critterbase;

--
-- TOC entry 1029 (class 1255 OID 42876)
-- Name: trg_inverse_relationship(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_inverse_relationship() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: trg_inverse_relationship
-- Purpose: after an insert into relationship populate the inverse.
-- ie: insert a critter with parent -> insert a parent with child
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- mac.deluca@quartech.com
--                  2023-02-14  initial release
-- *******************************************************************
BEGIN
	IF (NEW.parent_id IS NOT NULL) THEN 
		INSERT INTO relationship (critter_id, child_id) VALUES (NEW.parent_id, NEW.critter_id) ON CONFLICT (critter_id, child_id) DO NOTHING;
	END IF;
	IF (NEW.child_id IS NOT NULL) THEN 
		INSERT INTO relationship (critter_id, parent_id) VALUES (NEW.child_id, NEW.critter_id) ON CONFLICT (critter_id, parent_id) DO NOTHING;
	END IF;
	IF (NEW.sibling_id IS NOT NULL) THEN 
		INSERT INTO relationship (critter_id, sibling_id) VALUES (NEW.sibling_id, NEW.critter_id) ON CONFLICT (critter_id, sibling_id) DO NOTHING;
	END IF;
	RETURN NEW;
END
$$;


ALTER FUNCTION critterbase.trg_inverse_relationship() OWNER TO critterbase;

--
-- TOC entry 1021 (class 1255 OID 41170)
-- Name: trg_log_record(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_log_record() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
-- *******************************************************************
-- Procedure: trg_log_record
-- Purpose: handles logging of change history for many tables
--
-- Credit to Charlie Garrett-Jones, original implementation at BioHub
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
DECLARE
  old_row json := null;
  new_row json := null;
BEGIN
  IF tg_op IN ('UPDATE','DELETE') THEN
    old_row = row_to_json(OLD);    
  end if;
  IF tg_op IN ('INSERT','UPDATE') THEN
    new_row = row_to_json(NEW);
  END IF;

  INSERT INTO audit_log(
    table_name,
    operation,
    before_value,
    after_value) 
  VALUES (
    tg_table_schema || '.' || tg_table_name,
    tg_op,
    old_row,
    new_row);

  RETURN NEW;
END;
$$;


ALTER FUNCTION critterbase.trg_log_record() OWNER TO critterbase;

--
-- TOC entry 1015 (class 1255 OID 32839)
-- Name: trg_measurement_qualitative_upsert(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_measurement_qualitative_upsert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: trg_measurement_qualitative_upsert
-- Purpose: after an insert into the measurement_qualitative table, 
-- ensure that this taxon_measurement is usable by the critter's
-- taxon
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
DECLARE 
critter_taxon uuid;
valid_measures uuid[] := '{}'::uuid[];
BEGIN
	SELECT taxon_id INTO critter_taxon FROM critter WHERE critter_id = NEW.critter_id;
	WITH ranks AS (
		SELECT unnest(get_taxon_ids(critter_taxon)) AS taxon_id
	)
	SELECT array_agg(emp.taxon_measurement_id) INTO valid_measures
	FROM lk_taxon t 
	JOIN ranks r ON t.taxon_id = r.taxon_id 
	JOIN xref_taxon_measurement_qualitative emp ON emp.taxon_id = t.taxon_id ; 

	IF NEW.taxon_measurement_id != ALL(valid_measures) THEN
		RAISE EXCEPTION 'You are trying to assign a measurement to this critter which is not part of its taxonomic hierarchy, Critter ID: %', NEW.critter_id;
	ELSE 
		RETURN NEW;
	END IF;
END
$$;


ALTER FUNCTION critterbase.trg_measurement_qualitative_upsert() OWNER TO critterbase;

--
-- TOC entry 1034 (class 1255 OID 25041)
-- Name: trg_measurement_quantitative_upsert(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_measurement_quantitative_upsert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: trg_measurement_empirical_tax_upsert
-- Purpose: after an insert into the measurement_empricial table, 
-- ensure that this taxon_measurement is usable by the critter's
-- taxon and check whether the value is in the allowed range
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
DECLARE
taxon_record record;
critter_taxon uuid;
valid_measures uuid[] := '{}'::uuid[];
BEGIN
	SELECT taxon_id INTO critter_taxon FROM critter WHERE critter_id = NEW.critter_id;
	WITH ranks AS (
		SELECT unnest(get_taxon_ids(critter_taxon)) AS taxon_id
	)
	SELECT array_agg(emp.taxon_measurement_id) INTO valid_measures
	FROM lk_taxon t 
	JOIN ranks r ON t.taxon_id = r.taxon_id 
	JOIN xref_taxon_measurement_quantitative emp ON emp.taxon_id = t.taxon_id ; 

	IF NEW.taxon_measurement_id != ALL(valid_measures) THEN
		RAISE EXCEPTION 'You are trying to assign a measurement to this critter which is not part of its taxonomic hierarchy. Critter ID %', NEW.critter_id;
	END IF;
	
	SELECT * FROM xref_taxon_measurement_quantitative INTO taxon_record WHERE taxon_measurement_id = NEW.taxon_measurement_id;
	IF critterbase.isbetween(NEW.value, taxon_record.min_value, taxon_record.max_value) THEN 
		RETURN NEW;
	ELSE
		RAISE EXCEPTION 'Value % is outside the range of % to % for this species measurement.', NEW.value, taxon_record.min_value, taxon_record.max_value;
	END IF;
END
$$;


ALTER FUNCTION critterbase.trg_measurement_quantitative_upsert() OWNER TO critterbase;

--
-- TOC entry 1024 (class 1255 OID 32877)
-- Name: trg_xref_taxon_collection_unit_upsert(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE FUNCTION critterbase.trg_xref_taxon_collection_unit_upsert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
-- *******************************************************************
-- Procedure: trg_xref_taxon_collection_unit_upsert
-- Purpose: after an insert into the xref_taxon_collection_unit table, 
-- ensure that the taxon is at the species level or below 
--
-- MODIFICATION HISTORY
-- Person           Date        Comments
-- ---------------- ----------- --------------------------------------
-- graham.stewart@quartech.com
--                  2023-02-02  initial release
-- *******************************************************************
BEGIN
	IF EXISTS (SELECT 1 FROM lk_taxon WHERE taxon_id = NEW.taxon_id AND genus_id IS NOT NULL) THEN 
		RETURN NEW;
	ELSE 
		RAISE EXCEPTION 'Cannot create a collection unit for any taxon above species level.';
	END IF;
END
$$;


ALTER FUNCTION critterbase.trg_xref_taxon_collection_unit_upsert() OWNER TO critterbase;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 251 (class 1259 OID 41669)
-- Name: artifact; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.artifact (
    artifact_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    artifact_url text NOT NULL,
    artifact_comment text,
    capture_id uuid,
    mortality_id uuid,
    measurement_qualitative uuid,
    measurement_quantitative uuid,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.artifact OWNER TO critterbase;

--
-- TOC entry 4278 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE artifact; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.artifact IS 'The primary artifact table. Includes url to hosted file / object as well as reference to critter_id and related events (E.G., capture_id, measurement, etc).';


--
-- TOC entry 4279 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.artifact_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.artifact_id IS 'The internal UUID uniquely identifying this artifact.';


--
-- TOC entry 4280 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.critter_id IS 'The UUID of the individual critter this artifact corresponds to.';


--
-- TOC entry 4281 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.artifact_url; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.artifact_url IS 'The URL to the hosted file or object.';


--
-- TOC entry 4282 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.artifact_comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.artifact_comment IS 'Any addtional information regarding the artifact go here.';


--
-- TOC entry 4283 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.capture_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.capture_id IS 'The UUID of a capture event this artifact corresponds to.';


--
-- TOC entry 4284 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.mortality_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.mortality_id IS 'The UUID of a mortality event this artifact corresponds to.';


--
-- TOC entry 4285 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.measurement_qualitative; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.measurement_qualitative IS 'The UUID of a qualitative measurement this artifact corresponds to.';


--
-- TOC entry 4286 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.measurement_quantitative; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.measurement_quantitative IS 'The UUID of a quantitative measurement this artifact corresponds to.';


--
-- TOC entry 4287 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4288 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4289 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4290 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN artifact.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.artifact.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 247 (class 1259 OID 41152)
-- Name: audit_log; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.audit_log (
    audit_log_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    table_name text NOT NULL,
    operation text NOT NULL,
    before_value jsonb,
    after_value jsonb,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.audit_log OWNER TO critterbase;

--
-- TOC entry 4291 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE audit_log; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.audit_log IS 'The primary audit_log table. Holds table-name / operation / before / after / user values for changes made to database teables.';


--
-- TOC entry 4292 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.audit_log_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.audit_log_id IS 'The internal UUID uniquely identifying this log.';


--
-- TOC entry 4293 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.table_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.table_name IS 'The name of the table which the log corresponds to.';


--
-- TOC entry 4294 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.operation; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.operation IS 'The type of operation performed (INSERT, UPDATE, DELETE).';


--
-- TOC entry 4295 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.before_value; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.before_value IS 'The initial value before the operation was performed in the table.';


--
-- TOC entry 4296 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.after_value; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.after_value IS 'The value after the operation was performed in the table.';


--
-- TOC entry 4297 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.create_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4298 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.update_user IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4299 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.create_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 4300 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN audit_log.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.audit_log.update_timestamp IS 'The internal UUID used to reference an archived record''s corresponding original version in the non-archive table.';


--
-- TOC entry 258 (class 1259 OID 42467)
-- Name: capture; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.capture (
    capture_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    capture_location_id uuid,
    release_location_id uuid,
    capture_timestamp timestamp with time zone NOT NULL,
    release_timestamp timestamp with time zone,
    capture_comment text,
    release_comment text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.capture OWNER TO critterbase;

--
-- TOC entry 4301 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE capture; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.capture IS 'The primary capture table. Includes capture / recapture data and pertaining position information.';


--
-- TOC entry 4302 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.capture_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.capture_id IS 'The internal UUID uniquely identifying this capture event.';


--
-- TOC entry 4303 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.critter_id IS 'The UUID for the critter that was captured in this event.';


--
-- TOC entry 4304 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.capture_location_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.capture_location_id IS 'The UUID for for the capture location data for this event.';


--
-- TOC entry 4305 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.release_location_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.release_location_id IS 'The UUID for for the release location data for this event.';


--
-- TOC entry 4306 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.capture_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.capture_timestamp IS 'The timestamp for when this capture event started. Often only the date will be the important part here.';


--
-- TOC entry 4307 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.release_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.release_timestamp IS 'The timestamp for when this critter was released from capture. This often will not be known.';


--
-- TOC entry 4308 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.capture_comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.capture_comment IS 'Any addtional observations surrounding the capture go here.';


--
-- TOC entry 4309 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.release_comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.release_comment IS 'Any addtional observations surrounding the release go here.';


--
-- TOC entry 4310 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4311 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4312 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4313 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN capture.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.capture.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 225 (class 1259 OID 17251)
-- Name: user; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase."user" (
    user_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    system_user_id text NOT NULL,
    system_name text NOT NULL,
    keycloak_uuid uuid,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase."user" OWNER TO critterbase;

--
-- TOC entry 4314 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE "user"; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase."user" IS 'The primary ''user'' table. Includes external system information.';


--
-- TOC entry 4315 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".user_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".user_id IS 'UUID uniquely identifying this user within this system.';


--
-- TOC entry 4316 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".system_user_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".system_user_id IS 'The user ID for this user within the external system.';


--
-- TOC entry 4317 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".system_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".system_name IS 'The name of the external system this user is coming from.';


--
-- TOC entry 4318 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".keycloak_uuid; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".keycloak_uuid IS 'Unique GUID supplied to us from the Keycloak realm based on either IDIR or BCEID, whatever they sign in with.';


--
-- TOC entry 4319 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4320 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4321 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4322 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN "user".update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase."user".update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 259 (class 1259 OID 42519)
-- Name: capture_v; Type: VIEW; Schema: critterbase; Owner: critterbase
--

CREATE VIEW critterbase.capture_v AS
 SELECT c.capture_id,
    c.critter_id,
    c.capture_timestamp,
    c.release_timestamp,
    c.capture_comment,
    c.release_comment,
    cu.system_user_id AS create_user,
    uu.system_user_id AS update_user,
    c.create_timestamp,
    c.update_timestamp
   FROM ((critterbase.capture c
     LEFT JOIN critterbase."user" cu ON ((cu.user_id = c.create_user)))
     LEFT JOIN critterbase."user" uu ON ((uu.user_id = c.update_user)));


ALTER TABLE critterbase.capture_v OWNER TO critterbase;

--
-- TOC entry 245 (class 1259 OID 32890)
-- Name: critter; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.critter (
    critter_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    taxon_id uuid NOT NULL,
    wlh_id text,
    animal_id text,
    sex critterbase.sex NOT NULL,
    responsible_region_nr_id uuid DEFAULT critterbase.get_nr_region_id('Unknown'::text),
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    previous_version_id uuid,
    critter_comment text
);


ALTER TABLE critterbase.critter OWNER TO critterbase;

--
-- TOC entry 4323 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE critter; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.critter IS 'The primary critter table and root of database.
NOTE: temp commented out the trigger for this table until collection_unit is restored';


--
-- TOC entry 4324 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.critter_id IS 'The internal UUID of this critter, denoting an individual animal in the system.';


--
-- TOC entry 4325 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.taxon_id IS 'The internal UUID of this critter''s taxon from the lk_taxon table. Determines markings and measurements this critter receives.';


--
-- TOC entry 4326 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.wlh_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.wlh_id IS 'A unique identifier assigned to an individual by the B. C. Wildlife Health Program, independent of possible changes in mark method used, to assoicate health data to the indiviudal.';


--
-- TOC entry 4327 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.animal_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.animal_id IS 'A unique identifier permanently assigned to an animal by the project coordinator, independent of possible changes in mark method used. This data is mandatory if there is telemetry or GPS data for the animal.  Field often contains text and numbers.';


--
-- TOC entry 4328 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.sex; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.sex IS 'Enumerated type indicating the critter''s sex.';


--
-- TOC entry 4329 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.responsible_region_nr_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.responsible_region_nr_id IS 'The internal UUID for the natural resource region responsible for this critter.';


--
-- TOC entry 4330 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4331 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4332 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4333 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 4334 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN critter.previous_version_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter.previous_version_id IS 'The internal UUID used to reference an archived record''s corresponding original version in the non-archive table.';


--
-- TOC entry 253 (class 1259 OID 42051)
-- Name: critter_collection_unit; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.critter_collection_unit (
    critter_collection_unit_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    collection_unit_id uuid NOT NULL,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.critter_collection_unit OWNER TO critterbase;

--
-- TOC entry 4335 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE critter_collection_unit; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.critter_collection_unit IS 'The primary critter ''collection_unit'' table. Holds herds / groups / population units. Critters potentially have many concurrently.';


--
-- TOC entry 4336 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN critter_collection_unit.critter_collection_unit_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter_collection_unit.critter_collection_unit_id IS 'UUID uniquely identifying this collection unit.';


--
-- TOC entry 4337 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN critter_collection_unit.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter_collection_unit.critter_id IS 'The UUID of the individual critter this collection unit corresponds to.';


--
-- TOC entry 4338 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN critter_collection_unit.collection_unit_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter_collection_unit.collection_unit_id IS 'The UUID of the associated collection unit.';


--
-- TOC entry 4339 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN critter_collection_unit.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter_collection_unit.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4340 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN critter_collection_unit.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter_collection_unit.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4341 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN critter_collection_unit.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter_collection_unit.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4342 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN critter_collection_unit.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.critter_collection_unit.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 262 (class 1259 OID 42535)
-- Name: family; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.family (
    family_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    family_label text NOT NULL,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.family OWNER TO critterbase;

--
-- TOC entry 4343 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN family.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4344 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN family.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4345 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN family.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4346 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN family.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 260 (class 1259 OID 42525)
-- Name: family_child; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.family_child (
    family_id uuid NOT NULL,
    child_critter_id uuid NOT NULL,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.family_child OWNER TO critterbase;

--
-- TOC entry 4347 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN family_child.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_child.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4348 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN family_child.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_child.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4349 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN family_child.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_child.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4350 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN family_child.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_child.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 261 (class 1259 OID 42530)
-- Name: family_parent; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.family_parent (
    family_id uuid NOT NULL,
    parent_critter_id uuid NOT NULL,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.family_parent OWNER TO critterbase;

--
-- TOC entry 4351 (class 0 OID 0)
-- Dependencies: 261
-- Name: COLUMN family_parent.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_parent.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4352 (class 0 OID 0)
-- Dependencies: 261
-- Name: COLUMN family_parent.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_parent.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4353 (class 0 OID 0)
-- Dependencies: 261
-- Name: COLUMN family_parent.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_parent.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4354 (class 0 OID 0)
-- Dependencies: 261
-- Name: COLUMN family_parent.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.family_parent.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 237 (class 1259 OID 19710)
-- Name: lk_cause_of_death; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_cause_of_death (
    cod_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    cod_category text NOT NULL,
    cod_reason text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_cause_of_death OWNER TO critterbase;

--
-- TOC entry 4355 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE lk_cause_of_death; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_cause_of_death IS 'Lookup table for cause of death.';


--
-- TOC entry 4356 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN lk_cause_of_death.cod_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_cause_of_death.cod_id IS 'UUID uniquely identifying this cause of death.';


--
-- TOC entry 4357 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN lk_cause_of_death.cod_category; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_cause_of_death.cod_category IS 'Broader category of COD.';


--
-- TOC entry 4358 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN lk_cause_of_death.cod_reason; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_cause_of_death.cod_reason IS 'Specific cause of death, organized by category. Select Unknown if only category is applicable.';


--
-- TOC entry 4359 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN lk_cause_of_death.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_cause_of_death.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4360 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN lk_cause_of_death.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_cause_of_death.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4361 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN lk_cause_of_death.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_cause_of_death.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4362 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN lk_cause_of_death.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_cause_of_death.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 254 (class 1259 OID 42133)
-- Name: lk_collection_category; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_collection_category (
    collection_category_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    category_name text NOT NULL,
    description text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_collection_category OWNER TO critterbase;

--
-- TOC entry 4363 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE lk_collection_category; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_collection_category IS 'Lookup table for supported collection categories. Parent of a collection unit.';


--
-- TOC entry 4364 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN lk_collection_category.collection_category_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_collection_category.collection_category_id IS 'UUID uniquely identifying this collection category.';


--
-- TOC entry 4365 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN lk_collection_category.category_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_collection_category.category_name IS 'The name of the collection category. ie: population unit';


--
-- TOC entry 4366 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN lk_collection_category.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_collection_category.description IS 'Any addtional information about this collection category.';


--
-- TOC entry 4367 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN lk_collection_category.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_collection_category.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4368 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN lk_collection_category.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_collection_category.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4369 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN lk_collection_category.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_collection_category.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4370 (class 0 OID 0)
-- Dependencies: 254
-- Name: COLUMN lk_collection_category.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_collection_category.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 228 (class 1259 OID 17326)
-- Name: lk_colour; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_colour (
    colour_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    colour text NOT NULL,
    hex_code text,
    description text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_colour OWNER TO critterbase;

--
-- TOC entry 4371 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE lk_colour; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_colour IS 'Lookup table for supported colours.';


--
-- TOC entry 4372 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.colour_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.colour_id IS 'UUID uniquely identifying this colour.';


--
-- TOC entry 4373 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.colour; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.colour IS 'The colour, in text.';


--
-- TOC entry 4374 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.hex_code; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.hex_code IS 'Hex code corresponding to this colour.';


--
-- TOC entry 4375 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.description IS 'Any addtional information about the usage of this colour.';


--
-- TOC entry 4376 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4377 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4378 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4379 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN lk_colour.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_colour.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 227 (class 1259 OID 17278)
-- Name: lk_marking_material; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_marking_material (
    marking_material_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    material text,
    description text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_marking_material OWNER TO critterbase;

--
-- TOC entry 4380 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE lk_marking_material; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_marking_material IS 'Lookup table for supported marking materials';


--
-- TOC entry 4381 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN lk_marking_material.marking_material_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_material.marking_material_id IS 'UUID uniquely identifying this marking material.';


--
-- TOC entry 4382 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN lk_marking_material.material; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_material.material IS 'The material a marking might be made out of.';


--
-- TOC entry 4383 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN lk_marking_material.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_material.description IS 'Any additional information about how this material is used.';


--
-- TOC entry 4384 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN lk_marking_material.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_material.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4385 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN lk_marking_material.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_material.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4386 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN lk_marking_material.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_material.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4387 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN lk_marking_material.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_material.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 226 (class 1259 OID 17262)
-- Name: lk_marking_type; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_marking_type (
    marking_type_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_marking_type OWNER TO critterbase;

--
-- TOC entry 4388 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE lk_marking_type; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_marking_type IS 'Lookup table for supported marking types.';


--
-- TOC entry 4389 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN lk_marking_type.marking_type_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_type.marking_type_id IS 'UUID uniquely identifying this marking type.';


--
-- TOC entry 4390 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN lk_marking_type.name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_type.name IS 'Name for this marking type.';


--
-- TOC entry 4391 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN lk_marking_type.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_type.description IS 'Any additional information surrounding how this type of marking is used.';


--
-- TOC entry 4392 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN lk_marking_type.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_type.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4393 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN lk_marking_type.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_type.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4394 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN lk_marking_type.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_type.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4395 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN lk_marking_type.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_marking_type.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 256 (class 1259 OID 42401)
-- Name: lk_population_unit_temp; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_population_unit_temp (
    population_unit_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    unit_name text,
    unit_geom public.geometry(MultiPolygon,4326)
);


ALTER TABLE critterbase.lk_population_unit_temp OWNER TO critterbase;

--
-- TOC entry 4396 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE lk_population_unit_temp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_population_unit_temp IS 'Temporary lookup table for population unit information.';


--
-- TOC entry 236 (class 1259 OID 19673)
-- Name: lk_region_env; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_region_env (
    region_env_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    region_env_name text NOT NULL,
    description text,
    region_geom public.geometry(MultiPolygon,4326),
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_region_env OWNER TO critterbase;

--
-- TOC entry 4397 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE lk_region_env; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_region_env IS 'Lookup table for ENV region.
''The spatial representation for Environment Regions. An Environment Region is an administrative area established by the Ministry and is an administrative area which is used to manage regional activites.''';


--
-- TOC entry 4398 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.region_env_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.region_env_id IS 'UUID uniquely identifying this environment region within the system.';


--
-- TOC entry 4399 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.region_env_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.region_env_name IS 'The name for this environment region, as defined by the province.';


--
-- TOC entry 4400 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.description IS 'Any additional notes about this region.';


--
-- TOC entry 4401 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.region_geom; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.region_geom IS 'PostGIS polygon for this region, adapted from the province''s GeoJSON.';


--
-- TOC entry 4402 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4403 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4404 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4405 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN lk_region_env.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_env.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 229 (class 1259 OID 18252)
-- Name: lk_region_nr; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_region_nr (
    region_nr_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    region_nr_name text NOT NULL,
    description text,
    region_geom public.geometry(Polygon,4326),
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_region_nr OWNER TO critterbase;

--
-- TOC entry 4406 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE lk_region_nr; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_region_nr IS 'Lookup table for natural resource regions.
''The spatial representation for a Natural Resource (NR) District, that is an administrative area established by the Ministry, within NR Regions.''';


--
-- TOC entry 4407 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.region_nr_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.region_nr_id IS 'UUID uniquely identifying this natural resource region within the system.';


--
-- TOC entry 4408 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.region_nr_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.region_nr_name IS 'The name for this natural resource region, as defined by the province.';


--
-- TOC entry 4409 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.description IS 'Any additional notes about this natural resource region.';


--
-- TOC entry 4410 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.region_geom; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.region_geom IS 'PostGIS polygon for this region, adapted from the province''s GeoJSON.';


--
-- TOC entry 4411 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4412 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4413 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4414 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN lk_region_nr.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_region_nr.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 238 (class 1259 OID 24938)
-- Name: lk_taxon; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_taxon (
    taxon_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    kingdom_id uuid,
    phylum_id uuid,
    class_id uuid,
    order_id uuid,
    family_id uuid,
    genus_id uuid,
    species_id uuid,
    sub_species_id uuid,
    taxon_name_common text,
    taxon_name_latin text NOT NULL,
    spi_taxonomy_id integer DEFAULT '-1'::integer NOT NULL,
    taxon_description text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_taxon OWNER TO critterbase;

--
-- TOC entry 4415 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE lk_taxon; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_taxon IS 'Lookup table for supported taxon / taxon hierarchies. 
Self referencing table pointing to each parent node / level above.';


--
-- TOC entry 4416 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.taxon_id IS 'UUID uniquely identifying this taxon rank within the system. May be referenced by subsequent columns.';


--
-- TOC entry 4417 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.kingdom_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.kingdom_id IS 'The kingdom above this taxon. If NULL columns begin here, this row is a kingdom.';


--
-- TOC entry 4418 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.phylum_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.phylum_id IS 'The phylum above this taxon. If NULL columns begin here, this row is a phylum.';


--
-- TOC entry 4419 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.class_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.class_id IS 'The class above this taxon. If NULL columns begin here, this row is a class.';


--
-- TOC entry 4420 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.order_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.order_id IS 'The order above this taxon. If NULL columns begin here, this row is an order.';


--
-- TOC entry 4421 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.family_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.family_id IS 'The family above this taxon. If NULL columns begin here, this row is a family.';


--
-- TOC entry 4422 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.genus_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.genus_id IS 'The genus above this taxon. If NULL columns begin here, this row is a genus.';


--
-- TOC entry 4423 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.species_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.species_id IS 'The species above this taxon. If NULL columns begin here, this row is a species.';


--
-- TOC entry 4424 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.sub_species_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.sub_species_id IS 'The subspecies above this taxon. If only NULL column, this row is a sub_species. Note that since there is no supported level below this one, it should always be NULL.';


--
-- TOC entry 4425 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.taxon_name_common; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.taxon_name_common IS 'The common name for this taxon. Most often relevant at the species level.';


--
-- TOC entry 4426 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.taxon_name_latin; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.taxon_name_latin IS 'The latin name for this taxon, which all taxons should have.';


--
-- TOC entry 4427 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.spi_taxonomy_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.spi_taxonomy_id IS 'The SPI taxon _id. I think this column is marked for deletion.';


--
-- TOC entry 4428 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.taxon_description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.taxon_description IS 'Any additional information about this taxon.';


--
-- TOC entry 4429 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4430 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4431 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4432 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN lk_taxon.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 239 (class 1259 OID 25002)
-- Name: lk_taxon_w_level; Type: VIEW; Schema: critterbase; Owner: critterbase
--

CREATE VIEW critterbase.lk_taxon_w_level AS
 SELECT num_nonnulls(lk_taxon.kingdom_id, lk_taxon.phylum_id, lk_taxon.class_id, lk_taxon.order_id, lk_taxon.family_id, lk_taxon.genus_id, lk_taxon.species_id, lk_taxon.sub_species_id) AS hierarchy_level,
    lk_taxon.taxon_id,
    lk_taxon.kingdom_id,
    lk_taxon.phylum_id,
    lk_taxon.class_id,
    lk_taxon.order_id,
    lk_taxon.family_id,
    lk_taxon.genus_id,
    lk_taxon.species_id,
    lk_taxon.sub_species_id,
    lk_taxon.taxon_name_common,
    lk_taxon.taxon_name_latin,
    lk_taxon.spi_taxonomy_id,
    lk_taxon.taxon_description AS taxon_comment,
    lk_taxon.create_user,
    lk_taxon.update_user,
    lk_taxon.create_timestamp,
    lk_taxon.update_timestamp
   FROM critterbase.lk_taxon;


ALTER TABLE critterbase.lk_taxon_w_level OWNER TO critterbase;

--
-- TOC entry 4433 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN lk_taxon_w_level.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon_w_level.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4434 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN lk_taxon_w_level.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon_w_level.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4435 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN lk_taxon_w_level.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon_w_level.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4436 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN lk_taxon_w_level.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_taxon_w_level.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 230 (class 1259 OID 18325)
-- Name: lk_wildlife_management_unit; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.lk_wildlife_management_unit (
    wmu_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    wmu_name text NOT NULL,
    description text,
    wmu_geom public.geometry(Polygon,4326),
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.lk_wildlife_management_unit OWNER TO critterbase;

--
-- TOC entry 4437 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE lk_wildlife_management_unit; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.lk_wildlife_management_unit IS 'Lookup table for supported wildlife management units. 
''The Province is divided into nine administrative regions, having a total of 225 wildlife management units (WMU) for the purpose of efficient game management.''';


--
-- TOC entry 4438 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.wmu_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.wmu_id IS 'UUID uniquely identifying this wildlife management unit.';


--
-- TOC entry 4439 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.wmu_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.wmu_name IS 'The name for this wildlife management unit, should always be WMU followed by numbers.';


--
-- TOC entry 4440 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.description IS 'Any additional information about this wildlife management unit.';


--
-- TOC entry 4441 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.wmu_geom; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.wmu_geom IS 'PostGIS polygon for this wildlife management unit, adapted from the province''s GeoJSON.';


--
-- TOC entry 4442 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4443 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4444 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4445 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN lk_wildlife_management_unit.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.lk_wildlife_management_unit.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 263 (class 1259 OID 42624)
-- Name: location; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.location (
    location_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    latitude double precision,
    longitude double precision,
    coordinate_uncertainty double precision,
    coordinate_uncertainty_unit critterbase.coordinate_uncertainty_unit,
    wmu_id uuid,
    region_nr_id uuid,
    region_env_id uuid,
    elevation double precision,
    temperature double precision,
    location_comment text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT location_check CHECK ((critterbase.check_latitude_range(latitude) AND critterbase.check_longitude_range(longitude)))
);


ALTER TABLE critterbase.location OWNER TO critterbase;

--
-- TOC entry 4446 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE location; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.location IS 'The primary critter ''location'' table. Holds all location data for a critter. Used in mortality and capture. Uses datum: WGS84 (4326)';


--
-- TOC entry 4447 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.location_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.location_id IS 'UUID uniquely identifying this location event.';


--
-- TOC entry 4448 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.latitude; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.latitude IS 'Latitude part of the coordinate for where this event occurred.';


--
-- TOC entry 4449 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.longitude; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.longitude IS 'Longitude part of the coordinate for where this event occured.';


--
-- TOC entry 4450 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.coordinate_uncertainty; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.coordinate_uncertainty IS 'The precision of the coordinate recored. A value of 10m means the event occured somewhere within a 10m radius of the coordinate.';


--
-- TOC entry 4451 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.coordinate_uncertainty_unit; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.coordinate_uncertainty_unit IS 'The units in which the precision is meaured (meters, feet, decimal degrees, etc).';


--
-- TOC entry 4452 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.wmu_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.wmu_id IS 'The wildlife management unit where the location event occurred.';


--
-- TOC entry 4453 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.region_nr_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.region_nr_id IS 'The UUID of the natural resource region where this event occured.';


--
-- TOC entry 4454 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.region_env_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.region_env_id IS 'The UUID of the environment region where this event occured.';


--
-- TOC entry 4455 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.elevation; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.elevation IS 'The elevation of the location event. In meters.';


--
-- TOC entry 4456 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.temperature; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.temperature IS 'The temperature of the location event. In celcius.';


--
-- TOC entry 4457 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.location_comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.location_comment IS 'Additional comment on the location event.';


--
-- TOC entry 4458 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4459 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4460 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4461 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN location.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.location.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 248 (class 1259 OID 41269)
-- Name: marking; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.marking (
    marking_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    capture_id uuid,
    mortality_id uuid,
    taxon_marking_body_location_id uuid NOT NULL,
    marking_type_id uuid,
    marking_material_id uuid,
    primary_colour_id uuid,
    secondary_colour_id uuid,
    text_colour_id uuid,
    identifier text,
    frequency double precision,
    frequency_unit critterbase.frequency_unit,
    "order" integer,
    comment text,
    attached_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    removed_timestamp timestamp with time zone,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT marking_frequency_check CHECK (((num_nulls(frequency, frequency_unit) = 0) OR (num_nulls(frequency, frequency_unit) = 2)))
);


ALTER TABLE critterbase.marking OWNER TO critterbase;

--
-- TOC entry 4462 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE marking; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.marking IS 'The primary critter ''marking'' table. Includes attributes which define supported BC animal marking types. ie: ear tags, pit tags, leg bands';


--
-- TOC entry 4463 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.marking_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.marking_id IS 'UUID uniquely identifying this marking.';


--
-- TOC entry 4464 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.critter_id IS 'The UUID of the individual critter this marking corresponds to.';


--
-- TOC entry 4465 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.capture_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.capture_id IS 'The UUID of the capture event that this marking corresponds to. Markings are typically applied during captures.';


--
-- TOC entry 4466 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.mortality_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.mortality_id IS 'The UUID of the mortality event that this marking corresponds to.';


--
-- TOC entry 4467 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.taxon_marking_body_location_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.taxon_marking_body_location_id IS 'The UUID corresponding to the location on this critter''s body where the marking is applied.';


--
-- TOC entry 4468 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.marking_type_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.marking_type_id IS 'The UUID for a marking type, which may not always have a relevant entry in our system.';


--
-- TOC entry 4469 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.marking_material_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.marking_material_id IS 'The UUID for a type of material the marking might be made out of.';


--
-- TOC entry 4470 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.primary_colour_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.primary_colour_id IS 'The UUID of the primary colour of this marking. Common for ear tags and collars.';


--
-- TOC entry 4471 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.secondary_colour_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.secondary_colour_id IS 'The UUID of the secondary colour of this marking. Common for describing secondary patterns on a marking.';


--
-- TOC entry 4472 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.text_colour_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.text_colour_id IS 'The UUID describing the colour of the text that occurs on the marking, often related to the identifier field.';


--
-- TOC entry 4473 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.identifier; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.identifier IS 'The identifier for this marking. May contain a mix of letters and numbers.';


--
-- TOC entry 4474 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.frequency; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.frequency IS 'The frequency this marking is broadcasting, often only applicable to PIT tags, microchips, and similar.';


--
-- TOC entry 4475 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.frequency_unit; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.frequency_unit IS 'The units for the frequency value.';


--
-- TOC entry 4476 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking."order"; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking."order" IS 'Still deciding convention for this one.';


--
-- TOC entry 4477 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.comment IS 'Any additional information about this marking.';


--
-- TOC entry 4478 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.attached_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.attached_timestamp IS 'The timestamp for when this marking was attached to the animal. Required for all markings.';


--
-- TOC entry 4479 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.removed_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.removed_timestamp IS 'The timestamp for when this marking was removed. May not always be recorded, or marking may remain on animal.';


--
-- TOC entry 4480 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4481 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4482 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4483 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN marking.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.marking.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 249 (class 1259 OID 41449)
-- Name: measurement_qualitative; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.measurement_qualitative (
    measurement_qualitative_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    taxon_measurement_id uuid NOT NULL,
    capture_id uuid,
    mortality_id uuid,
    qualitative_option_id uuid NOT NULL,
    measurement_comment text,
    measured_timestamp timestamp with time zone,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.measurement_qualitative OWNER TO critterbase;

--
-- TOC entry 4484 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE measurement_qualitative; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.measurement_qualitative IS 'The primary critter ''qualitative measurement'' table. Holds non-numeric measurements / observations.';


--
-- TOC entry 4485 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.measurement_qualitative_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.measurement_qualitative_id IS 'UUID uniquely identifying this measurement.';


--
-- TOC entry 4486 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.critter_id IS 'The critter that this measurement was recorded on.';


--
-- TOC entry 4487 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.taxon_measurement_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.taxon_measurement_id IS 'The taxon measurement that describes what this measurement is, and what qualitative options apply to it.';


--
-- TOC entry 4488 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.capture_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.capture_id IS 'A capture event associated with this measurement.';


--
-- TOC entry 4489 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.mortality_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.mortality_id IS 'A mortality event associated with this measurement.';


--
-- TOC entry 4490 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.qualitative_option_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.qualitative_option_id IS 'The qualitative observation that was recorded as a measurement.';


--
-- TOC entry 4491 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.measurement_comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.measurement_comment IS 'Any additional observations surrounding this measurement.';


--
-- TOC entry 4492 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.measured_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.measured_timestamp IS 'A the date / that the measurement took place.';


--
-- TOC entry 4493 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4494 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4495 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4496 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN measurement_qualitative.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_qualitative.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 250 (class 1259 OID 41464)
-- Name: measurement_quantitative; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.measurement_quantitative (
    measurement_quantitative_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    taxon_measurement_id uuid NOT NULL,
    capture_id uuid,
    mortality_id uuid,
    value double precision NOT NULL,
    measurement_comment text,
    measured_timestamp timestamp with time zone,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.measurement_quantitative OWNER TO critterbase;

--
-- TOC entry 4497 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE measurement_quantitative; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.measurement_quantitative IS 'The primary critter ''quantitative measurement'' table. Holds numeric measurements.';


--
-- TOC entry 4498 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.measurement_quantitative_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.measurement_quantitative_id IS 'UUID uniquely identifying this measurement.';


--
-- TOC entry 4499 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.critter_id IS 'The indivudal critter that this measurement was recorded on.';


--
-- TOC entry 4500 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.taxon_measurement_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.taxon_measurement_id IS 'UUID for the taxon measurement entry which describes what the measurement is.';


--
-- TOC entry 4501 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.capture_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.capture_id IS 'A capture event associated with this measurement.';


--
-- TOC entry 4502 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.mortality_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.mortality_id IS 'A mortality event associated with this measurement.';


--
-- TOC entry 4503 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.value; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.value IS 'The numeric value recorded for this measurement.';


--
-- TOC entry 4504 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.measurement_comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.measurement_comment IS 'Any additional observations about this measurement.';


--
-- TOC entry 4505 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.measured_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.measured_timestamp IS 'A the date / that the measurement took place.';


--
-- TOC entry 4506 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4507 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4508 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4509 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN measurement_quantitative.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.measurement_quantitative.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 255 (class 1259 OID 42337)
-- Name: mortality; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.mortality (
    mortality_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    location_id uuid,
    mortality_timestamp timestamp with time zone NOT NULL,
    proximate_cause_of_death_id uuid NOT NULL,
    proximate_cause_of_death_confidence critterbase.cod_confidence,
    proximate_predated_by_taxon_id uuid,
    ultimate_cause_of_death_id uuid,
    ultimate_cause_of_death_confidence critterbase.cod_confidence,
    ultimate_predated_by_taxon_id uuid,
    mortality_comment text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.mortality OWNER TO critterbase;

--
-- TOC entry 4510 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE mortality; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.mortality IS 'The primary critter ''mortality'' table.';


--
-- TOC entry 4511 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.mortality_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.mortality_id IS 'UUID uniquely identifying this mortality event.';


--
-- TOC entry 4512 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.critter_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.critter_id IS 'The critter that expired in this mortality event.';


--
-- TOC entry 4513 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.location_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.location_id IS 'The UUID of the location data for this mortality event.';


--
-- TOC entry 4514 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.mortality_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.mortality_timestamp IS 'The timestamp for when this mortality event occured. Often only the date will be relevant.';


--
-- TOC entry 4515 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.proximate_cause_of_death_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.proximate_cause_of_death_id IS 'The UUID of the proximate cause of death for this critter.';


--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.proximate_cause_of_death_confidence; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.proximate_cause_of_death_confidence IS 'Enumerated type describing confidence of the proximate cause assessment.';


--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.proximate_predated_by_taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.proximate_predated_by_taxon_id IS 'The UUID for the taxon that most closesly describes what this critter may have been predated by. Should only be filled if proximate cause of death is Predation.';


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.ultimate_cause_of_death_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.ultimate_cause_of_death_id IS 'Should only be filled by qualified users. The UUID of the ultimate cause of death for this critter.';


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.ultimate_cause_of_death_confidence; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.ultimate_cause_of_death_confidence IS 'Should only be filled by qualified users. Enumerated type describing confidence of the ultimate cause of death assessment.';


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.ultimate_predated_by_taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.ultimate_predated_by_taxon_id IS 'Should only be filled by qualified users. The UUID for the taxon that most closesly describes what this critter may have been predated by. Should only be filled if ultimate cause of death is Predation.';


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.mortality_comment; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.mortality_comment IS 'Any additional observations about this mortality event.';


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN mortality.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.mortality.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 257 (class 1259 OID 42420)
-- Name: mortality_v; Type: VIEW; Schema: critterbase; Owner: critterbase
--

CREATE VIEW critterbase.mortality_v AS
 SELECT m.mortality_id,
    m.critter_id,
    m.mortality_timestamp,
    ( SELECT xcodr.cod_category
           FROM critterbase.lk_cause_of_death xcodr
          WHERE (xcodr.cod_id = m.proximate_cause_of_death_id)) AS pcod_category,
    ( SELECT xcodr.cod_reason
           FROM critterbase.lk_cause_of_death xcodr
          WHERE (xcodr.cod_id = m.proximate_cause_of_death_id)) AS pcod_reason,
    m.proximate_cause_of_death_confidence AS pcod_confidence,
    ( SELECT lt.taxon_name_latin
           FROM critterbase.lk_taxon lt
          WHERE (lt.taxon_id = m.proximate_predated_by_taxon_id)) AS pcod_predated_by,
    ( SELECT xcodr.cod_category
           FROM critterbase.lk_cause_of_death xcodr
          WHERE (xcodr.cod_id = m.ultimate_cause_of_death_id)) AS ucod_category,
    ( SELECT xcodr.cod_reason
           FROM critterbase.lk_cause_of_death xcodr
          WHERE (xcodr.cod_id = m.ultimate_cause_of_death_id)) AS ucod_reason,
    m.ultimate_cause_of_death_confidence AS ucod_confidence,
    ( SELECT lt.taxon_name_latin
           FROM critterbase.lk_taxon lt
          WHERE (lt.taxon_id = m.ultimate_predated_by_taxon_id)) AS ucod_predated_by,
    m.mortality_comment,
    cu.system_user_id AS create_user,
    uu.system_user_id AS update_user,
    m.create_timestamp,
    m.update_timestamp
   FROM ((critterbase.mortality m
     LEFT JOIN critterbase."user" cu ON ((cu.user_id = m.create_user)))
     LEFT JOIN critterbase."user" uu ON ((uu.user_id = m.update_user)));


ALTER TABLE critterbase.mortality_v OWNER TO critterbase;

--
-- TOC entry 264 (class 1259 OID 42794)
-- Name: relationship; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.relationship (
    relationship_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    critter_id uuid NOT NULL,
    parent_id uuid,
    child_id uuid,
    sibling_id uuid,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT only_one_relationship CHECK ((num_nonnulls(parent_id, child_id, sibling_id) = 1))
);


ALTER TABLE critterbase.relationship OWNER TO critterbase;

--
-- TOC entry 252 (class 1259 OID 42007)
-- Name: xref_collection_unit; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.xref_collection_unit (
    collection_unit_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    collection_category_id uuid NOT NULL,
    unit_name text NOT NULL,
    description text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.xref_collection_unit OWNER TO critterbase;

--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE xref_collection_unit; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.xref_collection_unit IS 'Cross reference table for collection unit for each taxon.
Collection units are defined internally.';


--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.collection_unit_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.collection_unit_id IS 'The UUID of the associated taxon collection unit.';


--
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.collection_category_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.collection_category_id IS 'The collection category associated to this taxon collection unit entry.';


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.unit_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.unit_name IS 'The name of this collection unit entry.';


--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.description IS 'Any other details about this collection unit entry.';


--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN xref_collection_unit.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_collection_unit.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 265 (class 1259 OID 43131)
-- Name: xref_taxon_collection_category; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.xref_taxon_collection_category (
    collection_category_id uuid NOT NULL,
    taxon_id uuid NOT NULL,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp character varying DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.xref_taxon_collection_category OWNER TO critterbase;

--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE xref_taxon_collection_category; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.xref_taxon_collection_category IS 'Cross reference table for collection category for each taxon.
Collection categories are defined internally.';


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN xref_taxon_collection_category.collection_category_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_collection_category.collection_category_id IS 'UUID uniquely identifying this collection category';


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN xref_taxon_collection_category.taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_collection_category.taxon_id IS 'The taxon level that this collection category applies to. Note that child taxons will inherit this location.';


--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN xref_taxon_collection_category.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_collection_category.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4539 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN xref_taxon_collection_category.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_collection_category.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4540 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN xref_taxon_collection_category.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_collection_category.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4541 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN xref_taxon_collection_category.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_collection_category.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 241 (class 1259 OID 25061)
-- Name: xref_taxon_marking_body_location; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.xref_taxon_marking_body_location (
    taxon_marking_body_location_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    taxon_id uuid NOT NULL,
    body_location text NOT NULL,
    description text,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.xref_taxon_marking_body_location OWNER TO critterbase;

--
-- TOC entry 4542 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE xref_taxon_marking_body_location; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.xref_taxon_marking_body_location IS 'Cross reference table for marking body locations for each taxon.
Marking locations are defined internally.';


--
-- TOC entry 4543 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.taxon_marking_body_location_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.taxon_marking_body_location_id IS 'UUID uniquely identifying this marking location';


--
-- TOC entry 4544 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.taxon_id IS 'The taxon level that this location applies to. Note that child taxons will inherit this location.';


--
-- TOC entry 4545 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.body_location; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.body_location IS 'The name of the location, ie. Left Ear, Neck, Right Foreleg, etc.';


--
-- TOC entry 4546 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.description; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.description IS 'Any additional information about usage of this location.';


--
-- TOC entry 4547 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4548 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4549 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4550 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN xref_taxon_marking_body_location.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_marking_body_location.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 240 (class 1259 OID 25006)
-- Name: xref_taxon_measurement_quantitative; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.xref_taxon_measurement_quantitative (
    taxon_measurement_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    taxon_id uuid NOT NULL,
    measurement_name text NOT NULL,
    measurement_desc text,
    min_value double precision DEFAULT 0,
    max_value double precision,
    unit critterbase.measurement_unit,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.xref_taxon_measurement_quantitative OWNER TO critterbase;

--
-- TOC entry 4551 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE xref_taxon_measurement_quantitative; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.xref_taxon_measurement_quantitative IS 'Cross reference table for empirical measurements for each taxon.
Empirical measurements are defined internally.';


--
-- TOC entry 4552 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.taxon_measurement_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.taxon_measurement_id IS 'UUID uniquely identifying this taxon measurement entry';


--
-- TOC entry 4553 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.taxon_id IS 'The taxon level that this type of measurement should apply to. Note that child taxons will inherit the measurement.';


--
-- TOC entry 4554 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.measurement_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.measurement_name IS 'The name of this type of measurement. Note that the same name can be used across different taxons.';


--
-- TOC entry 4555 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.measurement_desc; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.measurement_desc IS 'Describes how this measurement is recorded. Note that you can use the same name but different descriptions across different taxon.';


--
-- TOC entry 4556 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.min_value; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.min_value IS 'The minimum allowed value for this measurement. When NULL, minimum system supported float value is accepted.';


--
-- TOC entry 4557 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.max_value; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.max_value IS 'The maximum allowed value for this measurement. When NULL, maximum system supported float value is accepted.';


--
-- TOC entry 4558 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.unit; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.unit IS 'Enumerated type for measurement units.';


--
-- TOC entry 4559 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4560 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4561 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4562 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN xref_taxon_measurement_quantitative.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_quantitative.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 244 (class 1259 OID 32851)
-- Name: xref_taxon_measurement_empirical_v; Type: VIEW; Schema: critterbase; Owner: critterbase
--

CREATE VIEW critterbase.xref_taxon_measurement_empirical_v AS
 SELECT xtme.taxon_measurement_id,
    lt.taxon_name_latin,
    xtme.measurement_name,
    xtme.measurement_desc,
    xtme.min_value,
    xtme.max_value,
    xtme.unit,
    xtme.create_user,
    xtme.update_user,
    xtme.create_timestamp,
    xtme.update_timestamp
   FROM (critterbase.xref_taxon_measurement_quantitative xtme
     LEFT JOIN critterbase.lk_taxon lt ON ((xtme.taxon_id = lt.taxon_id)));


ALTER TABLE critterbase.xref_taxon_measurement_empirical_v OWNER TO critterbase;

--
-- TOC entry 4563 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN xref_taxon_measurement_empirical_v.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_empirical_v.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4564 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN xref_taxon_measurement_empirical_v.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_empirical_v.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4565 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN xref_taxon_measurement_empirical_v.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_empirical_v.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4566 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN xref_taxon_measurement_empirical_v.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_empirical_v.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 242 (class 1259 OID 32770)
-- Name: xref_taxon_measurement_qualitative; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.xref_taxon_measurement_qualitative (
    taxon_measurement_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    taxon_id uuid NOT NULL,
    measurement_name character varying NOT NULL,
    measurement_desc character varying,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.xref_taxon_measurement_qualitative OWNER TO critterbase;

--
-- TOC entry 4567 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE xref_taxon_measurement_qualitative; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.xref_taxon_measurement_qualitative IS 'Cross reference table for qualitative measurements for each taxon.
Qualitative measurements are defined internally.';


--
-- TOC entry 4568 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.taxon_measurement_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.taxon_measurement_id IS 'UUID uniquely identifying this taxon measurement entry';


--
-- TOC entry 4569 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.taxon_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.taxon_id IS 'The taxon level that this type of measurement should apply to. Note that child taxons will inherit the measurement.';


--
-- TOC entry 4570 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.measurement_name; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.measurement_name IS 'The name of this type of measurement. Note that the same name can be used across different taxons.';


--
-- TOC entry 4571 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.measurement_desc; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.measurement_desc IS 'Describes how this measurement is recorded. Note that you can use the same name but different descriptions across different taxon.';


--
-- TOC entry 4572 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4573 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4574 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4575 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN xref_taxon_measurement_qualitative.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 243 (class 1259 OID 32788)
-- Name: xref_taxon_measurement_qualitative_option; Type: TABLE; Schema: critterbase; Owner: critterbase
--

CREATE TABLE critterbase.xref_taxon_measurement_qualitative_option (
    qualitative_option_id uuid DEFAULT crypto.gen_random_uuid() NOT NULL,
    taxon_measurement_id uuid NOT NULL,
    option_label text,
    option_value integer NOT NULL,
    option_desc character varying,
    create_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    update_user uuid DEFAULT critterbase.getuserid('SYSTEM'::text) NOT NULL,
    create_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    update_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE critterbase.xref_taxon_measurement_qualitative_option OWNER TO critterbase;

--
-- TOC entry 4576 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE xref_taxon_measurement_qualitative_option; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON TABLE critterbase.xref_taxon_measurement_qualitative_option IS 'Cross reference table for taxon qualitative measurements for each option.
Qaulitative options are defined internally.';


--
-- TOC entry 4577 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.qualitative_option_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.qualitative_option_id IS 'UUID uniquely identifying this qualitative option';


--
-- TOC entry 4578 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.taxon_measurement_id; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.taxon_measurement_id IS 'This row is one of several options for this qualitative taxon measurement.';


--
-- TOC entry 4579 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.option_label; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.option_label IS 'The textual label for this option.';


--
-- TOC entry 4580 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.option_value; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.option_value IS 'The numeric value. Can be used for scale and / or sort order.';


--
-- TOC entry 4581 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.option_desc; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.option_desc IS 'Any addtional information about the meaning of this option.';


--
-- TOC entry 4582 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4583 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4584 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4585 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN xref_taxon_measurement_qualitative_option.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_option.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 246 (class 1259 OID 33489)
-- Name: xref_taxon_measurement_qualitative_v; Type: VIEW; Schema: critterbase; Owner: critterbase
--

CREATE VIEW critterbase.xref_taxon_measurement_qualitative_v AS
 SELECT xtmq.taxon_measurement_id,
    lt.taxon_name_latin,
    xtmq.measurement_name,
    xtmq.measurement_desc,
    xtmqo.option_label,
    xtmqo.option_value,
    xtmq.create_user,
    xtmq.update_user,
    xtmq.create_timestamp,
    xtmq.update_timestamp
   FROM ((critterbase.xref_taxon_measurement_qualitative xtmq
     LEFT JOIN critterbase.xref_taxon_measurement_qualitative_option xtmqo ON ((xtmq.taxon_measurement_id = xtmqo.taxon_measurement_id)))
     LEFT JOIN critterbase.lk_taxon lt ON ((xtmq.taxon_id = lt.taxon_id)));


ALTER TABLE critterbase.xref_taxon_measurement_qualitative_v OWNER TO critterbase;

--
-- TOC entry 4586 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN xref_taxon_measurement_qualitative_v.create_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_v.create_user IS 'The internal UUID for the user who created this row. This should remain unchanged between updates.';


--
-- TOC entry 4587 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN xref_taxon_measurement_qualitative_v.update_user; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_v.update_user IS 'The internal UUID for the user who last updated this row. May differ from create_user.';


--
-- TOC entry 4588 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN xref_taxon_measurement_qualitative_v.create_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_v.create_timestamp IS 'The timestamp for when this row was created. This should remain unchanged between updates.';


--
-- TOC entry 4589 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN xref_taxon_measurement_qualitative_v.update_timestamp; Type: COMMENT; Schema: critterbase; Owner: critterbase
--

COMMENT ON COLUMN critterbase.xref_taxon_measurement_qualitative_v.update_timestamp IS 'The timestamp for when this row was last updated. If it does not differ from create_timestamp, this row has never been updated.';


--
-- TOC entry 3961 (class 2606 OID 41681)
-- Name: artifact artifact_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.artifact
    ADD CONSTRAINT artifact_pk PRIMARY KEY (artifact_id);


--
-- TOC entry 3963 (class 2606 OID 41683)
-- Name: artifact artifact_url_unique; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.artifact
    ADD CONSTRAINT artifact_url_unique UNIQUE (artifact_url);


--
-- TOC entry 3953 (class 2606 OID 41164)
-- Name: audit_log audit_id; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.audit_log
    ADD CONSTRAINT audit_id PRIMARY KEY (audit_log_id);


--
-- TOC entry 3977 (class 2606 OID 42479)
-- Name: capture capture_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT capture_pk PRIMARY KEY (capture_id);


--
-- TOC entry 3967 (class 2606 OID 42060)
-- Name: critter_collection_unit collection_unit_id; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter_collection_unit
    ADD CONSTRAINT collection_unit_id PRIMARY KEY (critter_collection_unit_id);


--
-- TOC entry 3959 (class 2606 OID 41476)
-- Name: measurement_quantitative critter_measurement_empirical_tax_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_quantitative
    ADD CONSTRAINT critter_measurement_empirical_tax_pk PRIMARY KEY (measurement_quantitative_id);


--
-- TOC entry 3957 (class 2606 OID 41461)
-- Name: measurement_qualitative critter_measurement_qualitative_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_qualitative
    ADD CONSTRAINT critter_measurement_qualitative_pk PRIMARY KEY (measurement_qualitative_id);


--
-- TOC entry 3949 (class 2606 OID 32904)
-- Name: critter critter_real_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter
    ADD CONSTRAINT critter_real_pk PRIMARY KEY (critter_id);


--
-- TOC entry 3951 (class 2606 OID 32906)
-- Name: critter critter_un; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter
    ADD CONSTRAINT critter_un UNIQUE (critter_id, taxon_id);


--
-- TOC entry 3919 (class 2606 OID 17343)
-- Name: lk_marking_material critterbase_marking_material_unq; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_material
    ADD CONSTRAINT critterbase_marking_material_unq UNIQUE (material);


--
-- TOC entry 3913 (class 2606 OID 17345)
-- Name: user critterbase_user_system_user_id_unq; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase."user"
    ADD CONSTRAINT critterbase_user_system_user_id_unq UNIQUE (system_user_id);


--
-- TOC entry 3923 (class 2606 OID 17336)
-- Name: lk_colour lk_colour_pkey; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_colour
    ADD CONSTRAINT lk_colour_pkey PRIMARY KEY (colour_id);


--
-- TOC entry 3921 (class 2606 OID 17288)
-- Name: lk_marking_material lk_marking_material_pkey; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_material
    ADD CONSTRAINT lk_marking_material_pkey PRIMARY KEY (marking_material_id);


--
-- TOC entry 3917 (class 2606 OID 17272)
-- Name: lk_marking_type lk_marking_type_pkey; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_type
    ADD CONSTRAINT lk_marking_type_pkey PRIMARY KEY (marking_type_id);


--
-- TOC entry 3931 (class 2606 OID 19681)
-- Name: lk_region_env lk_region_env_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_region_env
    ADD CONSTRAINT lk_region_env_pk PRIMARY KEY (region_env_id);


--
-- TOC entry 3925 (class 2606 OID 18260)
-- Name: lk_region_nr lk_region_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_region_nr
    ADD CONSTRAINT lk_region_pk PRIMARY KEY (region_nr_id);


--
-- TOC entry 3927 (class 2606 OID 19567)
-- Name: lk_wildlife_management_unit lk_wildlife_management_unit_un; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_wildlife_management_unit
    ADD CONSTRAINT lk_wildlife_management_unit_un UNIQUE (wmu_name);


--
-- TOC entry 3985 (class 2606 OID 42637)
-- Name: location location_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT location_pk PRIMARY KEY (location_id);


--
-- TOC entry 3955 (class 2606 OID 41283)
-- Name: marking marking_id; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_id PRIMARY KEY (marking_id);


--
-- TOC entry 3973 (class 2606 OID 42349)
-- Name: mortality mortality_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_pk PRIMARY KEY (mortality_id);


--
-- TOC entry 3975 (class 2606 OID 42409)
-- Name: lk_population_unit_temp newtable_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_population_unit_temp
    ADD CONSTRAINT newtable_pk PRIMARY KEY (population_unit_id);


--
-- TOC entry 3929 (class 2606 OID 18337)
-- Name: lk_wildlife_management_unit pk_lk_wildlife_management_unit; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_wildlife_management_unit
    ADD CONSTRAINT pk_lk_wildlife_management_unit PRIMARY KEY (wmu_id);


--
-- TOC entry 3945 (class 2606 OID 32800)
-- Name: xref_taxon_measurement_qualitative_option qualitative_option_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative_option
    ADD CONSTRAINT qualitative_option_pk PRIMARY KEY (qualitative_option_id);


--
-- TOC entry 3947 (class 2606 OID 32802)
-- Name: xref_taxon_measurement_qualitative_option qualitative_option_un; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative_option
    ADD CONSTRAINT qualitative_option_un UNIQUE (qualitative_option_id, taxon_measurement_id);


--
-- TOC entry 3987 (class 2606 OID 42872)
-- Name: relationship relationship_critter_id_child_id_key; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_critter_id_child_id_key UNIQUE (critter_id, child_id);


--
-- TOC entry 3989 (class 2606 OID 42870)
-- Name: relationship relationship_critter_id_parent_id_key; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_critter_id_parent_id_key UNIQUE (critter_id, parent_id);


--
-- TOC entry 3991 (class 2606 OID 42874)
-- Name: relationship relationship_critter_id_sibling_id_key; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_critter_id_sibling_id_key UNIQUE (critter_id, sibling_id);


--
-- TOC entry 3993 (class 2606 OID 42799)
-- Name: relationship relationship_id; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_id PRIMARY KEY (relationship_id);


--
-- TOC entry 3983 (class 2606 OID 42552)
-- Name: family sibling_group_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.family
    ADD CONSTRAINT sibling_group_pk PRIMARY KEY (family_id);


--
-- TOC entry 3937 (class 2606 OID 25017)
-- Name: xref_taxon_measurement_quantitative taxon_measurement_empirical_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_quantitative
    ADD CONSTRAINT taxon_measurement_empirical_pk PRIMARY KEY (taxon_measurement_id);


--
-- TOC entry 3943 (class 2606 OID 32782)
-- Name: xref_taxon_measurement_qualitative taxon_measurement_qualitative_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative
    ADD CONSTRAINT taxon_measurement_qualitative_pk PRIMARY KEY (taxon_measurement_id);


--
-- TOC entry 3935 (class 2606 OID 24951)
-- Name: lk_taxon taxon_pkey; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT taxon_pkey PRIMARY KEY (taxon_id);


--
-- TOC entry 3915 (class 2606 OID 17261)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3933 (class 2606 OID 19718)
-- Name: lk_cause_of_death xref_cause_of_death_reason_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_cause_of_death
    ADD CONSTRAINT xref_cause_of_death_reason_pk PRIMARY KEY (cod_id);


--
-- TOC entry 3979 (class 2606 OID 42529)
-- Name: family_child xref_sibling_group_children_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.family_child
    ADD CONSTRAINT xref_sibling_group_children_pk PRIMARY KEY (family_id, child_critter_id);


--
-- TOC entry 3981 (class 2606 OID 42534)
-- Name: family_parent xref_sibling_group_parent_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.family_parent
    ADD CONSTRAINT xref_sibling_group_parent_pk PRIMARY KEY (family_id, parent_critter_id);


--
-- TOC entry 3965 (class 2606 OID 42019)
-- Name: xref_collection_unit xref_species_collection_unit_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_collection_unit
    ADD CONSTRAINT xref_species_collection_unit_pk PRIMARY KEY (collection_unit_id);


--
-- TOC entry 3939 (class 2606 OID 25073)
-- Name: xref_taxon_marking_body_location xref_species_marking_location_pkey; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_marking_body_location
    ADD CONSTRAINT xref_species_marking_location_pkey PRIMARY KEY (taxon_marking_body_location_id);


--
-- TOC entry 3941 (class 2606 OID 25075)
-- Name: xref_taxon_marking_body_location xref_species_marking_location_un; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_marking_body_location
    ADD CONSTRAINT xref_species_marking_location_un UNIQUE (taxon_id, body_location);


--
-- TOC entry 3969 (class 2606 OID 42147)
-- Name: lk_collection_category xref_taxon_collection_category_category_name_key; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_collection_category
    ADD CONSTRAINT xref_taxon_collection_category_category_name_key UNIQUE (category_name);


--
-- TOC entry 3995 (class 2606 OID 43142)
-- Name: xref_taxon_collection_category xref_taxon_collection_category_pk; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_collection_category
    ADD CONSTRAINT xref_taxon_collection_category_pk PRIMARY KEY (collection_category_id, taxon_id);


--
-- TOC entry 3971 (class 2606 OID 42145)
-- Name: lk_collection_category xref_taxon_collection_category_pkey; Type: CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_collection_category
    ADD CONSTRAINT xref_taxon_collection_category_pkey PRIMARY KEY (collection_category_id);


--
-- TOC entry 4133 (class 2620 OID 42490)
-- Name: capture populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.capture FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4123 (class 2620 OID 41206)
-- Name: critter populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.critter FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4130 (class 2620 OID 42066)
-- Name: critter_collection_unit populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.critter_collection_unit FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4117 (class 2620 OID 41205)
-- Name: lk_cause_of_death populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_cause_of_death FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4131 (class 2620 OID 42148)
-- Name: lk_collection_category populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_collection_category FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4113 (class 2620 OID 41182)
-- Name: lk_colour populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_colour FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4112 (class 2620 OID 41207)
-- Name: lk_marking_material populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_marking_material FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4111 (class 2620 OID 41208)
-- Name: lk_marking_type populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_marking_type FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4116 (class 2620 OID 41209)
-- Name: lk_region_env populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_region_env FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4114 (class 2620 OID 41210)
-- Name: lk_region_nr populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_region_nr FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4118 (class 2620 OID 41211)
-- Name: lk_taxon populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_taxon FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4115 (class 2620 OID 41212)
-- Name: lk_wildlife_management_unit populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.lk_wildlife_management_unit FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4135 (class 2620 OID 42638)
-- Name: location populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.location FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4125 (class 2620 OID 41289)
-- Name: marking populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.marking FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4127 (class 2620 OID 41463)
-- Name: measurement_qualitative populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.measurement_qualitative FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4129 (class 2620 OID 41478)
-- Name: measurement_quantitative populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.measurement_quantitative FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4132 (class 2620 OID 42355)
-- Name: mortality populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.mortality FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4110 (class 2620 OID 41218)
-- Name: user populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase."user" FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4120 (class 2620 OID 41219)
-- Name: xref_taxon_marking_body_location populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.xref_taxon_marking_body_location FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4121 (class 2620 OID 41221)
-- Name: xref_taxon_measurement_qualitative populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.xref_taxon_measurement_qualitative FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4122 (class 2620 OID 41222)
-- Name: xref_taxon_measurement_qualitative_option populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.xref_taxon_measurement_qualitative_option FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4119 (class 2620 OID 41220)
-- Name: xref_taxon_measurement_quantitative populate_audit_cols; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_audit_cols BEFORE INSERT OR DELETE OR UPDATE ON critterbase.xref_taxon_measurement_quantitative FOR EACH ROW EXECUTE FUNCTION critterbase.trg_audit_trigger();


--
-- TOC entry 4136 (class 2620 OID 42878)
-- Name: relationship populate_inverse_relationship; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_inverse_relationship BEFORE INSERT OR UPDATE ON critterbase.relationship FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION critterbase.trg_inverse_relationship();


--
-- TOC entry 4134 (class 2620 OID 42726)
-- Name: capture populate_release_location; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER populate_release_location BEFORE INSERT ON critterbase.capture FOR EACH ROW EXECUTE FUNCTION critterbase.trg_default_release_location();


--
-- TOC entry 4124 (class 2620 OID 32907)
-- Name: critter trg_critter_collection_unit_upsert; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER trg_critter_collection_unit_upsert BEFORE INSERT OR UPDATE ON critterbase.critter FOR EACH ROW EXECUTE FUNCTION critterbase.trg_critter_collection_unit_upsert();


--
-- TOC entry 4128 (class 2620 OID 41477)
-- Name: measurement_quantitative trg_measurement_empirical_tax_upsert; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER trg_measurement_empirical_tax_upsert BEFORE INSERT OR UPDATE ON critterbase.measurement_quantitative FOR EACH ROW EXECUTE FUNCTION critterbase.trg_measurement_quantitative_upsert();


--
-- TOC entry 4126 (class 2620 OID 41462)
-- Name: measurement_qualitative trg_measurement_qualitative_upsert; Type: TRIGGER; Schema: critterbase; Owner: critterbase
--

CREATE TRIGGER trg_measurement_qualitative_upsert BEFORE INSERT OR UPDATE ON critterbase.measurement_qualitative FOR EACH ROW EXECUTE FUNCTION critterbase.trg_measurement_qualitative_upsert();


--
-- TOC entry 4063 (class 2606 OID 41709)
-- Name: artifact artifact_create_user_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.artifact
    ADD CONSTRAINT artifact_create_user_fkey FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4060 (class 2606 OID 41684)
-- Name: artifact artifact_critter_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.artifact
    ADD CONSTRAINT artifact_critter_id_fkey FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4061 (class 2606 OID 41699)
-- Name: artifact artifact_measurement_qualitative_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.artifact
    ADD CONSTRAINT artifact_measurement_qualitative_fkey FOREIGN KEY (measurement_qualitative) REFERENCES critterbase.measurement_qualitative(measurement_qualitative_id);


--
-- TOC entry 4062 (class 2606 OID 41704)
-- Name: artifact artifact_measurement_quantitative_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.artifact
    ADD CONSTRAINT artifact_measurement_quantitative_fkey FOREIGN KEY (measurement_quantitative) REFERENCES critterbase.measurement_quantitative(measurement_quantitative_id);


--
-- TOC entry 4064 (class 2606 OID 41714)
-- Name: artifact artifact_update_user_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.artifact
    ADD CONSTRAINT artifact_update_user_fkey FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4089 (class 2606 OID 42674)
-- Name: capture capture_cap_location_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT capture_cap_location_fk FOREIGN KEY (capture_location_id) REFERENCES critterbase.location(location_id);


--
-- TOC entry 4084 (class 2606 OID 42491)
-- Name: capture capture_cu_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT capture_cu_fk FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4085 (class 2606 OID 42496)
-- Name: capture capture_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT capture_fk FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4090 (class 2606 OID 42679)
-- Name: capture capture_rel_location_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT capture_rel_location_fk FOREIGN KEY (release_location_id) REFERENCES critterbase.location(location_id);


--
-- TOC entry 4086 (class 2606 OID 42501)
-- Name: capture capture_uu_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT capture_uu_fk FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4071 (class 2606 OID 42077)
-- Name: critter_collection_unit collection_unit_critter_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter_collection_unit
    ADD CONSTRAINT collection_unit_critter_id_fkey FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4068 (class 2606 OID 42061)
-- Name: critter_collection_unit collection_unit_taxon_collection_unit_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter_collection_unit
    ADD CONSTRAINT collection_unit_taxon_collection_unit_id_fkey FOREIGN KEY (collection_unit_id) REFERENCES critterbase.xref_collection_unit(collection_unit_id);


--
-- TOC entry 4054 (class 2606 OID 41479)
-- Name: measurement_qualitative critter_measurement_qualitative_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_qualitative
    ADD CONSTRAINT critter_measurement_qualitative_fk FOREIGN KEY (qualitative_option_id, taxon_measurement_id) REFERENCES critterbase.xref_taxon_measurement_qualitative_option(qualitative_option_id, taxon_measurement_id);


--
-- TOC entry 4039 (class 2606 OID 32923)
-- Name: critter critter_nrr_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter
    ADD CONSTRAINT critter_nrr_fk FOREIGN KEY (responsible_region_nr_id) REFERENCES critterbase.lk_region_nr(region_nr_id);


--
-- TOC entry 4040 (class 2606 OID 32928)
-- Name: critter critter_taxon_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter
    ADD CONSTRAINT critter_taxon_fk FOREIGN KEY (taxon_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4043 (class 2606 OID 41719)
-- Name: audit_log fk_audit_log_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.audit_log
    ADD CONSTRAINT fk_audit_log_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4044 (class 2606 OID 41724)
-- Name: audit_log fk_audit_log_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.audit_log
    ADD CONSTRAINT fk_audit_log_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4087 (class 2606 OID 42506)
-- Name: capture fk_capture_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT fk_capture_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4088 (class 2606 OID 42511)
-- Name: capture fk_capture_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.capture
    ADD CONSTRAINT fk_capture_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4069 (class 2606 OID 42067)
-- Name: critter_collection_unit fk_collection_unit_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter_collection_unit
    ADD CONSTRAINT fk_collection_unit_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4070 (class 2606 OID 42072)
-- Name: critter_collection_unit fk_collection_unit_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter_collection_unit
    ADD CONSTRAINT fk_collection_unit_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4041 (class 2606 OID 41739)
-- Name: critter fk_critter_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter
    ADD CONSTRAINT fk_critter_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4042 (class 2606 OID 41744)
-- Name: critter fk_critter_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.critter
    ADD CONSTRAINT fk_critter_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4013 (class 2606 OID 41749)
-- Name: lk_cause_of_death fk_lk_cause_of_death_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_cause_of_death
    ADD CONSTRAINT fk_lk_cause_of_death_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4014 (class 2606 OID 41754)
-- Name: lk_cause_of_death fk_lk_cause_of_death_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_cause_of_death
    ADD CONSTRAINT fk_lk_cause_of_death_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4005 (class 2606 OID 41759)
-- Name: lk_colour fk_lk_colour_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_colour
    ADD CONSTRAINT fk_lk_colour_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4006 (class 2606 OID 41764)
-- Name: lk_colour fk_lk_colour_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_colour
    ADD CONSTRAINT fk_lk_colour_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4002 (class 2606 OID 41769)
-- Name: lk_marking_material fk_lk_marking_material_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_material
    ADD CONSTRAINT fk_lk_marking_material_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4003 (class 2606 OID 41774)
-- Name: lk_marking_material fk_lk_marking_material_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_material
    ADD CONSTRAINT fk_lk_marking_material_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 3999 (class 2606 OID 41779)
-- Name: lk_marking_type fk_lk_marking_type_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_type
    ADD CONSTRAINT fk_lk_marking_type_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4000 (class 2606 OID 41784)
-- Name: lk_marking_type fk_lk_marking_type_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_type
    ADD CONSTRAINT fk_lk_marking_type_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4011 (class 2606 OID 41789)
-- Name: lk_region_env fk_lk_region_env_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_region_env
    ADD CONSTRAINT fk_lk_region_env_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4012 (class 2606 OID 41794)
-- Name: lk_region_env fk_lk_region_env_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_region_env
    ADD CONSTRAINT fk_lk_region_env_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4007 (class 2606 OID 41799)
-- Name: lk_region_nr fk_lk_region_nr_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_region_nr
    ADD CONSTRAINT fk_lk_region_nr_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4008 (class 2606 OID 41804)
-- Name: lk_region_nr fk_lk_region_nr_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_region_nr
    ADD CONSTRAINT fk_lk_region_nr_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4022 (class 2606 OID 41809)
-- Name: lk_taxon fk_lk_taxon_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT fk_lk_taxon_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4023 (class 2606 OID 41814)
-- Name: lk_taxon fk_lk_taxon_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT fk_lk_taxon_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4009 (class 2606 OID 41819)
-- Name: lk_wildlife_management_unit fk_lk_wildlife_management_unit_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_wildlife_management_unit
    ADD CONSTRAINT fk_lk_wildlife_management_unit_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4010 (class 2606 OID 41824)
-- Name: lk_wildlife_management_unit fk_lk_wildlife_management_unit_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_wildlife_management_unit
    ADD CONSTRAINT fk_lk_wildlife_management_unit_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4095 (class 2606 OID 42639)
-- Name: location fk_location_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT fk_location_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4096 (class 2606 OID 42644)
-- Name: location fk_location_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT fk_location_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4045 (class 2606 OID 41829)
-- Name: marking fk_marking_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT fk_marking_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4046 (class 2606 OID 41834)
-- Name: marking fk_marking_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT fk_marking_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4056 (class 2606 OID 41839)
-- Name: measurement_qualitative fk_measurement_qualitative_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_qualitative
    ADD CONSTRAINT fk_measurement_qualitative_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4057 (class 2606 OID 41844)
-- Name: measurement_qualitative fk_measurement_qualitative_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_qualitative
    ADD CONSTRAINT fk_measurement_qualitative_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4074 (class 2606 OID 42356)
-- Name: mortality fk_mortality_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT fk_mortality_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4075 (class 2606 OID 42361)
-- Name: mortality fk_mortality_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT fk_mortality_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 3996 (class 2606 OID 41859)
-- Name: user fk_user_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase."user"
    ADD CONSTRAINT fk_user_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 3997 (class 2606 OID 41864)
-- Name: user fk_user_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase."user"
    ADD CONSTRAINT fk_user_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4097 (class 2606 OID 42649)
-- Name: location fk_wmu_id_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT fk_wmu_id_user FOREIGN KEY (wmu_id) REFERENCES critterbase.lk_wildlife_management_unit(wmu_id);


--
-- TOC entry 4065 (class 2606 OID 43153)
-- Name: xref_collection_unit fk_xref_collection_unit_category; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_collection_unit
    ADD CONSTRAINT fk_xref_collection_unit_category FOREIGN KEY (collection_category_id) REFERENCES critterbase.lk_collection_category(collection_category_id);


--
-- TOC entry 4066 (class 2606 OID 42028)
-- Name: xref_collection_unit fk_xref_collection_unit_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_collection_unit
    ADD CONSTRAINT fk_xref_collection_unit_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4067 (class 2606 OID 42033)
-- Name: xref_collection_unit fk_xref_collection_unit_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_collection_unit
    ADD CONSTRAINT fk_xref_collection_unit_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4072 (class 2606 OID 42149)
-- Name: lk_collection_category fk_xref_taxon_collection_category_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_collection_category
    ADD CONSTRAINT fk_xref_taxon_collection_category_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4073 (class 2606 OID 42154)
-- Name: lk_collection_category fk_xref_taxon_collection_category_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_collection_category
    ADD CONSTRAINT fk_xref_taxon_collection_category_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4031 (class 2606 OID 41879)
-- Name: xref_taxon_marking_body_location fk_xref_taxon_marking_location_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_marking_body_location
    ADD CONSTRAINT fk_xref_taxon_marking_location_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4032 (class 2606 OID 41884)
-- Name: xref_taxon_marking_body_location fk_xref_taxon_marking_location_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_marking_body_location
    ADD CONSTRAINT fk_xref_taxon_marking_location_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4034 (class 2606 OID 41889)
-- Name: xref_taxon_measurement_qualitative fk_xref_taxon_measurement_qualitative_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative
    ADD CONSTRAINT fk_xref_taxon_measurement_qualitative_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4037 (class 2606 OID 41899)
-- Name: xref_taxon_measurement_qualitative_option fk_xref_taxon_measurement_qualitative_option_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative_option
    ADD CONSTRAINT fk_xref_taxon_measurement_qualitative_option_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4038 (class 2606 OID 41904)
-- Name: xref_taxon_measurement_qualitative_option fk_xref_taxon_measurement_qualitative_option_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative_option
    ADD CONSTRAINT fk_xref_taxon_measurement_qualitative_option_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4033 (class 2606 OID 43091)
-- Name: xref_taxon_measurement_qualitative fk_xref_taxon_measurement_qualitative_taxon; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative
    ADD CONSTRAINT fk_xref_taxon_measurement_qualitative_taxon FOREIGN KEY (taxon_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4035 (class 2606 OID 41894)
-- Name: xref_taxon_measurement_qualitative fk_xref_taxon_measurement_qualitative_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative
    ADD CONSTRAINT fk_xref_taxon_measurement_qualitative_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4027 (class 2606 OID 41909)
-- Name: xref_taxon_measurement_quantitative fk_xref_taxon_measurement_quantitative_create_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_quantitative
    ADD CONSTRAINT fk_xref_taxon_measurement_quantitative_create_user FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4028 (class 2606 OID 41914)
-- Name: xref_taxon_measurement_quantitative fk_xref_taxon_measurement_quantitative_update_user; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_quantitative
    ADD CONSTRAINT fk_xref_taxon_measurement_quantitative_update_user FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4004 (class 2606 OID 17337)
-- Name: lk_colour lk_colour_created_user_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_colour
    ADD CONSTRAINT lk_colour_created_user_id_fkey FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4001 (class 2606 OID 17289)
-- Name: lk_marking_material lk_marking_material_created_user_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_material
    ADD CONSTRAINT lk_marking_material_created_user_id_fkey FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 3998 (class 2606 OID 17273)
-- Name: lk_marking_type lk_marking_type_created_user_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_marking_type
    ADD CONSTRAINT lk_marking_type_created_user_id_fkey FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4015 (class 2606 OID 24952)
-- Name: lk_taxon lk_taxon_class_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_class_id_fkey FOREIGN KEY (class_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4016 (class 2606 OID 24957)
-- Name: lk_taxon lk_taxon_create_user_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_create_user_fkey FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4017 (class 2606 OID 24962)
-- Name: lk_taxon lk_taxon_family_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_family_id_fkey FOREIGN KEY (family_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4018 (class 2606 OID 24967)
-- Name: lk_taxon lk_taxon_genus_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_genus_id_fkey FOREIGN KEY (genus_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4019 (class 2606 OID 24972)
-- Name: lk_taxon lk_taxon_kingdom_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_kingdom_id_fkey FOREIGN KEY (kingdom_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4020 (class 2606 OID 24977)
-- Name: lk_taxon lk_taxon_order_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_order_id_fkey FOREIGN KEY (order_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4021 (class 2606 OID 24982)
-- Name: lk_taxon lk_taxon_phylum_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_phylum_id_fkey FOREIGN KEY (phylum_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4024 (class 2606 OID 24987)
-- Name: lk_taxon lk_taxon_species_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_species_id_fkey FOREIGN KEY (species_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4025 (class 2606 OID 24992)
-- Name: lk_taxon lk_taxon_sub_species_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_sub_species_id_fkey FOREIGN KEY (sub_species_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4026 (class 2606 OID 24997)
-- Name: lk_taxon lk_taxon_update_user_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.lk_taxon
    ADD CONSTRAINT lk_taxon_update_user_fkey FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4098 (class 2606 OID 42654)
-- Name: location location_env_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT location_env_fk FOREIGN KEY (region_env_id) REFERENCES critterbase.lk_region_env(region_env_id);


--
-- TOC entry 4099 (class 2606 OID 42659)
-- Name: location location_nrr_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT location_nrr_fk FOREIGN KEY (region_nr_id) REFERENCES critterbase.lk_region_nr(region_nr_id);


--
-- TOC entry 4100 (class 2606 OID 42664)
-- Name: location location_uu_fk_1; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT location_uu_fk_1 FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4101 (class 2606 OID 42669)
-- Name: location location_wmu_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.location
    ADD CONSTRAINT location_wmu_id_fkey FOREIGN KEY (wmu_id) REFERENCES critterbase.lk_wildlife_management_unit(wmu_id);


--
-- TOC entry 4047 (class 2606 OID 41295)
-- Name: marking marking_critter_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_critter_id_fkey FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4048 (class 2606 OID 41300)
-- Name: marking marking_marking_material_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_marking_material_id_fkey FOREIGN KEY (marking_material_id) REFERENCES critterbase.lk_marking_material(marking_material_id);


--
-- TOC entry 4049 (class 2606 OID 41305)
-- Name: marking marking_marking_type_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_marking_type_id_fkey FOREIGN KEY (marking_type_id) REFERENCES critterbase.lk_marking_type(marking_type_id);


--
-- TOC entry 4050 (class 2606 OID 41310)
-- Name: marking marking_primary_colour_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_primary_colour_id_fkey FOREIGN KEY (primary_colour_id) REFERENCES critterbase.lk_colour(colour_id);


--
-- TOC entry 4051 (class 2606 OID 41315)
-- Name: marking marking_secondary_colour_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_secondary_colour_id_fkey FOREIGN KEY (secondary_colour_id) REFERENCES critterbase.lk_colour(colour_id);


--
-- TOC entry 4052 (class 2606 OID 41320)
-- Name: marking marking_taxon_marking_location_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_taxon_marking_location_id_fkey FOREIGN KEY (taxon_marking_body_location_id) REFERENCES critterbase.xref_taxon_marking_body_location(taxon_marking_body_location_id);


--
-- TOC entry 4053 (class 2606 OID 41325)
-- Name: marking marking_text_colour_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.marking
    ADD CONSTRAINT marking_text_colour_id_fkey FOREIGN KEY (text_colour_id) REFERENCES critterbase.lk_colour(colour_id);


--
-- TOC entry 4058 (class 2606 OID 41499)
-- Name: measurement_quantitative measurement_empirical_critter_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_quantitative
    ADD CONSTRAINT measurement_empirical_critter_fk FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4059 (class 2606 OID 41504)
-- Name: measurement_quantitative measurement_empirical_tax_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_quantitative
    ADD CONSTRAINT measurement_empirical_tax_fk FOREIGN KEY (taxon_measurement_id) REFERENCES critterbase.xref_taxon_measurement_quantitative(taxon_measurement_id);


--
-- TOC entry 4055 (class 2606 OID 41489)
-- Name: measurement_qualitative measurement_qualitative_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.measurement_qualitative
    ADD CONSTRAINT measurement_qualitative_fk FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4076 (class 2606 OID 42366)
-- Name: mortality mortality_cu_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_cu_fk FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4077 (class 2606 OID 42371)
-- Name: mortality mortality_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_fk FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4083 (class 2606 OID 42684)
-- Name: mortality mortality_location_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_location_fk FOREIGN KEY (location_id) REFERENCES critterbase.location(location_id);


--
-- TOC entry 4078 (class 2606 OID 42376)
-- Name: mortality mortality_pcod_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_pcod_fk FOREIGN KEY (proximate_cause_of_death_id) REFERENCES critterbase.lk_cause_of_death(cod_id);


--
-- TOC entry 4079 (class 2606 OID 42381)
-- Name: mortality mortality_pcod_taxon_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_pcod_taxon_fk FOREIGN KEY (proximate_predated_by_taxon_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4080 (class 2606 OID 42386)
-- Name: mortality mortality_ucod_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_ucod_fk FOREIGN KEY (ultimate_cause_of_death_id) REFERENCES critterbase.lk_cause_of_death(cod_id);


--
-- TOC entry 4081 (class 2606 OID 42391)
-- Name: mortality mortality_ucod_taxon_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_ucod_taxon_fk FOREIGN KEY (ultimate_predated_by_taxon_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4082 (class 2606 OID 42396)
-- Name: mortality mortality_uu_fk_1; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.mortality
    ADD CONSTRAINT mortality_uu_fk_1 FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4036 (class 2606 OID 32803)
-- Name: xref_taxon_measurement_qualitative_option qualitative_option_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_qualitative_option
    ADD CONSTRAINT qualitative_option_fk FOREIGN KEY (taxon_measurement_id) REFERENCES critterbase.xref_taxon_measurement_qualitative(taxon_measurement_id);


--
-- TOC entry 4104 (class 2606 OID 42810)
-- Name: relationship relationship_child_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_child_id_fkey FOREIGN KEY (child_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4106 (class 2606 OID 42897)
-- Name: relationship relationship_create_user_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_create_user_fkey FOREIGN KEY (create_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4102 (class 2606 OID 42800)
-- Name: relationship relationship_critter_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_critter_id_fkey FOREIGN KEY (critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4103 (class 2606 OID 42805)
-- Name: relationship relationship_parent_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4105 (class 2606 OID 42815)
-- Name: relationship relationship_sibling_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_sibling_id_fkey FOREIGN KEY (sibling_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4107 (class 2606 OID 42902)
-- Name: relationship relationship_update_user_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.relationship
    ADD CONSTRAINT relationship_update_user_fkey FOREIGN KEY (update_user) REFERENCES critterbase."user"(user_id);


--
-- TOC entry 4029 (class 2606 OID 25018)
-- Name: xref_taxon_measurement_quantitative taxon_measurement_empirical_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_measurement_quantitative
    ADD CONSTRAINT taxon_measurement_empirical_fk FOREIGN KEY (taxon_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4092 (class 2606 OID 42567)
-- Name: family_child xref_sibling_group_children_critter_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.family_child
    ADD CONSTRAINT xref_sibling_group_children_critter_fk FOREIGN KEY (child_critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4091 (class 2606 OID 42562)
-- Name: family_child xref_sibling_group_children_group_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.family_child
    ADD CONSTRAINT xref_sibling_group_children_group_fk FOREIGN KEY (family_id) REFERENCES critterbase.family(family_id);


--
-- TOC entry 4094 (class 2606 OID 42577)
-- Name: family_parent xref_sibling_group_parent_critter_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.family_parent
    ADD CONSTRAINT xref_sibling_group_parent_critter_fk FOREIGN KEY (parent_critter_id) REFERENCES critterbase.critter(critter_id);


--
-- TOC entry 4093 (class 2606 OID 42572)
-- Name: family_parent xref_sibling_group_parent_group_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.family_parent
    ADD CONSTRAINT xref_sibling_group_parent_group_fk FOREIGN KEY (family_id) REFERENCES critterbase.family(family_id);


--
-- TOC entry 4108 (class 2606 OID 43143)
-- Name: xref_taxon_collection_category xref_taxon_collection_category_category_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_collection_category
    ADD CONSTRAINT xref_taxon_collection_category_category_fk FOREIGN KEY (collection_category_id) REFERENCES critterbase.lk_collection_category(collection_category_id);


--
-- TOC entry 4109 (class 2606 OID 43148)
-- Name: xref_taxon_collection_category xref_taxon_collection_category_taxon_fk; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_collection_category
    ADD CONSTRAINT xref_taxon_collection_category_taxon_fk FOREIGN KEY (taxon_id) REFERENCES critterbase.lk_taxon(taxon_id);


--
-- TOC entry 4030 (class 2606 OID 25076)
-- Name: xref_taxon_marking_body_location xref_taxon_marking_location_taxon_id_fkey; Type: FK CONSTRAINT; Schema: critterbase; Owner: critterbase
--

ALTER TABLE ONLY critterbase.xref_taxon_marking_body_location
    ADD CONSTRAINT xref_taxon_marking_location_taxon_id_fkey FOREIGN KEY (taxon_id) REFERENCES critterbase.lk_taxon(taxon_id);


-- Completed on 2023-03-08 15:49:11

--
-- PostgreSQL database dump complete
--

