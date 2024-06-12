import { Request } from 'express';
import { apiError } from '../utils/types';
import { ZodError } from 'zod';
import { AuthorizedUser } from '../schemas/user-schema';
import { ALLOWED_AUDIENCES, KEYCLOAK_ISSUER, KEYCLOAK_URL } from '../utils/constants';
import { JwtPayload } from 'jsonwebtoken';
import { TokenVerifier } from '../utils/token-verifier';
import { IncomingHttpHeaders } from 'http';

type AuthPayload = {
  /**
   * Bearer token
   */
  token: string;
  /**
   * Keycloak "uuid"
   */
  keycloak_uuid: string;
  /**
   * External system user identifier: aka 'username'
   */
  user_identifier: string;
};

/**
 * Token Verifier
 * @description Verifies jwt token against issuer.
 */
const tokenVerifier = new TokenVerifier({ tokenURI: KEYCLOAK_URL, tokenIssuer: KEYCLOAK_ISSUER });

/**
 * Parse incomming auth headers.
 *
 * @param {IncomingHttpHeaders} headers - Request headers
 * @throws {apiError} - If unable to parse authorization or user header
 * @returns {AuthPayload}
 */
const parseAuthHeaders = (headers: IncomingHttpHeaders): AuthPayload => {
  const token = headers.authorization?.split(' ')?.[1];

  if (!token) {
    throw new apiError(`Unable to parse Bearer token from 'authorization' header.`);
  }

  try {
    const user = JSON.parse(headers.user as string) as { keycloak_guid: string; username: string };

    return { token, keycloak_uuid: user.keycloak_guid, user_identifier: user.username };
  } catch (err) {
    throw new apiError(`Malformed 'user' header, expecting {'keycloak_guid': 'ABC', 'username': 'SteveBrule'}`);
  }
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
  try {
    // Parse auth headers
    const { token, keycloak_uuid, user_identifier } = parseAuthHeaders(req.headers);

    // Retrive verified token from authorization header (Bearer token)
    const verifiedToken = await tokenVerifier.getVerifiedToken<JwtPayload>(token);

    // Validate the token audience is allowed
    if (typeof verifiedToken.aud !== 'string' || !ALLOWED_AUDIENCES.includes(verifiedToken.aud)) {
      throw new apiError(`Token audience not allowed.`);
    }

    return {
      keycloak_uuid,
      user_identifier,
      system_name: verifiedToken.aud
    };
  } catch (error: unknown) {
    if (error instanceof apiError || error instanceof ZodError) {
      throw apiError.forbidden(`Access Denied: ${error.message}`, ['auth->authenticateRequest']);
    }
    throw error;
  }
};
