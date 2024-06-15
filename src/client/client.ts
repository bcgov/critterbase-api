import { PrismaClient } from '@prisma/client';
import { captureExtension } from './extensions';

export type PrismaClientExtended = typeof extendedPrismaClient;

/**
 * Extended Prisma client.
 *
 * @link https://www.prisma.io/docs/orm/prisma-client/client-extensions
 *
 * @example const prismaClient = prisma.$extends(extensionA).$extends(extensionB)
 */
const extendedPrismaClient = new PrismaClient().$extends(captureExtension);

/**
 * Prevents multiple unwated instances of PrismaClient when hot reloading (development).
 * Global variables are not affected on hot-reloads.
 *
 * @link https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 */
const globalPrisma = global as unknown as { prisma: PrismaClientExtended };

const prismaClient = globalPrisma.prisma || extendedPrismaClient;

if (process.env.NODE_ENV !== 'production') globalPrisma.prisma = prismaClient;

export { prismaClient };
