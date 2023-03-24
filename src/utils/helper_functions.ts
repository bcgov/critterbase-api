import { app } from "../server";
import { IS_DEV, IS_PROD, PORT, strings } from "./constants";
import { apiError, AuditColumns } from "./types";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const exclude = <T, Key extends keyof T>(
  obj: T | null,
  keys: Key[]
): Omit<T, Key> | null => {
  if (!obj) return null;
  for (let key of keys) {
    if (obj) {
      if (typeof obj[key] === "object") {
        const temp = obj[key];
        Object.assign(obj, temp);
      }
      delete obj[key];
    }
  }
  return obj;
};

const unpackObject = <T, Key extends keyof T>(obj: T, key: Key) => {
  if (!obj) return;
  if (typeof obj[key] === "object") {
    Object.assign(obj, obj[key]);
    delete obj[key];
  }
  return obj;
};

const getAuditColumns = <T extends AuditColumns>(obj: T): AuditColumns => ({
  create_user: obj.create_user,
  update_user: obj.update_user,
  create_timestamp: obj.create_timestamp,
  update_timestamp: obj.update_timestamp,
});

/**
 * * Checks if a provided string value is a uuid
 * @param id string | undefined
 * @returns id
 */
const isUUID = (id?: string): string => {
  if (!id) {
    throw apiError.requiredProperty(strings.app.idRequired);
  }
  if (!z.string().uuid().safeParse(id).success) {
    throw apiError.syntaxIssue(strings.app.invalidUUID(id));
  }
  return id;
};

/**
 * * Validates the structure of an object
 * @template T
 * @param {T} object
 * @param {(keyof T)[]} [requiredFields]
 * @param {(keyof T)[]} [allowedFields]
 */
function isValidObject<T extends Record<string, any>>(
  object: T,
  requiredFields?: (keyof T)[],
  allowedFields?: (keyof T)[]
): boolean {
  const fields = Object.keys(object);
  const hasRequiredFields =
    !requiredFields ||
    requiredFields.every((field) => fields.includes(field as string));
  const hasNoExtraFields =
    !allowedFields ||
    fields.every((field) => allowedFields.includes(field as string));
  return hasRequiredFields && hasNoExtraFields;
}

const startServer = () => {
  if (IS_DEV || IS_PROD) {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    });
  }
};

/**
 ** Formats a prisma error messsage based on the prisma error code
 * @param code string
 * @param meta Record<string, unknown> | undefined -> unknown object shape
 * @returns string -> formatted error message
 * Note: as unsupported error messages occur, add support using this function
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const prismaErrorMsg = (
  err: Error | PrismaClientKnownRequestError,
  code: string,
  meta?: Record<string, unknown>
): { error: string; status: number } => {
  switch (code) {
    case "P2025":
      return {
        error: `${meta?.cause ?? err.message}`,
        status: 404,
      };
    case "P2002":
      return {
        error: `unique constraint failed on the fields: ${meta?.target}`,
        status: 400,
      };
  }
  return { error: `unsupported prisma error: "${code}"`, status: 400 };
};

export {
  isUUID,
  exclude,
  isValidObject,
  startServer,
  prismaErrorMsg,
  getAuditColumns,
};
