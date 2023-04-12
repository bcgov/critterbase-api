-- DropIndex
ALTER TABLE "user" DROP CONSTRAINT "critterbase_user_system_user_id_unq";

--
-- TOC entry 1030 (class 1255 OID 41174)
-- Name: trg_audit_trigger(); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--

CREATE OR REPLACE FUNCTION critterbase.trg_audit_trigger() RETURNS trigger
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
-- mac.deluca@quartech.com
--					2023-04-06 corrected issue with update_user not being set on insert
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
