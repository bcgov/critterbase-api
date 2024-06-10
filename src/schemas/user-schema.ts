import { user } from '.prisma/client';
import { z } from 'zod';
import { AuditColumns } from '../utils/types';
import { implement, zodID } from '../utils/zod_helpers';

/**
 * @table user
 *
 * Base User schema omitting audit columns.
 * Using 'implement' to keep zod schema in sync with prisma type.
 *
 */
export const UserSchema = implement<User>().with({
  user_id: zodID,
  user_identifier: z.string(),
  keycloak_uuid: z.string().nullable()
});

/**
 * User schema with required keycloak uuid
 *
 */
export const UserWithKeycloakUuidSchema = z.object({
  user_id: zodID,
  user_identifier: z.string(),
  keycloak_uuid: z.string()
});

/**
 * Create user schema
 *
 */
export const CreateUserSchema = z
  .object({
    user_identifier: z.string(),
    keycloak_uuid: z.string()
  })
  .strict();

/**
 * Update user schema
 *
 */
export const UpdateUserSchema = z.object({
  user_identifier: z.string(),
  keycloakd_uuid: z.string()
});

/**
 * Login user schema
 *
 */
export const AuthLoginSchema = z.object({
  keycloak_uuid: z.string()
});

export const SwagUserSchema = UserSchema.extend({ system_user_id: z.string() });

/**
 * Inferred zod types
 *
 */
export type User = Omit<user, AuditColumns>;
export type UserWithKeycloakUuid = z.infer<typeof UserWithKeycloakUuidSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type LoginCredentials = z.infer<typeof AuthLoginSchema>;
