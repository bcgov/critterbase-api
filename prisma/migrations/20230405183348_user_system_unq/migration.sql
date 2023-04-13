/*
  Warnings:

  - A unique constraint covering the columns `[system_user_id,system_name]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `system_name` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "system" AS ENUM ('CRITTERBASE', 'BCTW');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN system_name TYPE "system" USING system_name::"system";

-- CreateIndex
CREATE UNIQUE INDEX "user_system_user_id_system_name_key" ON "user"("system_user_id", "system_name");

DROP FUNCTION critterbase.api_get_context_user_id;
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
  	SELECT api_set_context('SYSTEM', 'CRITTERBASE') INTO internal_user_id;
  END IF;

  RETURN internal_user_id;
END;
$$;


ALTER FUNCTION critterbase.api_get_context_user_id() OWNER TO critterbase;
--
-- TOC entry 1028 (class 1255 OID 41175)
-- Name: api_set_context(text, text); Type: FUNCTION; Schema: critterbase; Owner: critterbase
--
DROP function critterbase.api_set_context;
CREATE FUNCTION critterbase.api_set_context(_system_user_id text, _system_name system) RETURNS uuid
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


ALTER FUNCTION critterbase.api_set_context(_system_user_id text, _system_name system) OWNER TO critterbase;
