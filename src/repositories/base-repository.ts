import { Prisma } from '@prisma/client';
import { isDeepStrictEqual } from 'util';
import { z } from 'zod';
import { PrismaClientExtended } from '../client/client';
import { IS_DEV } from '../utils/constants';
import { apiError } from '../utils/types';

/**
 * Base class for Critterbase Repositories.
 *
 * TODO: pull prisma config from constants and initialize in constructor.
 * once all services / repositories are built for all routers.
 *
 * @export
 * @class Repository
 */
export class Repository {
  prisma: PrismaClientExtended;
  transactionTimeoutMilliseconds: number;

  constructor(prismaClient: PrismaClientExtended, transactionTimeout = 5000) {
    this.prisma = prismaClient;
    this.transactionTimeoutMilliseconds = transactionTimeout;
  }

  /**
   * Prisma transaction handler.
   * Accepts callback function to wrap db requests in a transaction,
   * can abort the transaction by throwing errors within the callback.
   *
   * link: https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions-1
   *
   * example:
   *  const userPayload = {...}
   *  await transaction(async () => {
   *    const user = await createUser(userPayload)
   *    if (!user) {
   *      throw new Error(`missing user`) // Requests rolled back
   *    }
   *    return updateUser(...user) // Both requests committed
   *  });
   *
   * @async
   * @template T - Transaction return.
   * @param {() => Promise<T>} transactions - DB requests / services.
   * @returns {Promise<T>} Transaction return.
   */
  async transactionHandler<T>(transactions: () => Promise<T>): Promise<T> {
    const originalClient = this.prisma; // save original prisma client

    try {
      const startTimer = performance.now(); // start transaction timer

      return await this.prisma.$transaction(async (transactionClient) => {
        this.prisma = transactionClient as PrismaClientExtended; // set prisma client to transaction client

        const transactionData = await transactions(); // run transactions with prisma transaction client

        const endTimer = performance.now();

        const transactionsTimedOut = endTimer - startTimer >= this.transactionTimeoutMilliseconds;

        if (transactionsTimedOut) {
          throw apiError.serverIssue(
            `Transaction request took longer than ${this.transactionTimeoutMilliseconds} ms rolling back...`
          );
        }

        return transactionData; // if no errors thrown prisma commits transactions
      });

      // no catch clause to intentionally bubble error up
    } finally {
      this.prisma = originalClient; // restore original client
    }
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
