import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/constants";

/**
 * Base class for repositories
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
