import { critter } from ".prisma/client";
import { z } from "zod";
import { AuditColumns, Implements } from "./types";

const zodID = z.string().uuid();

const uuidParamsSchema = z.object({
  id: z.string().uuid("query param is an invalid UUID"),
});

const nonEmpty = (obj: Record<string | number | symbol, unknown>) =>
  Object.values(obj).some((v) => v !== undefined);

const noAudit: Record<keyof AuditColumns, true> = {
  create_user: true,
  update_user: true,
  create_timestamp: true,
  update_timestamp: true,
};

export function implement<Model = never>() {
  return {
    with: <
      Schema extends Implements<Model> & {
        [unknownKey in Exclude<keyof Schema, keyof Model>]: never;
      }
    >(
      schema: Schema
    ) => z.object(schema),
  };
}

export { uuidParamsSchema, nonEmpty, noAudit, zodID };
