DROP FUNCTION IF EXISTS critterbase.api_set_context(text, system);

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
  	SELECT api_set_context(NULL, 'CRITTERBASE_DB') INTO internal_user_id;
  END IF;

  RETURN internal_user_id;
END;
$function$
;

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
-- mac.deluca@quartech.com
--					2023-04-06 corrected issue with update_user not being set on insert
-- *******************************************************************
DECLARE
	critterbase_user_id uuid := NULL;
	system_making_change text := NULL;
	old_row json := null;
  	new_row json := null;
BEGIN
-- api users will hopefully have created the temp table using an api helper function
-- this create temp table statement is for database users
	
	critterbase_user_id := api_get_context_user_id();
	SELECT value::text INTO system_making_change FROM critterbase_context WHERE tag = 'system_name';
	IF (TG_OP = 'INSERT') THEN
		--Set the new_row json for audit_log
		new_row = row_to_json(NEW);
	
	    NEW.create_user = critterbase_user_id;
      NEW.update_user = critterbase_user_id;
	
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
	    after_value,
	    system_name) 
	  VALUES (
	    tg_table_schema || '.' || tg_table_name,
	    tg_op,
	    old_row,
	    new_row,
	   	system_making_change);
	   
	IF (tg_op != 'DELETE') THEN RETURN NEW; END IF;

	RETURN OLD;

	EXCEPTION
	WHEN OTHERS THEN
	    RAISE;
END;

$function$
;



CREATE OR REPLACE FUNCTION critterbase.api_set_context(_keycloak_uuid text, _system_name text)
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
-- graham.stewart@quartech.com
--                  2023-07-24  Updated to use keycloak and generic 
--                              text field for system_name, comes from
--                              keycloak JWT
-- *******************************************************************
DECLARE 
internal_user_id uuid;
BEGIN
  IF _keycloak_uuid IS NULL THEN 
  	SELECT user_id INTO strict internal_user_id FROM "user"
  	WHERE _keycloak_uuid IS NULL AND system_user_id = 'SYSTEM';
  ELSE 
	  SELECT user_id INTO strict internal_user_id FROM "user"
	  WHERE _keycloak_uuid = keycloak_uuid;
  END IF;
  
  CREATE temp TABLE if not EXISTS critterbase_context (tag varchar(200), value varchar(200));
  
  DELETE FROM critterbase_context WHERE  tag = 'user_id';
  DELETE FROM critterbase_context WHERE  tag = 'system_name';
  
  INSERT INTO critterbase_context (tag,value) VALUES ('user_id', internal_user_id::varchar(200));
  INSERT INTO critterbase_context (tag,value) VALUES ('system_name', _system_name::varchar(200));
  
  RETURN internal_user_id;
  exception
	WHEN others THEN
  raise;
END;$function$
;