import { prisma } from "../../utils/constants";
import type { user } from "@prisma/client";
import { UserCreateInput, UserUpdateInput } from "./user.utils";

/**
 * * Adds a user to the database
 * * Will fail if user system_user_id already present
 * @param {UserCreateInput} newUserData - The newly created user
 */
const createUser = async (newUserData: UserCreateInput): Promise<user> => {
  const newUser = await prisma.user.create({ data: newUserData });
  return newUser;
};

/**
 * Adds or updates a user in the database
 * @param {UserCreateInput} newUserData - The user data to be upserted
 */
const upsertUser = async (newUserData: UserCreateInput): Promise<user> => {
  const newUser = await prisma.user.upsert({
    where: { system_user_id: newUserData.system_user_id },
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
 * Gets a user by their system_user_id
 * @param {string} system_user_id - The unique system_user_id for a user
 */
const getUserBySystemId = async (system_user_id: string): Promise<user> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      system_user_id: system_user_id,
    },
  });
  return user;
};

/**
 * Gets a user by their keycloak_uuid
 * @param {string} keycloak_uuid - The unique keycloak_uuid for a user
 */
const getUserByKeycloakId = async (keycloak_uuid: string): Promise<user> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      keycloak_uuid,
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

export {
  createUser,
  upsertUser,
  getUsers,
  getUser,
  getUserBySystemId,
  getUserByKeycloakId,
  updateUser,
  deleteUser,
};
