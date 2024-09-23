import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { z } from 'zod';
import { DBTxClient } from '../client/client';

/**
 * Request context.
 *
 * @description Injected into all requests that are protected by the auth middleware.
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
 * Database context configuration.
 *
 */
type DBContextConfig = {
  /**
   * Transaction client.
   *
   * @type {DBTxClient}
   */
  txClient: DBTxClient;
  /**
   * Keycloak UUID or unique identifier.
   *
   * @type {string}
   */
  keycloak_uuid: string;
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
 * Note: Context will be defined for all routes that are protected by the auth middleware.
 *
 * @param {Request} req - Request
 * @returns {Context} Request context
 */
export const getContext = (req: Request): Context => {
  return z
    .object({
      user_id: z.string(),
      keycloak_uuid: z.string().max(36),
      user_identifier: z.string(),
      system_name: z.string()
    })
    .parse(req.context);
};

/**
 * Set the database context (used for row-level auditing).
 *
 * @async
 * @param {DBContextConfig} config - Database context configuration
 * @returns {Promise<void>}
 */
export const setDBContext = async (config: DBContextConfig) => {
  await config.txClient.$queryRaw(
    Prisma.sql`SELECT * FROM api_set_context(${config.keycloak_uuid}, ${config.system_name});`
  );
};
