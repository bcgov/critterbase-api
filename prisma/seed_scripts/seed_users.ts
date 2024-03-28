import { prisma } from "../../src/utils/constants";
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
  console.log(`Seeding (${DEVELOPERS.length}) users...`);

  await prisma.user.createMany({
    data: DEVELOPERS,
  });
};

export default seedUsers;
