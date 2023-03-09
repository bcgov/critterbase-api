import { prisma } from "../../utils/constants";
import type { user, Prisma } from "@prisma/client";

const createUser = async (
  newUserData: Prisma.userCreateInput
): Promise<user> => {
  const newUser = await prisma.user.create({ data: newUserData });
  return newUser;
};

const upsertUser = async (
  newUserData: Prisma.userCreateInput
): Promise<user> => {
  const newUser = await prisma.user.upsert({
    where: { system_user_id: newUserData.system_user_id },
    update: newUserData,
    create: newUserData,
  });
  return newUser;
};

const getUsers = async (): Promise<user[]> => {
  const allUsers = await prisma.user.findMany();
  return allUsers;
};

const getUser = async (user_id: string): Promise<user | null> => {
  const user = await prisma.user.findUnique({
    where: {
      user_id: user_id,
    },
  });
  return user;
};

const getUserBySystemId = async (
  system_user_id: string
): Promise<user | null> => {
  const user = await prisma.user.findUnique({
    where: {
      system_user_id: system_user_id,
    },
  });
  return user;
};

const updateUser = async (user_id: string, data: Prisma.userUpdateInput): Promise<user> => {
  const updatedUser = await prisma.user.update({
    where: {
      user_id: user_id,
    },
    data: data,
  });
  return updatedUser;
};

const deleteUser = async (user_id: string): Promise<user> => {
  const deletedUser = await prisma.user.delete({
    where: {
      user_id: user_id,
    },
  });
  return deletedUser;
};

export {
  createUser,
  upsertUser,
  getUsers,
  getUser,
  getUserBySystemId,
  updateUser,
  deleteUser,
};
