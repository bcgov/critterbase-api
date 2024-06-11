/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Request } from 'express';
import { apiError } from '../utils/types';
import { JwtPayload } from 'jsonwebtoken';
import { TokenVerifier } from '../utils/token-verifier';
import { AuthorizationHeadersSchema } from '../utils/zod_helpers';
import { ZodError } from 'zod';
import { AuthorizedUser } from '../schemas/user-schema';

const KEYCLOAK_URL = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`;
const KEYCLOAK_ISSUER = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}`;
const ALLOWED_AUDIENCES = String(process.env.ALLOWED_AUD).split(' ');

type BCGovJwtPayload = JwtPayload & {
  idir_user_guid?: string;
  bceid_user_guid?: string;
  bceid_business_guid?: string;
  idir_username?: string;
  bceid_username?: string;
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
    const verifiedToken = await tokenService.getVerifiedToken<BCGovJwtPayload>(authorization);

    // Validate the token audience is allowed in ENV variable (ALLOWED_AUD): space delimited list
    if (typeof verifiedToken.aud !== 'string' || !ALLOWED_AUDIENCES.includes(verifiedToken.aud)) {
      throw apiError.forbidden(`Token audience not allowed: '${verifiedToken.aud}'`);
    }

    const authorizedUser = {
      keycloak_uuid: user.keycloak_guid.toUpperCase(),
      user_identifier: user.username,
      system_name: String(verifiedToken.clientId)
    };

    console.info(`(${authorizedUser.system_name}) ${authorizedUser.user_identifier}:${authorizedUser.keycloak_uuid}`);

    return authorizedUser;
  } catch (error: unknown) {
    if (error instanceof apiError || error instanceof ZodError) {
      throw apiError.forbidden(`Access Denied: ${error.message}`);
    }
    throw error;
  }
};

//TODO: Remove
//
//// Check if the header is a valid bearer format
//if (!authorizationHeaderString.startsWith('Bearer ')) {
//  console.log('Could not get Bearer format.');
//  throw apiError.forbidden('Access Denied');
//}
//
//// Parse out token portion of the authorization header
//const tokenString = authorizationHeaderString.split(' ')[1];
//
//if (!tokenString) {
//  console.log('Could not get tokenString');
//  throw apiError.forbidden('Access Denied');
//}
//
//// Decode token without verifying signature
//const decodedToken = decode(tokenString, { complete: true, json: true });
//
//if (!decodedToken) {
//  console.log('Could not decode token.');
//  throw apiError.forbidden('Access Denied');
//}
//
//// Get token header kid (key id)
//const kid = decodedToken.header.kid;
//
//if (!kid) {
//  console.log('No key id in token');
//  throw apiError.forbidden('Access Denied');
//}
//
//const jwksClient = new JwksClient({ jwksUri: KEYCLOAK_URL });
//
//// Get signing key from certificate issuer
//const key = await jwksClient.getSigningKey(kid);
//
//// This ESLint warning makes no sense
//// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//if (!key) {
//  console.log('Key not found.');
//  throw apiError.forbidden('Access Denied');
//}
//
//// Parse out public portion of signing key
//const signingKey = key.getPublicKey();
//
//// Verify token using public signing key
//const verifiedToken = verify(tokenString, signingKey, {
//  issuer: [KEYCLOAK_ISSUER]
//});
//
//if (!verifiedToken || typeof verifiedToken === 'string') {
//  console.log('Could not verify token.');
//  throw apiError.forbidden('Access Denied');
//}
