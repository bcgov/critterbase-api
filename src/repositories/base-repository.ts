import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/constants";

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

  constructor() {
    this.prisma = prisma;
  }
}
