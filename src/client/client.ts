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

export const transaction = async (callback: (txClient: DBTxClient) => Promise<void>, ctx: Context) => {
  const client = getDBClient();

  return client.$transaction(async (txClient: DBTxClient) => {
    const startTimer = performance.now(); // start transaction timer

    await setDBContext(txClient, ctx); // set database context
    const response = await callback(txClient);

    const endTimer = performance.now(); // end transaction timer

    const transactionsTimedOut = endTimer - startTimer >= 5000; // 5 seconds

    if (transactionsTimedOut) {
      throw apiError.serverIssue(`Transaction request took longer than ${5000} ms rolling back...`);
    }

    return response; // if no errors thrown prisma commits transactions
  });
};
