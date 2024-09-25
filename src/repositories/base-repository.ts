import { Prisma } from '@prisma/client';
import { isDeepStrictEqual } from 'util';
import { z } from 'zod';
import { DBClient, DBTxClient } from '../client/client';
import { IS_DEV } from '../utils/constants';
import { apiError } from '../utils/types';

/**
 * Base class for Critterbase Repositories.
 *
 * @export
 * @class Repository
 */
export class Repository {
  prisma: DBClient | DBTxClient; // TODO: rename to client

  constructor(client: DBClient | DBTxClient) {
    this.prisma = client;
  }

  /**
   * Safely queries with prisma raw sql and validates against zod schema.
   * Validation only in DEV environments.
   *
   * @async
   * @template TSchema - Zod Schema generic.
   * @param {TSql} sql - Raw SQL. Prisma.sql template string.
   * @param {TSchema} schema - Zod Schema
   * @throws {apiError.sqlExecuteIssue} - if query response fails validation.
   * @returns {Promise<z.TypeOf<TSchema>>} inferred type from zod schema.
   */
  async safeQuery<TSchema extends z.ZodTypeAny>(sql: Prisma.Sql, schema: TSchema): Promise<z.infer<TSchema>> {
    const result = await this.prisma.$queryRaw(sql);

    if (!IS_DEV) {
      return result;
    }

    const parsed = schema.safeParse(result);

    if (!parsed.success) {
      console.log(parsed.error.errors, JSON.stringify(result, null, 2));

      throw apiError.requestIssue('Failed to parse raw sql with provided Zod schema.', parsed.error.errors);
    }

    return result;
  }

  /**
   * REFACTOR TOOL
   *
   * Validates strict equality between two objects.
   * Used when refactoring services / repositories.
   *
   * @template TNew
   * @template TOld
   * @param {TNew} newResponse - New response object.
   * @param {TOld} oldResponse - Old response object.
   * @throws {Error} - Throws if objects are not equal.
   * @returns {TNew} New response.
   */
  validateSameResponse<TNew, TOld>(newResponse: TNew, oldResponse: TOld): TNew {
    if (!isDeepStrictEqual(newResponse, oldResponse)) {
      throw apiError.requestIssue(`New response is not the same as old response`, [
        { diff: { newResponse, oldResponse } }
      ]);
    }
    return newResponse;
  }
}
