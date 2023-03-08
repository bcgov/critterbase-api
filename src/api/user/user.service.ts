import { prisma } from "../../utils/constants";
import type { user } from "@prisma/client";

/**
 ** For testing purposes while database is empty
 */
const generateMockUserData = (): user[] => {
  const mockUsers: user[] = [
    {
      user_id: "1",
      system_user_id: "123",
      system_name: "ABC",
      keycloak_uuid: "xyz123",
      create_user: "John",
      update_user: "Mary",
      create_timestamp: new Date(),
      update_timestamp: new Date(),
    },
    {
      user_id: "2",
      system_user_id: "456",
      system_name: "DEF",
      keycloak_uuid: null,
      create_user: "Bob",
      update_user: "Alice",
      create_timestamp: new Date(),
      update_timestamp: new Date(),
    },
    {
      user_id: "3",
      system_user_id: "789",
      system_name: "GHI",
      keycloak_uuid: "uvw456",
      create_user: "David",
      update_user: "Susan",
      create_timestamp: new Date(),
      update_timestamp: new Date(),
    },
  ];

  return mockUsers;
};

const createUser = async (data:user): Promise<user> => {
    const newUser = await prisma.user.create({ data });
    return newUser;
};

const getUsers = async (): Promise<user[]> => {
  const allUsers = generateMockUserData(); //prisma.user.findMany();
  return allUsers; // return mock data for now
};

const getUser = async (user_id: string): Promise<user> => {
    // const user = await prisma.user.findUnique({
    //   where: {
    //     user_id: user_id
    //   }
    // });
  console.log(user_id)
  return generateMockUserData()[parseInt(user_id)-1]; // return mock data for now
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
    const deletedUser = await prisma.user.delete({ //TODO: implement soft-deletion?
      where: {
        user_id: user_id,
      },
    });
    return deletedUser;
  };

export { createUser, getUsers, getUser, updateUser, deleteUser };
