import { system, user } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { apiError } from "../../utils/types";
import { setUserContext } from "../user/user.service";
import { LoginCredentials } from "../user/user.utils";

const loginUser = async (login: LoginCredentials): Promise<user> => {
  let foundUser: user | null = null;
  const { user_id, keycloak_uuid, system_name, system_user_id } = login;
  if ((!system_name && system_user_id) || (system_name && !system_user_id)) {
    throw apiError.syntaxIssue(
      `Must provide a system_name (${Object.keys(system).join(
        ", "
      )}) AND external system_user_id`
    );
  }
  if (user_id) {
    foundUser = await prisma.user.findUnique({ where: { user_id } });
  }
  if (!foundUser && keycloak_uuid) {
    foundUser = await prisma.user.findFirst({ where: { keycloak_uuid } });
  }
  if (!foundUser && system_name && system_user_id) {
    foundUser = await prisma.user.findFirst({
      where: {
        AND: [{ system_name }, { system_user_id }],
      },
    });
  }
  if (!foundUser) {
    throw apiError.notFound("No user found. Login failed");
  }
  await setUserContext(foundUser.system_user_id, foundUser.system_name);
  return foundUser;
};

export { loginUser };
