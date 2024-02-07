import { PrismaClient } from "@prisma/client";
import { prisma } from "../src/utils/constants";

interface GenRandomUUID {
  gen_random_uuid: string;
}

/**
 * Retrieves a crypto generated uuid from the database.
 *
 * @async
 * @param {PrismaClient} prisma - The prisma client.
 * @returns {Promise<string>} The generated uuid.
 */
async function queryRandomUUID(prisma: PrismaClient): Promise<string> {
  const cryptoResult: GenRandomUUID[] =
    await prisma.$queryRaw`SELECT crypto.gen_random_uuid()`;
  return cryptoResult[0].gen_random_uuid;
}

export { queryRandomUUID };

