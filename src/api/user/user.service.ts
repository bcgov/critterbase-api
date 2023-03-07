import { prisma } from "../../utils/constants";
import type { user } from "@prisma/client";

const getUsers = async (): Promise<user[]> => {
  const allUsers = await prisma.user.findMany();
  return [];
};

export { getUsers };
