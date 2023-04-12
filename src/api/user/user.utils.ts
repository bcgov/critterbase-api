import { Prisma, user } from ".prisma/client";
import { system } from "@prisma/client";
import { z } from "zod";
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
  system_user_id: NumberToString,
  system_name: z.nativeEnum(system),
  keycloak_uuid: zodID.nullable(),
  ...zodAudit,
});

// Validate incoming request body for create user
const UserCreateBodySchema = implement<
  Omit<Prisma.userCreateManyInput, "user_id" | keyof AuditColumns>
>().with(
  UserSchema.omit({ ...noAudit, user_id: true })
    .partial()
    .required({ system_name: true, system_user_id: true }).shape
);

// Validate incoming request body for update artifact
const UserUpdateBodySchema = implement<
  Omit<Prisma.userUncheckedUpdateManyInput, "user_id" | keyof AuditColumns>
>()
  .with(UserCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

const AuthLoginSchema = UserSchema.partial()
  .pick({
    user_id: true,
    keycloak_uuid: true,
    system_name: true,
    system_user_id: true,
  })
  .strict()
  .refine(
    nonEmpty,
    "to login you must provide either user_id OR keycloak_uuid"
  );

export {
  UserCreateBodySchema,
  UserUpdateBodySchema,
  AuthLoginSchema,
  UserSchema,
};
export type { UserCreateInput, UserUpdateInput, LoginCredentials };
