import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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
        error: `${JSON.stringify(meta?.cause) || message}`,
        status: 404,
      };
    case "P2002":
      return {
        error: `unique constraint failed on the fields: ${JSON.stringify(
          meta?.target
        )}`,
        status: 400,
      };
    case "P2003":
      return {
        error: `foreign key constraint failed on the field: ${JSON.stringify(
          meta?.field_name
        )}`,
        status: 404,
      };
  }
  console.log(`NEW PRISMA ERROR: ${JSON.stringify(err)}`);
  return { error: `unsupported prisma error: "${code}"`, status: 400 };
};

const intersect = <T>(A: Array<T>, B: Array<T>): Array<T> => {
  const setB = new Set(B);
  return Array.from(new Set(A)).filter(x => setB.has(x))
}

export { prismaErrorMsg, intersect };
