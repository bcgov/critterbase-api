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

const startServer = () => {
  if (IS_DEV || IS_PROD) {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    });
  }
};

export { exclude, startServer };
