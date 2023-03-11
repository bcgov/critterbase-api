import { prisma } from "../../utils/constants";
import type { user, Prisma } from "@prisma/client";
import { isValidObject } from "../../utils/helper_functions";

/**
 * Adds a user to the database
 * * Will fail if user system_user_id already present
 * @param {Prisma.userCreateInput} newUserData - The newly created user
 */
const createUser = async (
  newUserData: Prisma.userCreateInput
): Promise<user> => {
  const newUser = await prisma.user.create({ data: newUserData });
  return newUser;
};

/**
 * Adds or updates a user in the database
 * @param {Prisma.userCreateInput} newUserData - The user data to be upserted
 */
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
const getUser = async (user_id: string): Promise<user | null> => {
  const user = await prisma.user.findUnique({
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

/**
 * Updates a user in the database
 * @param {string} user_id - The uuid / primary key for the user
 * @param {Prisma.userUpdateInput} data - The new data that the record should be updated
 */
const updateUser = async (
  user_id: string,
  data: Prisma.userUpdateInput
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

/**
 * * Ensures that a create user input has the right fields
 * @param {user} data
 */
const isValidCreateUserInput = (data: user): boolean => {
  const requiredFields: (keyof user)[] = ["system_user_id", "system_name"];
  const allowedFields: (keyof user)[] = [
    "system_user_id",
    "system_name",
    "keycloak_uuid",
    "create_user",
    "update_user",
    "create_timestamp",
    "update_timestamp",
  ];
  return isValidObject(data, requiredFields, allowedFields);
};

export {
  createUser,
  upsertUser,
  getUsers,
  getUser,
  getUserBySystemId,
  updateUser,
  deleteUser,
  isValidCreateUserInput,
};
