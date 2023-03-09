import { app } from "../server";
import { PrismaClient } from "@prisma/client";
import supertest from "supertest";

const PORT = process.env.PORT;

const IS_DEV = process.env.NODE_ENV === "development";

const IS_PROD = process.env.NODE_ENV === "production";

const IS_TEST = process.env.NODE_ENV === "test";

const request = supertest(app);

/**
 * https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 * Prevents multiple unwated instances of PrismaClient when hot reloading
 */
const globalPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalPrisma.prisma || new PrismaClient();
if (IS_PROD) globalPrisma.prisma = prisma;

export { PORT, IS_DEV, IS_PROD, IS_TEST, prisma, request };
