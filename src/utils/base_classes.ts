import { PrismaClient } from "@prisma/client";

/**
 * Base class for services and repositories that require a prisma connection.
 *
 * @export
 * @class CritterbaseDb
 */
export class CritterbaseDb {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
