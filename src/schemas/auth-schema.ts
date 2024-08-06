import { z } from 'zod';

/**
 * Bearer token schema.
 * @example 'Bearer xxxx.yyyy.xxxx'
 *
  message: `Bearer token is undefined. 'Bearer xxxx.yyyy.xxxx'`
 */
export const BearerTokenSchema = z.preprocess((value) => (value as string).split(' ')?.[1], z.string());

/**
 * User header schema.
 * @example '{"keycloak_guid": "AAA", "username": "SteveBrule"}'
 *
 */
export const UserHeaderSchema = z.string().transform((value, ctx) => {
  try {
    const jsonUser = JSON.parse(value) as unknown;
    const parsedUser = z.object({ keycloak_guid: z.string(), username: z.string() }).parse(jsonUser);
    return parsedUser;
  } catch (err) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Malformed user header. Expecting {'keycloak_guid': 'AAA', 'username': 'SteveBrule'}`
    });
    return z.NEVER;
  }
});

/**
 * Authentication headers schema
 *
 */
export const AuthHeadersSchema = z
  .object({
    authorization: BearerTokenSchema,
    user: UserHeaderSchema
  })
  .transform((value) => {
    return {
      token: value.authorization,
      keycloak_uuid: value.user.keycloak_guid,
      user_identifier: value.user.username
    };
  });
