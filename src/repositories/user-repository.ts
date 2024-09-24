import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { CreateUser, UpdateUser, User, UserWithKeycloakUuid } from '../schemas/user-schema';
import { apiError } from '../utils/types';
import { Repository } from './base-repository';

export class UserRepository extends Repository {
  /**
   * Default user properties, omitting audit columns.
   *
   */
  private _userProperties = {
    user_id: true,
    keycloak_uuid: true,
    user_identifier: true
  };

  /**
   * Create a new user.
   *
   * Note: Using `ON CONFLICT DO NOTHING` to prevent race conditions with when loggin in a user.
   *
   * @async
   * @param {CreateUser} user - User data
   * @returns {User} Critterbase user
   */
  async createUser(user: CreateUser): Promise<User> {
    const result = await this.safeQuery(
      Prisma.sql`
        INSERT INTO "user" (
          keycloak_uuid,
          user_identifier
        )
        VALUES (
          ${user.keycloak_uuid},
          ${user.user_identifier}
        )
        ON CONFLICT (keycloak_uuid) DO NOTHING
        RETURNING user_id, keycloak_uuid, user_identifier
      `,
      z
        .object({
          user_id: z.string(),
          keycloak_uuid: z.string(),
          user_identifier: z.string()
        })
        .array()
    );

    if (!result.length) {
      throw apiError.sqlExecuteIssue('Error creating user', ['UserService->createUser', 'Response length was 0']);
    }

    return result[0];
  }

  /**
   * Adds or updates a user in the database.
   *
   * @param {CreateUser} user - User data
   * @returns {User} Critterbase user
   */
  async upsertUser(user: CreateUser): Promise<User> {
    return this.prisma.user.upsert({
      where: {
        keycloak_uuid: user.keycloak_uuid
      },
      update: user,
      create: user,
      select: this._userProperties
    });
  }

  /**
   * Get all users.
   *
   * @async
   * @returns {User[]} All critterbase users
   */
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany({ select: this._userProperties });
  }

  /**
   * Gets a user by id
   *
   * @async
   * @param {string} userId - User primary identifier
   * @returns {User}
   */
  async getUserById(userId: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        user_id: userId
      },
      select: this._userProperties
    });
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
    return this.prisma.user.update({
      where: {
        user_id: userId
      },
      data: user,
      select: this._userProperties
    });
  }

  /**
   * Deletes a user from the database
   * Note: In most scenarios this will fail due to constraints on related tables
   *
   * @async
   * @param {string} userId - The uuid / primary key for the user
   * @returns {User}
   */
  async deleteUserById(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        user_id: userId
      },
      select: this._userProperties
    });
  }

  /**
   * Sets the database user context - used for audit columns.
   *
   * @deprecated Eventually this will be replaced with `setDBContext` from context.ts.
   *
   * @async
   * @param {(string | null)} keycloakUuid - Keycloak primary identifier
   * @param {string} systemName - System name ie: `SIMS`
   * @returns {Promise<void>}
   */
  async setDatabaseUserContext(keycloakUuid: string | null, systemName: string): Promise<void> {
    await this.safeQuery(
      Prisma.sql`SELECT * FROM api_set_context(${keycloakUuid}, ${systemName});`,
      z.object({ api_set_context: z.string() }).array()
    );
  }

  /**
   * Find user by Keycloak uuid.
   *
   * @async
   * @param {string} keycloakUuid - Keycloak primary identifier
   * @throws {apiError.notFound} - User not found
   * @returns {Promise<User | null>}
   */
  async findUserByKeycloakUuid(keycloakUuid: string): Promise<UserWithKeycloakUuid | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        keycloak_uuid: keycloakUuid
      }
    });

    return user as UserWithKeycloakUuid | null;
  }
}
