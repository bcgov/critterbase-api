import { IncomingHttpHeaders } from 'http';
import { TokenService } from './token-service';
import { UserService } from './user-service';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { ALLOWED_AUDIENCES } from '../utils/constants';
import { apiError } from '../utils/types';
import { AuthenticatedUser } from '../schemas/user-schema';
import { ZodError } from 'zod';
import { AuthHeadersSchema } from '../schemas/auth-schema';

/**
 * Authentication / Authorization Service
 *
 * @export
 * @class AuthService
 */
export class AuthService {
  /**
   * Verifies the token against the issuer.
   *
   */
  _tokenService: TokenService;
  /**
   * Grants ability to login the user to the API.
   *
   */
  _userService: UserService;
  /**
   * Allowed token audiences.
   *
   */
  _allowedAudiences: string[];

  /**
   * Constructs an instance of AuthService.
   *
   * @param {TokenService} tokenVerifier - JWT token verifier
   * @param {UserService} userService - User Service
   */
  constructor(tokenVerifier: TokenService, userService: UserService) {
    this._tokenService = tokenVerifier;
    this._userService = userService;
    this._allowedAudiences = ALLOWED_AUDIENCES;
  }

  /**
   * Authenticate the request's bearer token (JWT), audience and user header.
   * Authentication criteria:
   *  1. Must provide correct auth headers ie: user + authorization (jwt bearer token).
   *  2. Token must be verifiable against the issuer (keycloak).
   *  3. Token audience (origin) must be allowed by Critterbase.
   *
   * @async
   * @memberof AuthService
   * @param {IncomingHttpHeaders} headers
   * @throws {apiError} If token invalid, audience not supported or request is missing required headers
   * @returns {AuthenticatedUser} The authenticated user
   */
  async authenticate(headers: IncomingHttpHeaders): Promise<AuthenticatedUser> {
    try {
      // 1. Parse auth headers
      const { token, keycloak_uuid, user_identifier } = AuthHeadersSchema.parse(headers);

      // 2. Verify jwt token against issuer
      const verifiedToken = await this._tokenService.getVerifiedToken<JwtPayload>(token);

      // 3. Validate the token audience is allowed
      const audience = this._authenticateTokenAudience(verifiedToken);

      //4. Return the authenticated user
      return {
        keycloak_uuid,
        user_identifier,
        system_name: audience
      };
    } catch (error) {
      this._errorHandler(error);
    }
  }

  /**
   * Authorize the user into Critterbase API.
   *
   * @async
   * @memberof AuthService
   * @param {AuthenticatedUser} authenticatedUser - Authenticated user
   * @returns {Promise<void>}
   */
  async authorize(authenticatedUser: AuthenticatedUser) {
    return this._userService.loginUser(authenticatedUser);
  }

  /**
   * Authenticate the token's audience against the list of audiences Critterbase allows.
   * Note: `audience` is assigned to the token from the origin. ie: sims-svc-4464
   *
   * @param {JwtPayload} verifiedToken - Verified JWT token
   * @throws {apiError} - If unable to authenticate audience
   * @returns {string} Token audience
   */
  _authenticateTokenAudience(verifiedToken: JwtPayload): string {
    if (typeof verifiedToken.aud !== 'string') {
      throw new apiError(`Token audience invalid type.`);
    }

    if (!this._allowedAudiences.includes(verifiedToken.aud)) {
      throw new apiError(`Token audience not allowed. ${verifiedToken.aud}`);
    }

    return verifiedToken.aud;
  }

  /**
   * Handles caught errors and re-throws as correct format.
   *
   * @param {unknown} error - Caught error
   * @throws {apiError} - Re-throws caught errors into correct format
   * @returns {never}
   */
  _errorHandler(error: unknown): never {
    /**
     * Manually thrown errors from services.
     */
    if (error instanceof apiError) {
      throw apiError.forbidden(`Access Denied: ${error.message}`);
    }

    /**
     * Zod validation errors from parsing headers.
     */
    if (error instanceof ZodError) {
      throw apiError.forbidden(`Access Denied: Invalid auth headers`, [error.issues]);
    }

    /**
     * Expired token errors.
     */
    if (error instanceof TokenExpiredError) {
      throw apiError.forbidden(`Access Denied: JWT bearer token has expired.`);
    }

    throw error;
  }
}
