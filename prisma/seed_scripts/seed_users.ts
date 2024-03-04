import { prisma } from "../../src/utils/constants";
import { queryRandomUUID } from "../prisma_utils";
import { DEVELOPERS } from "./seed_constants";

/**
 * Seed SYSTEM account and developer accounts.
 * See ./seed_constants.ts to add additional developer accounts to seed.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
const seedUsers = async () => {
  const systemUserUUID = await queryRandomUUID(prisma);
  /**
   * Create system user. Required for auto filling audit columns.
   * Temporarily disabling triggers to populate system account.
   */
  await prisma.$executeRaw`ALTER TABLE critterbase."user" DISABLE TRIGGER all`;

  console.log(`Seeding (1) system account...`);

  await prisma.user.create({
    data: {
      user_identifier: "SYSTEM",
      user_id: systemUserUUID,
      create_user: systemUserUUID,
      update_user: systemUserUUID,
    },
  });
  await prisma.$executeRaw`ALTER TABLE critterbase."user" ENABLE TRIGGER all`;

  console.log(`Seeding (${DEVELOPERS.length}) users...`);

  await prisma.user.createMany({
    data: DEVELOPERS,
  });
};

export default seedUsers;
