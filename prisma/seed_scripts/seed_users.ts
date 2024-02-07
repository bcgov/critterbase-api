import { user } from "@prisma/client";
import { prisma } from "../../src/utils/constants";
import { queryRandomUUID } from "../prisma_utils";

const developers: Pick<user, "user_identifier" | "keycloak_uuid">[] = [
  {
    user_identifier: "MAC DELUCA",
    keycloak_uuid: "0054CF4823A744309BE399C34B6B0F43",
  },
];

/**
 * Seed SYSTEM account and developer accounts.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
const seedUsers = async () => {
  console.log("Seeding users...");
  const systemUserUUID = await queryRandomUUID(prisma);
  /**
   * Create system user.
   * Required for auto filling audit columns.
   */
  await prisma.$executeRaw`ALTER TABLE critterbase."user" DISABLE TRIGGER all`;
  await prisma.user.create({
    data: {
      user_identifier: "SYSTEM",
      user_id: systemUserUUID,
      create_user: systemUserUUID,
      update_user: systemUserUUID,
    },
  });
  await prisma.$executeRaw`ALTER TABLE critterbase."user" ENABLE TRIGGER all`;
  await prisma.user.createMany({
    data: developers,
  });
};

export default seedUsers;
