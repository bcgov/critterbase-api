import { IncomingHttpHeaders } from 'http';
import { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { apiError } from './types';

/**
 * Get the allowed audience list from the environment.
 *
 * Note: ENV variable `ALLOWED_AUD` is a space separated list of allowed audiences.
 *
 * @returns {string[]} List of allowed audiences
 */
export const getAllowList = (): string[] => {
  return String(process.env.ALLOWED_AUD).split(' ');
};

/**
 * Get the token audience from the token payload.
 *
 * @throws {apiError} - If token audience is invalid
 * @param {JwtPayload} token - Decoded token
 */
export const getAuthTokenAudience = (token: JwtPayload): string => {
  if (typeof token.aud !== 'string') {
    throw new apiError('Token audience invalid.');
  }

  return token.aud;
};

/**
 * Get the bearer token from the request headers.
 *
 * @param {IncomingHttpHeaders} headers - Request headers
 * @throws {apiError.forbidden} If token is invalid
 * @returns {string} Authorization token
 */
export const getAuthToken = (headers: IncomingHttpHeaders): string => {
  const token = headers.authorization?.split(' ')[1];

  if (typeof token !== 'string') {
    throw new apiError(`Invalid authorization token.`);
  }

  return token;
};

/**
 * Get the auth user from the request headers.
 *
 * @param {IncomingHttpHeaders} headers - Request headers
 * @throws {apiError.forbidden} - If user header is malformed
 * @returns {AuthUser}
 */
export const getAuthUser = (headers: IncomingHttpHeaders) => {
  try {
    const jsonUser = JSON.parse(headers.user as string) as { keycloak_guid: unknown; username: unknown };
    const parsedUser = z.object({ keycloak_guid: z.string(), username: z.string() }).parse(jsonUser);

    return { keycloak_uuid: parsedUser.keycloak_guid, user_identifier: parsedUser.username };
  } catch (err) {
    throw new apiError(
      `Malformed auth user header. Expecting user header '{"keycloak_guid": "AAA", "username": "SteveBrule"}'`
    );
  }
};
