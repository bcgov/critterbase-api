import { UserRepository } from '../repositories/user-repository';
import { AuthenticatedUser, CreateUser, UpdateUser, User, UserWithKeycloakUuid } from '../schemas/user-schema';
import { prisma } from '../utils/constants';
import { apiError } from '../utils/types';
import { Service } from './base-service';

export class UserService implements Service {
  repository: UserRepository;

  /**
   * Construct UserService class.
   *
   * @param {XrefRepository} repository - Repository dependency.
   */
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  /**
   * Instantiate UserService and inject dependencies.
   *
   * @static
   * @returns {XrefService}
   */
  static init(): UserService {
    return new UserService(new UserRepository(prisma));
  }

  /**
   * Create a new user.
   *
   * @async
   * @param {CreateUser} user - User data
   * @returns {User} Critterbase user
   */
  async createUser(user: CreateUser): Promise<User> {
    return this.repository.createUser(user);
  }

  /**
   * Adds or updates a user in the database.
   *
   * @param {CreateUser} user - User data
   * @returns {User} Critterbase user
   */
  async upsertUser(user: CreateUser): Promise<User> {
    return this.repository.upsertUser(user);
  }

  /**
   * Get all users
   *
   * @async
   * @returns {User[]} All critterbase users
   */
  async getUsers(): Promise<User[]> {
    return this.repository.getUsers();
  }

  /**
   * Gets a user by id.
   *
   * @async
   * @param {string} userId - User primary identifier
   * @returns {User}
   */
  async getUserById(userId: string): Promise<User> {
    return this.repository.getUserById(userId);
  }

  /**
   * Updates a user in the database.
   *
   * @async
   * @param {string} userId - User primary identifier
   * @param {UserUpdateInput} user - User to update
   * @returns {User}
   */
  async updateUser(userId: string, user: UpdateUser): Promise<User> {
    return this.repository.updateUser(userId, user);
  }

  /**
   * Deletes a user from the database.
   * Note: In most scenarios this will fail due to constraints on related tables.
   *
   * @async
   * @param {string} userId - The uuid / primary key for the user
   * @returns {User}
   */
  async deleteUserById(userId: string): Promise<User> {
    return this.repository.deleteUserById(userId);
  }

  /**
   * Sets the database user context - used for audit columns.
   *
   * @deprecated Eventually this will be replaced with `setDBContext` from context.ts.
   *
   * Note: Setting the keycloak uuid to null will default to the SYSTEM context.
   *
   * @async
   * @param {string | null} keycloakUuid - Keycloak primary identifier
   * @param {string} systemName - System name ie: `SIMS`
   * @returns {Promise<void>}
   */
  async setDatabaseUserContext(keycloakUuid: string | null, systemName: string): Promise<void> {
    return this.repository.setDatabaseUserContext(keycloakUuid, systemName);
  }

  /**
   * Find user by Keycloak uuid.
   *
   * @async
   * @param {string} keycloakUuid - Keycloak primary identifier
   * @throws {apiError.notFound} - User not found
   * @returns {Promise<UserWithKeycloakUuid | null>}
   */
  async findUserByKeycloakUuid(keycloakUuid: string): Promise<UserWithKeycloakUuid | null> {
    return this.repository.findUserByKeycloakUuid(keycloakUuid);
  }

  /**
   * Login the user and set the database context.
   *
   * Note: The database context allows subsequent requests to populate the audit columns.
   *
   * TODO: Update this method when the new design is implemented.
   * Eventually the routes will be handling the transactions, which will set the context and
   * make the request under the same transaction client.
   *
   * Flows:
   *    New user: Set context (SYSTEM) -> Create user -> Set context (User)
   *    Existing user: Find user (Keycloak UUID) -> Set user context (User)
   *
   * @async
   * @param {AuthenticatedUser} payload - User to login
   * @throws {apiError.unauthorized} - User is unauthorized
   * @returns {Promise<void>}
   */
  async loginUser(payload: AuthenticatedUser): Promise<User> {
    /**
     * WARNING: There is a race condition with `setDatabaseUserContext` when multiple requests
     * are made at the same time. The setDatabaseUserContext will set the context for the incomming request,
     * but if another request is made before the first one completes, the context will be overwritten.
     * This will create issues with the audit columns.
     */
    try {
      const user = await this.findUserByKeycloakUuid(payload.keycloak_uuid);

      if (user) {
        // User exists, set the context and return
        // TODO: Drop this once the new design is implemented
        await this.setDatabaseUserContext(user.keycloak_uuid, payload.system_name);
        return user;
      }

      // Set the context to null (SYSTEM)
      // NOTE: This will stay, context will need to be set to SYSTEM for a new user
      await this.setDatabaseUserContext(null, payload.system_name);

      const newUser = await this.createUser({
        keycloak_uuid: payload.keycloak_uuid,
        user_identifier: payload.user_identifier
      });

      // Set the context to the new user
      // TODO: Drop this once the new design is implemented
      await this.setDatabaseUserContext(newUser.keycloak_uuid, payload.system_name);

      return newUser;
    } catch (err) {
      throw apiError.unauthorized('Login failed. User is not authorized', ['UserService->loginUser', err]);
    }
  }
}
