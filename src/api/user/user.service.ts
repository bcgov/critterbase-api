import { prisma, strings } from "../../utils/constants";
import type { user, Prisma } from "@prisma/client";
import { z } from "zod";
import { nonEmpty } from "../../utils/zod_schemas";

/**
 * * Adds a user to the database
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

// Zod schema to validate create user data
const CreateUserSchema = z.object({
  system_user_id: z.string(),
  system_name: z.string(),
  keycloak_uuid: z.string().uuid().nullable().optional(),
});

// Zod schema to validate update user data
const UpdateUserSchema = CreateUserSchema.partial()
  .merge(
    z.object({
      system_user_id: z.string().refine(async (system_user_id) => {
        // check for uniqueness
        return !(await getUserBySystemId(system_user_id));
      }, "system_user_id already exists").optional(),
    })
  )
  .refine(nonEmpty, "no new data was provided or the format was invalid");

export {
  createUser,
  upsertUser,
  getUsers,
  getUser,
  getUserBySystemId,
  updateUser,
  deleteUser,
  CreateUserSchema,
  UpdateUserSchema,
};
