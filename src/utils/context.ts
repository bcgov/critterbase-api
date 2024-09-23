import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { z } from 'zod';
import { DBTxClient } from '../client/client';

/**
 * Request context.
 *
 */
export type Context = {
  /**
   * User ID (UUID).
   *
   * @type {string}
   */
  user_id: string;
  /**
   * Keycloak UUID.
   *
   * @type {string}
   */
  keycloak_uuid: string;
  /**
   * User Identifier (Username).
   *
   * @type {string}
   */
  user_identifier: string;
  /**
   * System Name.
   *
   * @type {string}
   */
  system_name: string;
};

/**
 * Get the request context.
 *
 * @param {Request} req - Request
 * @returns {Context} Request context
 */
export const getContext = (req: Request): Context => {
  const ctx = z
    .object({
      user_id: z.string(),
      keycloak_uuid: z.string().max(36),
      user_identifier: z.string(),
      system_name: z.string()
    })
    .parse(req?.context);

  return ctx;
};

/**
 * Set the database context (used for row-level auditing).
 *
 * @async
 * @param {DBTxClient} txClient - Transaction client
 * @param {Context} ctx - Request context
 * @returns {Promise<void>}
 */
export const setDBContext = async (txClient: DBTxClient, ctx: Context) => {
  await txClient.$queryRaw(Prisma.sql`SELECT * FROM api_set_context(${ctx.keycloak_uuid}, ${ctx.system_name});`);
};
