import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { IS_DEV, prisma } from "../utils/constants";
import { apiError } from "../utils/types";

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

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  /**
   * Safely queries with prisma raw sql and validates against zod schema.
   *
   * @async
   * @template TSchema - Zod Schema generic.
   * @param {TSql} sql - Raw SQL. Prisma.sql template string.
   * @param {TSchema} schema - Zod Schema
   * @throws {apiError.sqlExecuteIssue} - if query response fails validation.
   * @returns {Promise<z.TypeOf<TSchema>>} inferred type from zod schema.
   */
  async safeQuery<TSchema extends z.ZodTypeAny>(
    sql: Prisma.Sql,
    schema: TSchema
  ) {
    const result = await this.prisma.$queryRaw<z.infer<TSchema>>(sql);

    if (!IS_DEV) {
      return result; // eslint-disable-line
    }

    const parsed = schema.safeParse(result);

    if (!parsed.success) {
      console.log(parsed.error.errors, { result });

      throw apiError.sqlExecuteIssue(
        "Failed to parse raw sql with provided Zod schema."
      );
    }

    return result; // eslint-disable-line
  }
}
