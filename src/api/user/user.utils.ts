import { Prisma, user } from ".prisma/client";
import { z } from "zod";
import {
  API_KEY_HEADER,
  KEYCLOAK_UUID_HEADER,
  USER_ID_HEADER,
} from "../../utils/constants";
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

type LoginCredentials = z.infer<typeof AuthLoginSchema>;

// Schemas

// Base schema for all user
const UserSchema = implement<user>().with({
  user_id: zodID,
  user_identifier: z.string(),
  keycloak_uuid: z.string().nullable(),
  ...zodAudit,
});

const SwagUserSchema = UserSchema.extend({ system_user_id: z.string() });

// Validate incoming request body for create user
const UserCreateBodySchema = implement<
  Omit<Prisma.userCreateManyInput, "user_id" | keyof AuditColumns>
>().with(
  UserSchema.omit({ ...noAudit, user_id: true })
    .partial()
    .required({ user_identifier: true, keycloak_uuid: true }).shape,
);

// Validate incoming request body for update artifact
const UserUpdateBodySchema = implement<
  Omit<Prisma.userUncheckedUpdateManyInput, "user_id" | keyof AuditColumns>
>()
  .with(UserCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

const AuthLoginSchema = z.object({
  keycloak_uuid: z.string(),
});

export {
  UserCreateBodySchema,
  UserUpdateBodySchema,
  AuthLoginSchema,
  UserSchema,
  SwagUserSchema,
};
export type { UserCreateInput, UserUpdateInput, LoginCredentials };
