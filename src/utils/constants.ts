import { app } from "../server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import supertest from "supertest";
import { apiError } from "./types";

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
const prisma =
  globalPrisma.prisma ||
  new PrismaClient({
    errorFormat: "minimal",
  });

if (IS_PROD) globalPrisma.prisma = prisma;

const strings = {
  app: {
    invalidUUID: (id: string) => `id: '${id}' is not a valid UUID`,
    idRequired: `id is required`,
  },
  prisma: {
    P2025: () => "record to update not found",
  },
  location: {
    notFoundMulti: "no locations found",
    notFound: "location not found",
    //noID: "id was not provided in params",
    deleted: (id: string): string => `Deleted location ${id}`,
    // updated: (id: string): string => `Updated location ${id}`,
  },
  user: {
    notFound: "user not found",
    noData: "no new data was provided or the format was invalid",
    systemUserIdExists: "system_user_id already exists",
  },
  marking: {
    notFound: "marking not found",
  },
  artifact: {
    notFound: "artifact not found",
  },
};

export { PORT, IS_DEV, IS_PROD, IS_TEST, prisma, request, strings };
