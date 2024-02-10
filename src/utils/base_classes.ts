import { PrismaClient } from "@prisma/client";
import { prisma } from "./constants";

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

/**
 * Base class for Critterbase internal services.
 *
 * @export
 * @class Service
 * @template TRepo - Repository Class
 */
export class Service<T extends Repository> {
  repository: T;

  constructor(repository: T) {
    this.repository = repository;
  }
}
