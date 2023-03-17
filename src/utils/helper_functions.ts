import { app } from "../server";
import { IS_DEV, IS_PROD, PORT, strings } from "./constants";
import { apiError, AuditColumns } from "./types";
import { z } from "zod";

function exclude<T, Key extends keyof T>(obj: T, keys: Key[]): Omit<T, Key> {
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
}

/**
 * * Checks if a provided string value is a uuid
 * @param id string | undefined
 * @returns id
 */
const isUUID = (id?: string): string => {
  if (!id) {
    throw apiError.requiredProperty(strings.app.idRequired);
  }
  console.log(z.string().uuid().safeParse(id));
  if (!z.string().uuid().safeParse(id).success) {
    console.log("inside");
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

export { isUUID, exclude, isValidObject, startServer };
