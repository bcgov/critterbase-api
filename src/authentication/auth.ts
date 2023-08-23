/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Request } from "express";
import { apiError } from "../utils/types";
import { JwtPayload, decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

const KEYCLOAK_URL = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`;
const KEYCLOAK_ISSUER = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}`;

type BCGovJwtPayload = JwtPayload & {
  idir_user_guid?: string;
  bceid_user_guid?: string;
  bceid_business_guid?: string;
  idir_username?: string;
  bceid_username?: string;
}

type UserHeader = {
  keycloak_guid: string;
  username: string;
}

/**
 * Authenticate the request by validating the authorization bearer token (JWT).
 *
 * Assign the bearer token to `req.keycloak_token`.
 *
 * @param {Request} req
 * @return {*} {Promise<true>} true if the token is authenticated
 * @throws {HTTP401} if the bearer token is missing or invalid
 */
export const authenticateRequest = async function(req: Request): Promise<{ keycloak_uuid: string, system_name: string, identifier: string }> {
  try {
    if (!req.headers.authorization) {
      console.log('No auth header found');
      throw apiError.forbidden('Access Denied');
    }
    // Authorization header should be a string with format: Bearer xxxxxx.yyyyyyy.zzzzzz
    const authorizationHeaderString = req.headers.authorization;

    // Check if the header is a valid bearer format
    if (!authorizationHeaderString.startsWith('Bearer ')) {
      console.log('Could not get Bearer format.')
      throw apiError.forbidden('Access Denied');
    }

    // Parse out token portion of the authorization header
    const tokenString = authorizationHeaderString.split(' ')[1];

    if (!tokenString) {
      console.log('Could not get tokenString');
      throw apiError.forbidden('Access Denied');
    }

    // Decode token without verifying signature
    const decodedToken = decode(tokenString, { complete: true, json: true });

    if (!decodedToken) {
      console.log('Could not decode token.');
      throw apiError.forbidden('Access Denied');
    }

    // Get token header kid (key id)
    const kid = decodedToken.header.kid;

    if (!kid) {
      console.log('No key id in token');
      throw apiError.forbidden('Access Denied');
    }

    const jwksClient = new JwksClient({ jwksUri: KEYCLOAK_URL });

    // Get signing key from certificate issuer
    const key = await jwksClient.getSigningKey(kid);

    // This ESLint warning makes no sense
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!key) {
      console.log('Key not found.');
      throw apiError.forbidden('Access Denied');
    }

    // Parse out public portion of signing key
    const signingKey = key.getPublicKey();

    // Verify token using public signing key
    const verifiedToken = verify(tokenString, signingKey, { issuer: [KEYCLOAK_ISSUER] });

    if (!verifiedToken || typeof verifiedToken === 'string') {
      console.log('Could not verify token.');
      throw apiError.forbidden('Access Denied');
    }

    const allowedAudiences = String(process.env.ALLOWED_AUD).split(' ');
    const bcgovToken = verifiedToken as BCGovJwtPayload;
    if (typeof bcgovToken.aud !== 'string' || !allowedAudiences.includes(bcgovToken.aud)) {
      console.log('Client not found');
      throw apiError.forbidden('Access Denied');
    }

    const user = JSON.parse(req.headers.user as string) as UserHeader;
    if (!user.keycloak_guid || !user.username) {
      throw apiError.syntaxIssue('User header was not provided.');
    }
    return {
      keycloak_uuid: user.keycloak_guid,
      identifier: user.username,
      system_name: String(bcgovToken.client_id),
    };
  } catch (error) {
    console.log(JSON.stringify(error));
    throw apiError.forbidden('Access Denied');
  }
};

