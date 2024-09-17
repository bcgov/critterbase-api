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
   * Adds a user to the database.
   *
   * @async
   * @param {CreateUser} user - User data
   * @returns {User} Critterbase user
   */
  async createOrGetUser(user: CreateUser): Promise<User> {
    return this.repository.createOrGetUser(user);
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
   * @async
   * @param {string} keycloakUuid - Keycloak primary identifier
   * @param {string} systemName - System name ie: `SIMS`
   * @returns {Promise<void>}
   */
  async setDatabaseUserContext(keycloakUuid: string, systemName: string): Promise<void> {
    return this.repository.setDatabaseUserContext(keycloakUuid, systemName);
  }

  /**
   * Get user by Keycloak uuid.
   *
   * @async
   * @param {string} keycloakUuid - Keycloak primary identifier
   * @throws {apiError.notFound} - User not found
   * @returns {Promise<User>}
   */
  async getUserByKeycloakUuid(keycloakUuid: string): Promise<UserWithKeycloakUuid> {
    return this.repository.getUserByKeycloakUuid(keycloakUuid);
  }

  /**
   * Login the user to critterbase and set database context
   * Note: The database context allows subsequent requests to populate the audit columns
   *
   * @async
   * @param {AuthenticatedUser} payload - User to login
   * @throws {apiError.unauthorized} - User is unauthorized
   * @returns {Promise<void>}
   */
  async loginUser(payload: AuthenticatedUser): Promise<void> {
    try {
      // Try to get existing user
      // If exists, set context, return
      // If not exits, set null context, create, set context, return

      await this.repository.setDatabaseUserContext(null, payload.system_name);

      const createOrGetUserPromise = await this.repository.createOrGetUser({
        keycloak_uuid: payload.keycloak_uuid,
        user_identifier: payload.user_identifier
      });

      await this.repository.setDatabaseUserContext(createOrGetUserPromise.keycloak_uuid, payload.system_name);
    } catch (err) {
      throw apiError.unauthorized('Login failed. User is not authorized', ['UserService->loginUser', err]);
    }
  }
}
