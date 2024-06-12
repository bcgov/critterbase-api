import { Request } from 'express';
import { apiError } from '../utils/types';
import { TokenVerifier } from '../utils/token-verifier';
import { AuthorizationHeadersSchema } from '../utils/zod_helpers';
import { ZodError } from 'zod';
import { AuthorizedUser } from '../schemas/user-schema';
import { ALLOWED_AUDIENCES, KEYCLOAK_ISSUER, KEYCLOAK_URL } from '../utils/constants';
import { JwtPayload } from 'jsonwebtoken';

export type KeycloakJwtPayload = JwtPayload & {
  idir_user_guid?: string;
  bceid_user_guid?: string;
  idir_username?: string;
  bceid_username?: string;
  clientId: string;
};

/**
 * Authenticate the request's bearer token (JWT), audience and user header.
 *
 * @async
 * @param {Request} req
 * @throws {apiError} If token invalid, audience not supported or request is missing required headers
 * @returns {AuthorizedUser} The authorized user
 */
export const authenticateRequest = async function (req: Request): Promise<AuthorizedUser> {
  const tokenService = new TokenVerifier({
    tokenURI: KEYCLOAK_URL,
    tokenIssuer: KEYCLOAK_ISSUER
  });

  try {
    // Parse authorization and user object from headers
    const { authorization, user } = AuthorizationHeadersSchema.parse(req.headers);

    // Retrive verified token from authorization header (Bearer token)
    const verifiedToken = await tokenService.getVerifiedToken<KeycloakJwtPayload>(authorization);

    // Validate the token audience is allowed
    if (typeof verifiedToken.aud !== 'string' || !ALLOWED_AUDIENCES.includes(verifiedToken.aud)) {
      throw new apiError(`Token audience not allowed`);
    }

    return {
      keycloak_uuid: user.keycloak_guid,
      user_identifier: user.username,
      system_name: verifiedToken.clientId
    };
  } catch (error: unknown) {
    if (error instanceof apiError) {
      throw apiError.forbidden(`Access Denied: ${error.message}`, ['auth->authenticateRequest']);
    }
    if (error instanceof ZodError) {
      throw apiError.forbidden(`Access Denied: Malformed headers ('authorization' or 'user')`, error.issues);
    }
    throw error;
  }
};
