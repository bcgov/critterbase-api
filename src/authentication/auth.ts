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
export const authenticateRequest = async function (req: Request): Promise<{keycloak_uuid: string, system_name: string}> {
  try {
    if (!req.headers.authorization) {
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
      console.log('Could not decode token.')
      throw apiError.forbidden('Access Denied');
    }

    // Get token header kid (key id)
    const kid = decodedToken.header.kid;

    if (!kid) {
      throw apiError.forbidden('Access Denied');
    }

    const jwksClient = new JwksClient({ jwksUri: KEYCLOAK_URL });

    // Get signing key from certificate issuer
    const key = await jwksClient.getSigningKey(kid);

    if (!key) {
      console.log('Key not found.');
      throw apiError.forbidden('Access Denied');
    }

    // Parse out public portion of signing key
    const signingKey = key.getPublicKey();

    // Verify token using public signing key
    const verifiedToken = verify(tokenString, signingKey, { issuer: [KEYCLOAK_ISSUER] });

    if (!verifiedToken) {
      console.log('Could not verify token.');
      throw apiError.forbidden('Access Denied');
    }

    const keycloak_uuid = (verifiedToken as BCGovJwtPayload).idir_user_guid ?? (verifiedToken as BCGovJwtPayload).bceid_user_guid ?? (verifiedToken as BCGovJwtPayload).bceid_business_guid;
    if(!keycloak_uuid) {
      throw apiError.serverIssue('Could not determine Keycloak identifier from token.');
    }
    return { keycloak_uuid: keycloak_uuid, system_name: (verifiedToken as BCGovJwtPayload).aud as string };
  } catch (error) {
    console.log(JSON.stringify(error));
    throw apiError.forbidden('Access Denied');
  }
};

