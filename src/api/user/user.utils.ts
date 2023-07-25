import { Prisma, user } from ".prisma/client";
import { z } from "zod";
import {
  API_KEY_HEADER,
  KEYCLOAK_UUID_HEADER,
  USER_ID_HEADER,
} from "../../utils/constants";
import { AuditColumns } from "../../utils/types";
import {
  NumberToString,
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
  user_identifier: NumberToString,
  keycloak_uuid: z.string().nullable(),
  ...zodAudit,
});

// Validate incoming request body for create user
const UserCreateBodySchema = implement<
  Omit<Prisma.userCreateManyInput, "user_id" | keyof AuditColumns>
>().with(
  UserSchema.omit({ ...noAudit, user_id: true })
    .partial()
    .required({ user_identifier: true, keycloak_uuid: true }).shape
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

const AuthHeadersSchema = z
  .object({
    [API_KEY_HEADER]: z
      .string({
        required_error: `A valid uuid for header: '${API_KEY_HEADER}' must be provided`,
      })
      .uuid(),
    [USER_ID_HEADER]: z
      .string({
        required_error: `A valid uuid for header: '${USER_ID_HEADER}' must be provided`,
      })
      .uuid(),
    [KEYCLOAK_UUID_HEADER]: z.string({
      required_error: `A valid keycloak uuid for header: '${KEYCLOAK_UUID_HEADER}' must be provided`,
    }),
  })
  .passthrough();

export {
  UserCreateBodySchema,
  UserUpdateBodySchema,
  AuthLoginSchema,
  UserSchema,
  AuthHeadersSchema,
};
export type { UserCreateInput, UserUpdateInput, LoginCredentials };
