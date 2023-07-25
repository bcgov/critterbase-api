import { prisma } from "../../utils/constants";
import type { user } from "@prisma/client";
import { UserCreateInput, UserUpdateInput } from "./user.utils";
import { apiError } from "../../utils/types";

/**
 * * Adds a user to the database
 * * Will fail if user system_user_id already present
 * @param {UserCreateInput} newUserData - The newly created user
 */
const createUser = async (newUserData: UserCreateInput): Promise<user> => {
  const existingUser = await prisma.user.findFirst({
    where: {
      keycloak_uuid: newUserData.keycloak_uuid
    }
  });
  if(existingUser) {
    return existingUser;
  }
  const newUser = await prisma.user.create({ data: newUserData });
  return newUser;
};

/**
 * Adds or updates a user in the database
 * @param {UserCreateInput} newUserData - The user data to be upserted
 */
const upsertUser = async (newUserData: UserCreateInput): Promise<user> => {
  if(!newUserData.keycloak_uuid) {
    throw apiError.requiredProperty('keycloak_uuid');
  }
  const newUser = await prisma.user.upsert({
    where: {
      keycloak_uuid: newUserData.keycloak_uuid
    },
    update: newUserData,
    create: newUserData,
  });
  return newUser;
};

/**
 * Gets all users from the database
 */
const getUsers = async (): Promise<user[]> => {
  const allUsers = await prisma.user.findMany();
  return allUsers;
};

/**
 * Gets a user by their user_id
 * @param {string} user_id - The uuid / primary key for the user
 */
const getUser = async (user_id: string): Promise<user> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      user_id: user_id,
    },
  });
  return user;
};

/**
 * Updates a user in the database
 * @param {string} user_id - The uuid / primary key for the user
 * @param {UserUpdateInput} data - The new data that the record should be updated
 */
const updateUser = async (
  user_id: string,
  data: UserUpdateInput
): Promise<user> => {
  const updatedUser = await prisma.user.update({
    where: {
      user_id: user_id,
    },
    data: data,
  });
  return updatedUser;
};

/**
 * Deletes a user from the database
 * @param {string} user_id - The uuid / primary key for the user
 */
const deleteUser = async (user_id: string): Promise<user> => {
  const deletedUser = await prisma.user.delete({
    where: {
      user_id: user_id,
    },
  });
  return deletedUser;
};

const setUserContext = async (system_user_id: string, system_name: string) => {
  const result: [{ api_set_context: string }] =
    await prisma.$queryRaw`SELECT * FROM api_set_context(${system_user_id}, ${system_name})`;
  return result[0].api_set_context;
};

export {
  createUser,
  upsertUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setUserContext,
};
