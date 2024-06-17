import { JwksClient } from 'jwks-rsa';
import { apiError } from '../utils/types';
import { Jwt, JwtPayload, decode, verify } from 'jsonwebtoken';

/**
 * TokenService constructor config
 *
 */
interface TokenServiceConfig {
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
 * @class TokenService
 * @description Verify a JWT token against its issuer.
 */
export class TokenService {
  _tokenClient: JwksClient;
  _tokenIssuer: string;

  /**
   * Construct instance of TokenService.
   *
   * @memberof TokenService
   * @param {ITokenVerifierConfig} config - Contains tokenURI and tokenIssuer
   */
  constructor(config: TokenServiceConfig) {
    this._tokenIssuer = config.tokenIssuer;
    /**
     * https://github.com/auth0/node-jwks-rsa/blob/master/EXAMPLES.md
     */
    this._tokenClient = new JwksClient({
      cache: true,
      cacheMaxAge: 600000, // 10 minutes
      jwksUri: config.tokenURI
    });
  }

  /**
   * Get decoded token.
   *
   * @memberof TokenService
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
   * @memberof TokenService
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
   * @memberof TokenService
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
   * @memberof TokenService
   * @param {string} tokenString - String bearer token
   * @param {string} publicKey - Token public key
   * @throws {apiError} - If unable to verify the token with singing key
   * @returns {JwtPayload} Jwt token
   */
  _verifyToken(tokenString: string, publicKey: string): JwtPayload {
    // Verify token using public key
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
   * @memberof TokenService
   * @param {string} bearerToken - String bearer token
   * @throws {apiError} - If unable to correctly verify token against token issuer
   * @returns {Promise<JwtPayload>} Jwt Token
   */
  async getVerifiedToken<T extends JwtPayload>(bearerToken: string): Promise<T> {
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
