
-- DropIndex
DROP INDEX "user_system_user_id_system_name_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "system_name";
ALTER TABLE "user" RENAME COLUMN "system_user_id" TO "user_identifier";

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
	  RETURN (SELECT user_id FROM critterbase.USER WHERE user_identifier = sys_user_id) AS s;
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
  	WHERE keycloak_uuid IS NULL AND user_identifier = 'SYSTEM';
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
