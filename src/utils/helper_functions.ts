import { app } from "../server";
import { IS_DEV, IS_PROD, PORT } from "./constants";
import { AuditColumns } from "./types";
/**
 ** Used to exclude properties from DB records. Defaults to audit properties.
 * @param record ie: critter, measurement, marking
 * @param properties array of additional properties to be deleted. ie: 'description'
 * @deleteAudit boolean
 */
const exclude = <T extends AuditColumns>(
  record: T | T[],
  deleteAudit: boolean = true,
  properties?: Array<keyof T>
): Partial<T> | Partial<T>[] => {
  const del = (rec: Partial<T>): Partial<T> => {
    if (deleteAudit) {
      delete rec["create_user"];
      delete rec["update_user"];
      delete rec["created_at"];
      delete rec["updated_at"];
    }
    if (properties) {
      properties.forEach((prop) => delete rec[prop]);
    }
    return rec;
  };
  Array.isArray(record) ? record.forEach((r) => del(r)) : del(record);

  return record;
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

export { exclude, isValidObject,startServer };
