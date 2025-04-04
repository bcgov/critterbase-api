import { PrismaClient } from '@prisma/client';
import { Context, setDBContext } from '../utils/context';
import { apiError } from '../utils/types';
import { captureExtension, rawQueryExtension } from './extensions';

/**
 * Database client (PrismaClient)
 *
 */
export type DBClient = typeof extendedPrismaClient;

/**
 * Database transaction client (PrismaClient)
 *
 */
export type DBTxClient = Parameters<Parameters<typeof extendedPrismaClient.$transaction>[0]>[0];

/**
 * Prevents multiple unwated instances of PrismaClient when hot reloading (development).
 * Note: Global variables are not affected on hot-reloads.
 *
 * @link https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 */
const globalPrismaClient = global as unknown as { prisma: DBClient };

/**
 * Extended Prisma client.
 *
 * @link https://www.prisma.io/docs/orm/prisma-client/client-extensions
 *
 * @example const prismaClient = prisma.$extends(extensionA).$extends(extensionB)
 */
const extendedPrismaClient = new PrismaClient().$extends(captureExtension).$extends(rawQueryExtension);

/**
 * Get the Prisma client singleton.
 *
 * @returns {DBClient} The database client (Extended Prisma Client).
 */
export const getDBClient = (): DBClient => {
  if (!globalPrismaClient.prisma) {
    globalPrismaClient.prisma = extendedPrismaClient;
  }

  return globalPrismaClient.prisma;
};

/**
 * Execute a transaction.
 *
 * Note: All contents of the callback function will be executed in a transaction.
 * If at any point an error is thrown (internally or timeout), the transaction will be rolled back.
 *
 * @async
 * @template T - Transaction return.
 * @param {(txClient: DBTxClient) => Promise<T>} callback - The transaction callback
 * @param {Context} ctx - Request context
 * @param {number} [timeoutMs] - Request timeout cap in milliseconds (default: 5000 / 5 seconds)
 * @throws {apiError.serverIssue} - If transaction takes longer than allowed via timeoutMs
 * @returns {Promise<void>}
 */
export const transaction = async <T>(
  ctx: Context,
  client: DBClient,
  callback: (txClient: DBTxClient) => Promise<T>,
  timeoutMs = 5000
): Promise<T> => {
  return client.$transaction(async (txClient: DBTxClient) => {
    // start transaction timer
    const startTimer = performance.now();

    // set the database context used for auditing
    await setDBContext({ txClient, keycloak_uuid: ctx.keycloak_uuid, system_name: ctx.system_name }); // set database context

    // execute transaction callback
    const transactionData = await callback(txClient);

    // check if transaction took longer than 5 seconds
    const transactionTimedOut = performance.now() - startTimer >= timeoutMs;

    if (transactionTimedOut) {
      throw apiError.serverIssue(`Transaction request took longer than ${timeoutMs} ms rolling back...`);
    }

    return transactionData;
  });
};
