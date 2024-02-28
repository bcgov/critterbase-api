import { Prisma, user } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { apiError } from "../../utils/types";
import { LoginCredentials } from "../user/user.utils";

const loginUser = async (login: LoginCredentials): Promise<user | null> => {
  // Find a user that matches both `user_id` and `keycloak_uuid`
  const foundUser = await prisma.user.findFirst({
    where: {
      keycloak_uuid: login.keycloak_uuid
    }
  });

  if (!foundUser) {
    throw apiError.unauthorized("User not found. Login failed");
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

export { getTableDataTypes, loginUser };
