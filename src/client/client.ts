import { PrismaClient } from '@prisma/client';
import { Context, setDBContext } from '../utils/context';
import { apiError } from '../utils/types';
import { captureExtension } from './extensions';

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
const extendedPrismaClient = new PrismaClient().$extends(captureExtension);

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
 * TODO: Uncomment once used (temp Knip bypass).
 *
 * @async
 * @template T - Transaction return.
 * @param {(txClient: DBTxClient) => Promise<T>} callback - The transaction callback
 * @param {Context} ctx - Request context
 * @throws {apiError.serverIssue} - If transaction takes longer than 5 seconds
 * @returns {Promise<void>}
 */
export const transaction = async <T>(ctx: Context, callback: (txClient: DBTxClient) => Promise<T>): Promise<T> => {
  const client = getDBClient();

  // Override the unassigned typescript warning via: ! (non-null assertion operator)
  // transactionData will be defined after the transaction callback is executed.
  let transactionData!: T;

  await client.$transaction(async (txClient: DBTxClient) => {
    const startTimer = performance.now(); // start transaction timer

    await setDBContext({ txClient, keycloak_uuid: ctx.keycloak_uuid, system_name: ctx.system_name }); // set database context
    transactionData = await callback(txClient); // execute transaction callback

    const endTimer = performance.now(); // end transaction timer

    const transactionsTimedOut = endTimer - startTimer >= 5000; // 5 seconds

    if (transactionsTimedOut) {
      throw apiError.serverIssue(`Transaction request took longer than ${5000} ms rolling back...`);
    }
  });

  return transactionData;
};
