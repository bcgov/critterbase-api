import { UserRepository } from '../repositories/user-repository';
import { CreateUser, UpdateUser, User, UserWithKeycloakUuid } from '../schemas/user-schema';
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
    return new UserService(new UserRepository());
  }

  /**
   * Adds a user to the database.
   *
   * @async
   * @param {CreateUser} user - User data
   * @returns {User} Critterbase user
   */
  async createUser(user: CreateUser): Promise<User> {
    return this.createUser(user);
  }

  /**
   * Adds or updates a user in the database.
   *
   * @param {CreateUser} user - User data
   * @returns {User} Critterbase user
   */
  async upsertUser(user: CreateUser): Promise<User> {
    return this.upsertUser(user);
  }

  /**
   * Get all users
   *
   * @async
   * @returns {User[]} All critterbase users
   */
  async getUsers(): Promise<User[]> {
    return this.getUsers();
  }

  /**
   * Gets a user by id.
   *
   * @async
   * @param {string} userId - User primary identifier
   * @returns {User}
   */
  async getUserById(userId: string): Promise<User> {
    return this.getUserById(userId);
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
    return this.updateUser(userId, user);
  }

  /**
   * Deletes a user from the database.
   * Note: In most scenarios this will fail due to constraints on related tables.
   *
   * @async
   * @param {string} userId - The uuid / primary key for the user
   * @returns {User}
   */
  async deleteUser(userId: string): Promise<User> {
    return this.deleteUser(userId);
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
    return this.setDatabaseUserContext(keycloakUuid, systemName);
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
   * @param {string} keycloakUuid - Keycloak primary identifier
   * @param {string} systemName - System name
   * @throws {apiError.unauthorized} - User is unauthorized
   * @returns {Promise<void>}
   */
  async loginUser(keycloakUuid: string, systemName: string): Promise<void> {
    try {
      const user = await this.getUserByKeycloakUuid(keycloakUuid);
      await this.setDatabaseUserContext(user.keycloak_uuid, systemName);
    } catch (err) {
      throw apiError.unauthorized('Login failed. User is not authorized', ['UserService->loginUser', err]);
    }
  }
}
