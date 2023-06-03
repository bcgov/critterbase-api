import { Prisma, system, user } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { apiError } from "../../utils/types";
import { LoginCredentials } from "../user/user.utils";

const loginUser = async (login: LoginCredentials): Promise<user> => {
  let foundUser: user | null = null;
  const { user_id, keycloak_uuid, system_name, system_user_id } = login;
  if ((!system_name && system_user_id) || (system_name && !system_user_id)) {
    throw apiError.syntaxIssue(
      `Must provide a system_name (${Object.keys(system).join(
        ", "
      )}) AND external system_user_id`
    );
  }
  if (user_id) {
    foundUser = await prisma.user.findUnique({ where: { user_id } });
  }
  if (!foundUser && keycloak_uuid) {
    foundUser = await prisma.user.findFirst({ where: { keycloak_uuid } });
  }
  if (!foundUser && system_name && system_user_id) {
    foundUser = await prisma.user.findFirst({
      where: {
        AND: [{ system_name }, { system_user_id }],
      },
    });
  }
  if (!foundUser) {
    throw apiError.notFound("No user found. Login failed");
  }
  return foundUser;
};

const getTableDataTypes = async (model: Prisma.ModelName) => {
  const results = await prisma.$queryRaw`
      WITH enums AS (
        SELECT typname, array_agg(e.enumlabel) AS enum_vals
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        GROUP BY typname)
      SELECT column_name, udt_name, enum_vals FROM information_schema.columns info 
      LEFT JOIN enums ON info.column_name = enums.typname
      WHERE table_name = ${model}`;
  return results;
};

export { loginUser, getTableDataTypes };
