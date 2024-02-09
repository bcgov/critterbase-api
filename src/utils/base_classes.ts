import { PrismaClient } from "@prisma/client";
import { Itis } from "../itis/itis-service";
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
 * Base class for services.
 *
 * All services have access to ITIS service.
 *
 * @export
 * @class Service
 * @template TRepo - Repository Class
 */
export class Service<TRepo extends Repository> {
  repository: TRepo;
  itis: Itis;

  constructor(repository: TRepo, itis?: Itis) {
    this.repository = repository;
    this.itis = itis ?? new Itis();
  }
}
