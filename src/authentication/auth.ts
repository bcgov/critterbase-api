import { Request } from 'express';
import { apiError } from '../utils/types';
import { ZodError } from 'zod';
import { AuthorizedUser } from '../schemas/user-schema';
import { ALLOWED_AUDIENCES, KEYCLOAK_ISSUER, KEYCLOAK_URL } from '../utils/constants';
import { JwtPayload } from 'jsonwebtoken';
import { TokenVerifier } from '../utils/token-verifier';
import { AuthHeadersSchema } from '../utils/zod_helpers';

/**
 * Token Verifier
 *
 * @description Verifies jwt token against issuer.
 */
const tokenVerifier = new TokenVerifier({ tokenURI: KEYCLOAK_URL, tokenIssuer: KEYCLOAK_ISSUER });

/**
 * Authenticate the request's bearer token (JWT), audience and user header.
 * Authentication criteria:
 *  1. Must provide correct auth headers ie: user + authorization (jwt bearer token).
 *  2. Token must be verifiable against the issuer (keycloak).
 *  3. Token audience (origin) must be allowed by Critterbase.
 *
 * @async
 * @param {Request} req
 * @throws {apiError} If token invalid, audience not supported or request is missing required headers
 * @returns {AuthorizedUser} The authorized user
 */
export const authenticateRequest = async function (req: Request): Promise<AuthorizedUser> {
  try {
    // 1. Parse auth headers
    const { token, keycloak_uuid, user_identifier } = AuthHeadersSchema.parse(req.headers);

    // 2. Verify jwt token against issuer
    const verifiedToken = await tokenVerifier.getVerifiedToken<JwtPayload>(token);

    // 3. Validate the token audience is allowed
    if (typeof verifiedToken.aud !== 'string' || !ALLOWED_AUDIENCES.includes(verifiedToken.aud)) {
      throw new apiError(`Token audience not allowed.`);
    }

    return {
      keycloak_uuid,
      user_identifier,
      system_name: verifiedToken.aud
    };
  } catch (error: unknown) {
    if (error instanceof apiError) {
      throw apiError.forbidden(`Access Denied: ${error.message}`);
    }

    if (error instanceof ZodError) {
      throw apiError.forbidden(`Access Denied: Invalid auth headers`, [error.issues]);
    }
    throw error;
  }
};
