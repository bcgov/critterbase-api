import { JwksClient } from 'jwks-rsa';
import { apiError } from './types';
import { Jwt, JwtPayload, decode, verify } from 'jsonwebtoken';

/**
 * TokenVerifier constructor config
 *
 */
interface ITokenVerifierConfig {
  /**
   * Token URI: ie: `https://dev.loginproxy.gov.bc.ca/auth/realms/standard/protocol/openid-connect/certs`
   */
  tokenURI: string;
  /**
   * Token issuer ie: `https://dev.loginproxy.gov.bc.ca/auth/realms/standard`
   */
  tokenIssuer: string;
}

/**
 * @export
 * @class TokenVerifier
 * @description Verify a JWT token against its issuer.
 */
export class TokenVerifier {
  _tokenClient: JwksClient;
  _tokenIssuer: string;

  /**
   * Construct instance of TokenVerifier.
   *
   * @memberof TokenVerifier
   * @param {ITokenVerifierConfig} config - Contains tokenURI and tokenIssuer
   */
  constructor(config: ITokenVerifierConfig) {
    this._tokenIssuer = config.tokenIssuer;
    this._tokenClient = new JwksClient({ jwksUri: config.tokenURI });
  }

  /**
   * Get bearer token from auth header.
   *
   * @memberof TokenVerifier
   * @param {string} authHeader - Authorization header
   * @throws {apiError} - If unable to parse bearer token from auth header
   * @returns {string} String bearer token
   */
  _getBearerTokenFromAuthHeader(authHeader: string): string {
    // Validate the authorization header is formed correctly
    if (!authHeader.startsWith('Bearer')) {
      throw new apiError('Authorization header should begin with `Bearer `.');
    }

    // Split off the bearer token ['Bearer', 'xxxx.yyyyy.xxxx']
    const tokenString = authHeader.split(' ')[1];

    if (!tokenString) {
      throw new apiError('Parsed bearer token was undefined.');
    }

    return tokenString;
  }

  /**
   * Get decoded token.
   *
   * @memberof TokenVerifier
   * @throws {apiError} - If unabled to decode token
   * @returns {Jwt} Jwt token
   */
  _getDecodedToken(tokenString: string): Jwt {
    // Get decoded jwt token
    const jwtToken = decode(tokenString, { complete: true, json: true });

    if (!jwtToken) {
      throw new apiError('Decoded token was undefined.');
    }

    return jwtToken;
  }

  /**
   * Get token key id.
   *
   * @memberof TokenVerifier
   * @throws {apiError} - If key id is not defined in token.
   * @returns {string} Token key identfier
   */
  _getTokenKeyId(jwtToken: Jwt): string {
    // Get key id from jwt token
    const keyId = jwtToken.header.kid;

    if (!keyId) {
      throw new apiError('Token key ID was undefined.');
    }

    return keyId;
  }

  /**
   * Get token public key - used to verify the token against issuer.
   *
   * @async
   * @memberof TokenVerifier
   * @param {string} tokenKeyId - Token key id
   * @throws {apiError} - If generated signing key is undefined
   * @returns {Promise<string>} Public key
   */
  async _getPublicKeyFromTokenKeyId(tokenKeyId: string): Promise<string> {
    // Get signing key from token client
    const signingKey = await this._tokenClient.getSigningKey(tokenKeyId);

    if (!signingKey) {
      throw new apiError('Token public key was undefined.');
    }

    return signingKey.getPublicKey();
  }

  /**
   * Verify the token string against the singing key.
   *
   * @memberof TokenVerifier
   * @param {string} tokenString - String bearer token
   * @param {string} publicKey - Token public key
   * @throws {apiError} - If unable to verify the token with singing key
   * @returns {JwtPayload} Jwt token
   */
  _verifyToken(tokenString: string, publicKey: string): JwtPayload {
    // Verify token using public signing key
    const verifiedToken = verify(tokenString, publicKey, {
      issuer: [this._tokenIssuer]
    });

    if (!verifiedToken || typeof verifiedToken === 'string') {
      throw new apiError('Token not verified.');
    }

    return verifiedToken;
  }

  /**
   * Retrieve and verify auth-header token against issuer.
   *
   * @async
   * @memberof TokenVerifier
   * @throws {apiError} - If unable to correctly verify token against token issuer
   * @returns {Promise<JwtPayload>} Jwt Token
   */
  async getVerifiedToken<T extends JwtPayload>(authHeader: string): Promise<T> {
    // Strip the bearer token from the auth header
    const bearerToken = this._getBearerTokenFromAuthHeader(authHeader);

    // Decode the jwt token
    const jwtToken = this._getDecodedToken(bearerToken);

    // Get the key identifier from the jwt token
    const tokenKeyId = this._getTokenKeyId(jwtToken);

    // Get the public key from the token key identifier
    const publicKey = await this._getPublicKeyFromTokenKeyId(tokenKeyId);

    // Return the verified token (cast to the correct extended type)
    return this._verifyToken(bearerToken, publicKey) as T;
  }
}
