import { prisma } from "../../utils/constants";
import type { user, Prisma } from "@prisma/client";

const createUser = async (newUserData: Prisma.userCreateInput): Promise<user> => {
  console.log(newUserData)
  const newUser = await prisma.user.create({ data:newUserData, });
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

const updateUser = async (user_id: string, data: user): Promise<user> => {
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

export { createUser, getUsers, getUser, updateUser, deleteUser };
