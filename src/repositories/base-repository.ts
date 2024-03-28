import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { IS_DEV, prisma } from '../utils/constants';
import { apiError } from '../utils/types';

/**
 * Base class for Critterbase Repositories.
 * TODO: pull prisma config from constants and initialize in constructor.
 *       once all services / repositories are built for all routers.
 *
 * @export
 * @class Repository
 */
export class Repository {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  /**
   * Prisma transaction handler.
   * Accepts callback function to wrap db requests in a transaction,
   * can abort the transaction by throwing errors within the callback.
   *
   * example:
   *  const userPayload = {...}
   *  await transaction(async () => {
   *    const user = await createUser(userPayload)
   *    if (!user) {
   *      throw new Error(`missing user`) // First request rolled back
   *    }
   *    return updateUser(...user) // Both requests committed
   *  });
   *
   * @async
   * @template T - Transaction return.
   * @param {() => Promise<T>} transactions - DB requests / services.
   * @returns {Promise<T>} Transaction return.
   */
  async transaction<T>(transactions: () => Promise<T>): Promise<T> {
    // save previous prisma client
    const prismaClient = this.prisma;
    // wrap requests with prisma $transaction
    const data = await this.prisma.$transaction(async (transactionClient) => {
      // set prisma client to be the transaction client
      this.prisma = transactionClient as PrismaClient;
      // run transaction requests
      return transactions();
    });
    // set prisma back to the original client
    this.prisma = prismaClient;
    // return response from transactions
    return data;
  }

  /**
   * Safely queries with prisma raw sql and validates against zod schema.
   *
   * @async
   * @template TSchema - Zod Schema generic.
   * @param {TSql} sql - Raw SQL. Prisma.sql template string.
   * @param {TSchema} schema - Zod Schema
   * @throws {apiError.sqlExecuteIssue} - if query response fails validation.
   * @returns {Promise<z.TypeOf<TSchema>>} inferred type from zod schema.
   */
  async safeQuery<TSchema extends z.ZodTypeAny>(sql: Prisma.Sql, schema: TSchema) {
    const result = await this.prisma.$queryRaw<z.infer<TSchema>>(sql);

    if (!IS_DEV) {
      return result; // eslint-disable-line
    }

    const parsed = schema.safeParse(result);

    if (!parsed.success) {
      console.log(parsed.error.errors, { result });

      throw apiError.sqlExecuteIssue('Failed to parse raw sql with provided Zod schema.', parsed.error.errors);
    }

    return result; // eslint-disable-line
  }
}
