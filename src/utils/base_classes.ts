import { PrismaClient } from "@prisma/client";
import { prisma } from "./constants";

/**
 * Base class for services and repositories that require a prisma connection.
 *
 * @export
 * @class CritterbaseDb
 */
export class CritterbasePrisma {
  prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }
}
