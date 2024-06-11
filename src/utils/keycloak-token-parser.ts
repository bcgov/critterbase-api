import { JwtPayload } from 'jsonwebtoken';
import { apiError } from './types';
/**
 * Additional details on what is included in keycloak tokens
 * https://bcgov.github.io/keycloak-example-apps/
 */
export type KeycloakJwtPayload = JwtPayload & {
  idir_user_guid?: string;
  bceid_user_guid?: string;
  idir_username?: string;
  bceid_username?: string;
};

/**
 * @export
 * @class KeycloakTokenParser
 * @description Parse important details from keycloak token. Prioritizes `idir` properties.
 */
export class KeycloakTokenParser {
  token: KeycloakJwtPayload;

  /**
   * Construct instance of KeycloakTokenParser
   *
   * @memberof KeycloakTokenParser
   * @param {KeycloakJwtPayload} token - Keycloak JWT Token
   */
  constructor(token: KeycloakJwtPayload) {
    this.token = token;
  }

  /**
   * Get the keycloak id of the token.
   *
   * @throws {apiError} - Token missing uuid property
   * @returns {string} UUID
   */
  get id(): string {
    if (this.token.idir_user_guid) {
      return this.token.idir_user_guid;
    }
    if (this.token.bceid_user_guid) {
      return this.token.bceid_user_guid;
    }
    throw new apiError('Keycloak token missing user uuid.');
  }

  /**
   * Get the username of the token.
   *
   * @throws {apiError} - Token missing username property
   * @returns {string} Username
   */
  get username(): string {
    if (this.token.idir_username) {
      return this.token.idir_username;
    }
    if (this.token.bceid_username) {
      return this.token.bceid_username;
    }
    throw new apiError('Keycloak token missing username.');
  }

  /**
   * Get the system / audience of the token.
   *
   * @throws {apiError} - Token missing audience property
   * @returns {string} System name
   */
  get system(): string {
    if (!this.token.aud && !this.token.aud?.length) {
      throw new apiError('Keycloak token missing client id.');
    }

    if (Array.isArray(this.token.aud)) {
      return this.token.aud[0];
    }

    return this.token.aud;
  }
}
