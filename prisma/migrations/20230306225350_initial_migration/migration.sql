CREATE SCHEMA IF NOT EXISTS "crypto";
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "crypto";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";

CREATE OR REPLACE FUNCTION critterbase.api_get_context_user_id()
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.api_get_context_user_id() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.api_get_context_user_id() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.api_set_context(_system_user_id text, _system_name text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET client_min_messages TO 'warning'
AS $function$
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
END;$function$
;

-- Permissions

ALTER FUNCTION critterbase.api_set_context(text, text) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.api_set_context(text, text) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.check_latitude_range(lat double precision)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.check_latitude_range(float8) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.check_latitude_range(float8) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.check_longitude_range(lon double precision)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.check_longitude_range(float8) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.check_longitude_range(float8) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.get_env_region_id(regionname text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.get_env_region_id(text) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.get_env_region_id(text) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.get_nr_region_id(regionname text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.get_nr_region_id(text) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.get_nr_region_id(text) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.get_table_primary_key(table_name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.get_table_primary_key(text) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.get_table_primary_key(text) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.get_taxon_ids(t_id text)
 RETURNS uuid[]
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.get_taxon_ids(text) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.get_taxon_ids(text) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.get_taxon_ids(t_id uuid)
 RETURNS uuid[]
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.get_taxon_ids(uuid) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.get_taxon_ids(uuid) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.getuserid(sys_user_id text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.getuserid(text) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.getuserid(text) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.isbetween(val double precision, low_limit double precision, high_limit double precision)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.isbetween(float8, float8, float8) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.isbetween(float8, float8, float8) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.postgres_fdw_handler()
 RETURNS fdw_handler
 LANGUAGE c
 STRICT
AS '$libdir/postgres_fdw', $function$postgres_fdw_handler$function$
;

-- Permissions

ALTER FUNCTION critterbase.postgres_fdw_handler() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.postgres_fdw_handler() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.postgres_fdw_validator(text[], oid)
 RETURNS void
 LANGUAGE c
 STRICT
AS '$libdir/postgres_fdw', $function$postgres_fdw_validator$function$
;

-- Permissions

ALTER FUNCTION critterbase.postgres_fdw_validator(_text, oid) OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.postgres_fdw_validator(_text, oid) TO critterbase;

CREATE OR REPLACE PROCEDURE critterbase.restore_audit_log(archive_version_id uuid, select_before boolean)
 LANGUAGE plpgsql
AS $procedure$
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
$procedure$
;

-- Permissions

ALTER PROCEDURE critterbase.restore_audit_log(uuid, bool) OWNER TO critterbase;
GRANT ALL ON PROCEDURE critterbase.restore_audit_log(uuid, bool) TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_audit_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SET client_min_messages TO 'warning'
AS $function$
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

$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_audit_trigger() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_audit_trigger() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_critter_collection_unit_upsert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_critter_collection_unit_upsert() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_critter_collection_unit_upsert() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_default_release_location()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_default_release_location() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_default_release_location() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_inverse_relationship()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_inverse_relationship() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_inverse_relationship() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_log_record()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_log_record() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_log_record() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_measurement_qualitative_upsert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_measurement_qualitative_upsert() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_measurement_qualitative_upsert() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_measurement_quantitative_upsert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_measurement_quantitative_upsert() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_measurement_quantitative_upsert() TO critterbase;

CREATE OR REPLACE FUNCTION critterbase.trg_xref_taxon_collection_unit_upsert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION critterbase.trg_xref_taxon_collection_unit_upsert() OWNER TO critterbase;
GRANT ALL ON FUNCTION critterbase.trg_xref_taxon_collection_unit_upsert() TO critterbase;


-- CreateEnum
CREATE TYPE "cod_confidence" AS ENUM ('Probable', 'Definite');

-- CreateEnum
CREATE TYPE "coordinate_uncertainty_unit" AS ENUM ('m');

-- CreateEnum
CREATE TYPE "frequency_unit" AS ENUM ('Hz', 'KHz', 'MHz');

-- CreateEnum
CREATE TYPE "measurement_unit" AS ENUM ('millimeter', 'centimeter', 'meter', 'milligram', 'gram', 'kilogram');

-- CreateEnum
CREATE TYPE "sex" AS ENUM ('Male', 'Female', 'Unknown', 'Hermaphroditic');

-- CreateTable
CREATE TABLE "artifact" (
    "artifact_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "artifact_url" TEXT NOT NULL,
    "artifact_comment" TEXT,
    "capture_id" UUID,
    "mortality_id" UUID,
    "measurement_qualitative" UUID,
    "measurement_quantitative" UUID,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artifact_pk" PRIMARY KEY ("artifact_id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "audit_log_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "table_name" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "before_value" JSONB,
    "after_value" JSONB,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_id" PRIMARY KEY ("audit_log_id")
);

-- CreateTable
CREATE TABLE "capture" (
    "capture_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "capture_location_id" UUID,
    "release_location_id" UUID,
    "capture_timestamp" TIMESTAMPTZ(6) NOT NULL,
    "release_timestamp" TIMESTAMPTZ(6),
    "capture_comment" TEXT,
    "release_comment" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capture_pk" PRIMARY KEY ("capture_id")
);

-- CreateTable
CREATE TABLE "critter" (
    "critter_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "taxon_id" UUID NOT NULL,
    "wlh_id" TEXT,
    "animal_id" TEXT,
    "sex" "sex" NOT NULL,
    "responsible_region_nr_id" UUID DEFAULT get_nr_region_id('Unknown'::text),
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "critter_comment" TEXT,

    CONSTRAINT "critter_real_pk" PRIMARY KEY ("critter_id")
);

-- CreateTable
CREATE TABLE "critter_collection_unit" (
    "critter_collection_unit_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "collection_unit_id" UUID NOT NULL,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_unit_id" PRIMARY KEY ("critter_collection_unit_id")
);

-- CreateTable
CREATE TABLE "family" (
    "family_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "family_label" TEXT NOT NULL,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sibling_group_pk" PRIMARY KEY ("family_id")
);

-- CreateTable
CREATE TABLE "family_child" (
    "family_id" UUID NOT NULL,
    "child_critter_id" UUID NOT NULL,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xref_sibling_group_children_pk" PRIMARY KEY ("family_id","child_critter_id")
);

-- CreateTable
CREATE TABLE "family_parent" (
    "family_id" UUID NOT NULL,
    "parent_critter_id" UUID NOT NULL,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xref_sibling_group_parent_pk" PRIMARY KEY ("family_id","parent_critter_id")
);

-- CreateTable
CREATE TABLE "lk_cause_of_death" (
    "cod_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "cod_category" TEXT NOT NULL,
    "cod_reason" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xref_cause_of_death_reason_pk" PRIMARY KEY ("cod_id")
);

-- CreateTable
CREATE TABLE "lk_collection_category" (
    "collection_category_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "category_name" TEXT NOT NULL,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xref_taxon_collection_category_pkey" PRIMARY KEY ("collection_category_id")
);

-- CreateTable
CREATE TABLE "lk_colour" (
    "colour_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "colour" TEXT NOT NULL,
    "hex_code" TEXT,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lk_colour_pkey" PRIMARY KEY ("colour_id")
);

-- CreateTable
CREATE TABLE "lk_marking_material" (
    "marking_material_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "material" TEXT,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lk_marking_material_pkey" PRIMARY KEY ("marking_material_id")
);

-- CreateTable
CREATE TABLE "lk_marking_type" (
    "marking_type_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lk_marking_type_pkey" PRIMARY KEY ("marking_type_id")
);

-- CreateTable
CREATE TABLE "lk_population_unit_temp" (
    "population_unit_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "unit_name" TEXT,
    "unit_geom" public.geometry(multipolygon, 4326),

    CONSTRAINT "newtable_pk" PRIMARY KEY ("population_unit_id")
);

-- CreateTable
CREATE TABLE "lk_region_env" (
    "region_env_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "region_env_name" TEXT NOT NULL,
    "description" TEXT,
    "region_geom" public.geometry(multipolygon, 4326),
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lk_region_env_pk" PRIMARY KEY ("region_env_id")
);

-- CreateTable
CREATE TABLE "lk_region_nr" (
    "region_nr_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "region_nr_name" TEXT NOT NULL,
    "description" TEXT,
    "region_geom" public.geometry(polygon, 4326),
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lk_region_pk" PRIMARY KEY ("region_nr_id")
);

-- CreateTable
CREATE TABLE "lk_taxon" (
    "taxon_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "kingdom_id" UUID,
    "phylum_id" UUID,
    "class_id" UUID,
    "order_id" UUID,
    "family_id" UUID,
    "genus_id" UUID,
    "species_id" UUID,
    "sub_species_id" UUID,
    "taxon_name_common" TEXT,
    "taxon_name_latin" TEXT NOT NULL,
    "spi_taxonomy_id" INTEGER NOT NULL DEFAULT -1,
    "taxon_description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taxon_pkey" PRIMARY KEY ("taxon_id")
);

-- CreateTable
CREATE TABLE "lk_wildlife_management_unit" (
    "wmu_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "wmu_name" TEXT NOT NULL,
    "description" TEXT,
    "wmu_geom" public.geometry(polygon, 4326),
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_lk_wildlife_management_unit" PRIMARY KEY ("wmu_id")
);

-- CreateTable
CREATE TABLE "location" (
    "location_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "coordinate_uncertainty" DOUBLE PRECISION,
    "coordinate_uncertainty_unit" "coordinate_uncertainty_unit",
    "wmu_id" UUID,
    "region_nr_id" UUID,
    "region_env_id" UUID,
    "elevation" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "location_comment" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_pk" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "marking" (
    "marking_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "capture_id" UUID,
    "mortality_id" UUID,
    "taxon_marking_body_location_id" UUID NOT NULL,
    "marking_type_id" UUID,
    "marking_material_id" UUID,
    "primary_colour_id" UUID,
    "secondary_colour_id" UUID,
    "text_colour_id" UUID,
    "identifier" TEXT,
    "frequency" DOUBLE PRECISION,
    "frequency_unit" "frequency_unit",
    "order" INTEGER,
    "comment" TEXT,
    "attached_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_timestamp" TIMESTAMPTZ(6),
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marking_id" PRIMARY KEY ("marking_id")
);

-- CreateTable
CREATE TABLE "measurement_qualitative" (
    "measurement_qualitative_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "taxon_measurement_id" UUID NOT NULL,
    "capture_id" UUID,
    "mortality_id" UUID,
    "qualitative_option_id" UUID NOT NULL,
    "measurement_comment" TEXT,
    "measured_timestamp" TIMESTAMPTZ(6),
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "critter_measurement_qualitative_pk" PRIMARY KEY ("measurement_qualitative_id")
);

-- CreateTable
CREATE TABLE "measurement_quantitative" (
    "measurement_quantitative_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "taxon_measurement_id" UUID NOT NULL,
    "capture_id" UUID,
    "mortality_id" UUID,
    "value" DOUBLE PRECISION NOT NULL,
    "measurement_comment" TEXT,
    "measured_timestamp" TIMESTAMPTZ(6),
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "critter_measurement_empirical_tax_pk" PRIMARY KEY ("measurement_quantitative_id")
);

-- CreateTable
CREATE TABLE "mortality" (
    "mortality_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "location_id" UUID,
    "mortality_timestamp" TIMESTAMPTZ(6) NOT NULL,
    "proximate_cause_of_death_id" UUID NOT NULL,
    "proximate_cause_of_death_confidence" "cod_confidence",
    "proximate_predated_by_taxon_id" UUID,
    "ultimate_cause_of_death_id" UUID,
    "ultimate_cause_of_death_confidence" "cod_confidence",
    "ultimate_predated_by_taxon_id" UUID,
    "mortality_comment" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mortality_pk" PRIMARY KEY ("mortality_id")
);

-- CreateTable
CREATE TABLE "relationship" (
    "relationship_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "critter_id" UUID NOT NULL,
    "parent_id" UUID,
    "child_id" UUID,
    "sibling_id" UUID,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relationship_id" PRIMARY KEY ("relationship_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "system_user_id" TEXT NOT NULL,
    "system_name" TEXT NOT NULL,
    "keycloak_uuid" UUID,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "xref_collection_unit" (
    "collection_unit_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "collection_category_id" UUID NOT NULL,
    "unit_name" TEXT NOT NULL,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xref_species_collection_unit_pk" PRIMARY KEY ("collection_unit_id")
);

-- CreateTable
CREATE TABLE "xref_taxon_collection_category" (
    "collection_category_id" UUID NOT NULL,
    "taxon_id" UUID NOT NULL,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" VARCHAR NOT NULL DEFAULT now(),

    CONSTRAINT "xref_taxon_collection_category_pk" PRIMARY KEY ("collection_category_id","taxon_id")
);

-- CreateTable
CREATE TABLE "xref_taxon_marking_body_location" (
    "taxon_marking_body_location_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "taxon_id" UUID NOT NULL,
    "body_location" TEXT NOT NULL,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xref_species_marking_location_pkey" PRIMARY KEY ("taxon_marking_body_location_id")
);

-- CreateTable
CREATE TABLE "xref_taxon_measurement_qualitative" (
    "taxon_measurement_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "taxon_id" UUID NOT NULL,
    "measurement_name" VARCHAR NOT NULL,
    "measurement_desc" VARCHAR,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taxon_measurement_qualitative_pk" PRIMARY KEY ("taxon_measurement_id")
);

-- CreateTable
CREATE TABLE "xref_taxon_measurement_qualitative_option" (
    "qualitative_option_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "taxon_measurement_id" UUID NOT NULL,
    "option_label" TEXT,
    "option_value" INTEGER NOT NULL,
    "option_desc" VARCHAR,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qualitative_option_pk" PRIMARY KEY ("qualitative_option_id")
);

-- CreateTable
CREATE TABLE "xref_taxon_measurement_quantitative" (
    "taxon_measurement_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "taxon_id" UUID NOT NULL,
    "measurement_name" TEXT NOT NULL,
    "measurement_desc" TEXT,
    "min_value" DOUBLE PRECISION DEFAULT 0,
    "max_value" DOUBLE PRECISION,
    "unit" "measurement_unit",
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taxon_measurement_empirical_pk" PRIMARY KEY ("taxon_measurement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artifact_url_unique" ON "artifact"("artifact_url");

-- CreateIndex
CREATE UNIQUE INDEX "critter_un" ON "critter"("critter_id", "taxon_id");

-- CreateIndex
CREATE UNIQUE INDEX "xref_taxon_collection_category_category_name_key" ON "lk_collection_category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "critterbase_marking_material_unq" ON "lk_marking_material"("material");

-- CreateIndex
CREATE INDEX "unit_geom_idx" ON "lk_population_unit_temp" USING GIST ("unit_geom");

-- CreateIndex
CREATE INDEX "region_env_geom_idx" ON "lk_region_env" USING GIST ("region_geom");

-- CreateIndex
CREATE INDEX "region_nr_geom_idx" ON "lk_region_nr" USING GIST ("region_geom");

-- CreateIndex
CREATE UNIQUE INDEX "lk_wildlife_management_unit_un" ON "lk_wildlife_management_unit"("wmu_name");

-- CreateIndex
CREATE INDEX "wmu_geom_idx" ON "lk_wildlife_management_unit" USING GIST ("wmu_geom");

-- CreateIndex
CREATE UNIQUE INDEX "relationship_critter_id_child_id_key" ON "relationship"("critter_id", "child_id");

-- CreateIndex
CREATE UNIQUE INDEX "relationship_critter_id_parent_id_key" ON "relationship"("critter_id", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "relationship_critter_id_sibling_id_key" ON "relationship"("critter_id", "sibling_id");

-- CreateIndex
CREATE UNIQUE INDEX "critterbase_user_system_user_id_unq" ON "user"("system_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "xref_species_marking_location_un" ON "xref_taxon_marking_body_location"("taxon_id", "body_location");

-- CreateIndex
CREATE UNIQUE INDEX "qualitative_option_un" ON "xref_taxon_measurement_qualitative_option"("qualitative_option_id", "taxon_measurement_id");

-- AddForeignKey
ALTER TABLE "artifact" ADD CONSTRAINT "artifact_create_user_fkey" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artifact" ADD CONSTRAINT "artifact_critter_id_fkey" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artifact" ADD CONSTRAINT "artifact_measurement_qualitative_fkey" FOREIGN KEY ("measurement_qualitative") REFERENCES "measurement_qualitative"("measurement_qualitative_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artifact" ADD CONSTRAINT "artifact_measurement_quantitative_fkey" FOREIGN KEY ("measurement_quantitative") REFERENCES "measurement_quantitative"("measurement_quantitative_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artifact" ADD CONSTRAINT "artifact_update_user_fkey" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "fk_audit_log_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "fk_audit_log_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_cap_location_fk" FOREIGN KEY ("capture_location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_cu_fk" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_fk" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_rel_location_fk" FOREIGN KEY ("release_location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_uu_fk" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter" ADD CONSTRAINT "critter_nrr_fk" FOREIGN KEY ("responsible_region_nr_id") REFERENCES "lk_region_nr"("region_nr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter" ADD CONSTRAINT "critter_taxon_fk" FOREIGN KEY ("taxon_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter" ADD CONSTRAINT "fk_critter_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter" ADD CONSTRAINT "fk_critter_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter_collection_unit" ADD CONSTRAINT "collection_unit_critter_id_fkey" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter_collection_unit" ADD CONSTRAINT "collection_unit_taxon_collection_unit_id_fkey" FOREIGN KEY ("collection_unit_id") REFERENCES "xref_collection_unit"("collection_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter_collection_unit" ADD CONSTRAINT "fk_collection_unit_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "critter_collection_unit" ADD CONSTRAINT "fk_collection_unit_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_child" ADD CONSTRAINT "xref_sibling_group_children_critter_fk" FOREIGN KEY ("child_critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_child" ADD CONSTRAINT "xref_sibling_group_children_group_fk" FOREIGN KEY ("family_id") REFERENCES "family"("family_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_parent" ADD CONSTRAINT "xref_sibling_group_parent_critter_fk" FOREIGN KEY ("parent_critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_parent" ADD CONSTRAINT "xref_sibling_group_parent_group_fk" FOREIGN KEY ("family_id") REFERENCES "family"("family_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_cause_of_death" ADD CONSTRAINT "fk_lk_cause_of_death_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_cause_of_death" ADD CONSTRAINT "fk_lk_cause_of_death_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_collection_category" ADD CONSTRAINT "fk_xref_taxon_collection_category_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_collection_category" ADD CONSTRAINT "fk_xref_taxon_collection_category_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_colour" ADD CONSTRAINT "fk_lk_colour_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_colour" ADD CONSTRAINT "fk_lk_colour_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_marking_material" ADD CONSTRAINT "fk_lk_marking_material_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_marking_material" ADD CONSTRAINT "fk_lk_marking_material_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_marking_type" ADD CONSTRAINT "fk_lk_marking_type_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_marking_type" ADD CONSTRAINT "fk_lk_marking_type_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_region_env" ADD CONSTRAINT "fk_lk_region_env_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_region_env" ADD CONSTRAINT "fk_lk_region_env_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_region_nr" ADD CONSTRAINT "fk_lk_region_nr_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_region_nr" ADD CONSTRAINT "fk_lk_region_nr_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "fk_lk_taxon_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "fk_lk_taxon_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_genus_id_fkey" FOREIGN KEY ("genus_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_kingdom_id_fkey" FOREIGN KEY ("kingdom_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_phylum_id_fkey" FOREIGN KEY ("phylum_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_taxon" ADD CONSTRAINT "lk_taxon_sub_species_id_fkey" FOREIGN KEY ("sub_species_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_wildlife_management_unit" ADD CONSTRAINT "fk_lk_wildlife_management_unit_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_wildlife_management_unit" ADD CONSTRAINT "fk_lk_wildlife_management_unit_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "fk_location_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "fk_location_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "fk_wmu_id_user" FOREIGN KEY ("wmu_id") REFERENCES "lk_wildlife_management_unit"("wmu_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_env_fk" FOREIGN KEY ("region_env_id") REFERENCES "lk_region_env"("region_env_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_nrr_fk" FOREIGN KEY ("region_nr_id") REFERENCES "lk_region_nr"("region_nr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "fk_marking_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "fk_marking_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_critter_id_fkey" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_marking_material_id_fkey" FOREIGN KEY ("marking_material_id") REFERENCES "lk_marking_material"("marking_material_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_marking_type_id_fkey" FOREIGN KEY ("marking_type_id") REFERENCES "lk_marking_type"("marking_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_primary_colour_id_fkey" FOREIGN KEY ("primary_colour_id") REFERENCES "lk_colour"("colour_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_secondary_colour_id_fkey" FOREIGN KEY ("secondary_colour_id") REFERENCES "lk_colour"("colour_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_taxon_marking_location_id_fkey" FOREIGN KEY ("taxon_marking_body_location_id") REFERENCES "xref_taxon_marking_body_location"("taxon_marking_body_location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_text_colour_id_fkey" FOREIGN KEY ("text_colour_id") REFERENCES "lk_colour"("colour_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_qualitative" ADD CONSTRAINT "critter_measurement_qualitative_fk" FOREIGN KEY ("qualitative_option_id", "taxon_measurement_id") REFERENCES "xref_taxon_measurement_qualitative_option"("qualitative_option_id", "taxon_measurement_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_qualitative" ADD CONSTRAINT "fk_measurement_qualitative_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_qualitative" ADD CONSTRAINT "fk_measurement_qualitative_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_qualitative" ADD CONSTRAINT "measurement_qualitative_fk" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_quantitative" ADD CONSTRAINT "measurement_empirical_critter_fk" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_quantitative" ADD CONSTRAINT "measurement_empirical_tax_fk" FOREIGN KEY ("taxon_measurement_id") REFERENCES "xref_taxon_measurement_quantitative"("taxon_measurement_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "fk_mortality_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "fk_mortality_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "mortality_fk" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "mortality_location_fk" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "mortality_pcod_fk" FOREIGN KEY ("proximate_cause_of_death_id") REFERENCES "lk_cause_of_death"("cod_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "mortality_pcod_taxon_fk" FOREIGN KEY ("proximate_predated_by_taxon_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "mortality_ucod_fk" FOREIGN KEY ("ultimate_cause_of_death_id") REFERENCES "lk_cause_of_death"("cod_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "mortality_ucod_taxon_fk" FOREIGN KEY ("ultimate_predated_by_taxon_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_create_user_fkey" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_critter_id_fkey" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_sibling_id_fkey" FOREIGN KEY ("sibling_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_update_user_fkey" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_collection_unit" ADD CONSTRAINT "fk_xref_collection_unit_category" FOREIGN KEY ("collection_category_id") REFERENCES "lk_collection_category"("collection_category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_collection_unit" ADD CONSTRAINT "fk_xref_collection_unit_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_collection_unit" ADD CONSTRAINT "fk_xref_collection_unit_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_collection_category" ADD CONSTRAINT "xref_taxon_collection_category_category_fk" FOREIGN KEY ("collection_category_id") REFERENCES "lk_collection_category"("collection_category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_collection_category" ADD CONSTRAINT "xref_taxon_collection_category_taxon_fk" FOREIGN KEY ("taxon_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_marking_body_location" ADD CONSTRAINT "fk_xref_taxon_marking_location_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_marking_body_location" ADD CONSTRAINT "fk_xref_taxon_marking_location_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_marking_body_location" ADD CONSTRAINT "xref_taxon_marking_location_taxon_id_fkey" FOREIGN KEY ("taxon_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative" ADD CONSTRAINT "fk_xref_taxon_measurement_qualitative_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative" ADD CONSTRAINT "fk_xref_taxon_measurement_qualitative_taxon" FOREIGN KEY ("taxon_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative" ADD CONSTRAINT "fk_xref_taxon_measurement_qualitative_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative_option" ADD CONSTRAINT "fk_xref_taxon_measurement_qualitative_option_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative_option" ADD CONSTRAINT "fk_xref_taxon_measurement_qualitative_option_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative_option" ADD CONSTRAINT "qualitative_option_fk" FOREIGN KEY ("taxon_measurement_id") REFERENCES "xref_taxon_measurement_qualitative"("taxon_measurement_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_quantitative" ADD CONSTRAINT "fk_xref_taxon_measurement_quantitative_create_user" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_quantitative" ADD CONSTRAINT "fk_xref_taxon_measurement_quantitative_update_user" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "xref_taxon_measurement_quantitative" ADD CONSTRAINT "taxon_measurement_empirical_fk" FOREIGN KEY ("taxon_id") REFERENCES "lk_taxon"("taxon_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
