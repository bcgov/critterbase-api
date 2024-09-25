import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { z } from 'zod';
import { DBTxClient } from '../client/client';

const ContextSchema = z
  .object({
    /**
     * Critterbase User ID.
     *
     */
    user_id: z.string().uuid(),
    /**
     * Keycloak UUID or unique identifier.
     *
     */
    keycloak_uuid: z.string(),
    /**
     * User identifier AKA Username.
     *
     */
    user_identifier: z.string(),
    /**
     * External system name or service account name.
     *
     */
    system_name: z.string()
  })
  .strict();

/**
 * Request context.
 *
 * @description Injected into all requests that are protected by the auth middleware.
 */
export type Context = z.infer<typeof ContextSchema>;

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
 * Get the request context - injected into the transaction handler for auditing.
 *
 * Note: Context will be defined for all routes that are protected by the auth middleware.
 *
 * @see utils/client.ts - transaction()
 *
 * @param {Request} req - Request
 * @returns {Context} Request context
 */
export const getContext = (req: Request): Context => {
  return ContextSchema.parse(req.context);
};

/**
 * Set the database context (used for row-level auditing).
 * This allows the database to automatically inject the correct values for audit columns for the request.
 *
 * Note: This function needs to be called inside a transaction if called manually.
 *
 * @see utils/client.ts - transaction()
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
