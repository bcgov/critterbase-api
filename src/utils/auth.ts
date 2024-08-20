import { IncomingHttpHeaders } from 'http';
import { JwtPayload } from 'jsonwebtoken';
import { AuthHeadersSchema } from '../schemas/auth-schema';
import { AuthenticatedUser } from '../schemas/user-schema';
import { TokenService } from '../services/token-service';
import { KEYCLOAK_ISSUER, KEYCLOAK_URL } from './constants';
import { apiError } from './types';

/**
 * Token Service
 *
 * @description Verifies jwt token against issuer.
 */
const tokenService = new TokenService({ tokenURI: KEYCLOAK_URL, tokenIssuer: KEYCLOAK_ISSUER });

/**
 * Get allowed audiences from ENV.
 *
 * @returns {string[]}
 */
const getAllowedAudiences = (): string[] => String(process.env.ALLOWED_AUD).split(' ');

/**
 * Authenticate the request's bearer token (JWT), audience and user header.
 *
 * Authentication criteria:
 *  1. Must provide correct auth headers ie: user + authorization (jwt bearer token).
 *  2. Token must be verifiable against the issuer (keycloak).
 *  3. Token audience (origin) must be allowed by Critterbase.
 *
 * @async
 * @param {IncomingHttpHeaders} headers - Request headers
 * @throws {apiError}  If token invalid, audience not supported or request is missing required headers
 * @returns {Promise<AuthenticatedUser>}
 */
export const authenticate = async (headers: IncomingHttpHeaders): Promise<AuthenticatedUser> => {
  // 1. Parse auth headers
  const validation = AuthHeadersSchema.safeParse(headers);

  // Invalid auth headers
  if (!validation.success) {
    throw apiError.forbidden(`Access Denied: Invalid auth headers.`, [validation.error.issues]);
  }

  // 2. Verify jwt token against issuer
  const verifiedToken = await tokenService.getVerifiedToken<JwtPayload>(validation.data.token);

  // 3. Validate the token audience is allowed
  const allowedAudiences = getAllowedAudiences();

  // Invalid token audience
  if (typeof verifiedToken.aud !== 'string') {
    throw apiError.forbidden(`Access Denied: Token audience invalid type.`);
  }

  if (!allowedAudiences.includes(verifiedToken.aud)) {
    throw apiError.forbidden(`Access Denied: Token audience not allowed. ${verifiedToken.aud}`);
  }

  //4. Return the authenticated user
  return {
    keycloak_uuid: validation.data.keycloak_uuid,
    user_identifier: validation.data.user_identifier,
    system_name: verifiedToken.aud
  };
};
