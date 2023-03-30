import { Prisma, user } from ".prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  nonEmpty,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";

// Types
type UserCreateInput = z.infer<typeof UserCreateBodySchema>;

type UserUpdateInput = z.infer<typeof UserUpdateBodySchema>;

// Schemas

// Base schema for all user
const userSchema = implement<user>().with({
  user_id: zodID,
  system_user_id: z.string(),
  system_name: z.string(),
  keycloak_uuid: zodID.nullable(),
  ...zodAudit,
});

// Validate incoming request body for create user
const UserCreateBodySchema = implement<
  Omit<Prisma.userCreateManyInput, "user_id" | keyof AuditColumns>
>().with(
  userSchema
    .omit({ ...noAudit, user_id: true })
    .partial()
    .required({ system_name: true, system_user_id: true }).shape
);

// Validate incoming request body for update artifact
const UserUpdateBodySchema = implement<
  Omit<Prisma.userUncheckedUpdateManyInput, "user_id" | keyof AuditColumns>
>()
  .with(UserCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

export { UserCreateBodySchema, UserUpdateBodySchema };
export type { UserCreateInput, UserUpdateInput };
