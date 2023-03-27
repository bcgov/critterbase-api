import * as z from "zod"
import { Completeuser, RelateduserSchema } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string | null
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const audit_logSchema = z.object({
  audit_log_id: z.string().uuid(),
  table_name: z.string(),
  operation: z.string(),
  before_value: jsonSchema,
  after_value: jsonSchema,
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completeaudit_log extends z.infer<typeof audit_logSchema> {
  user_audit_log_create_userTouser: Completeuser
  user_audit_log_update_userTouser: Completeuser
}

/**
 * Relatedaudit_logSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedaudit_logSchema: z.ZodSchema<Completeaudit_log> = z.lazy(() => audit_logSchema.extend({
  user_audit_log_create_userTouser: RelateduserSchema,
  user_audit_log_update_userTouser: RelateduserSchema,
}))
