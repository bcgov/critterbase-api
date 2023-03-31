import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { app } from "../server";
import { IS_DEV, IS_PROD, IS_TEST, PORT } from "./constants";
/**
 ** Formats a prisma error messsage based on the prisma error code
 * @param code string
 * @param meta Record<string, unknown> | undefined -> unknown object shape
 * @returns string -> formatted error message
 * Note: as unsupported error messages occur, add support using this function
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const prismaErrorMsg = (
  err: PrismaClientKnownRequestError
): { error: string; status: number } => {
  const { meta, message, code } = err;
  switch (code) {
    case "P2025":
      return {
        error: `${meta?.cause ?? message}`,
        status: 404,
      };
    case "P2002":
      return {
        error: `unique constraint failed on the fields: ${meta?.target}`,
        status: 400,
      };
    case "P2003":
      return {
        error: `foreign key constraint failed on the field: ${meta?.field_name}`,
        status: 404,
      };
  }
  console.log(`NEW PRISMA ERROR: ${err}`);
  return { error: `unsupported prisma error: "${code}"`, status: 400 };
};

export { prismaErrorMsg };
