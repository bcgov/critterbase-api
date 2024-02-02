import { user } from "@prisma/client";

const seedUsers: Pick<user, "user_identifier" | "keycloak_uuid">[] = [
  {
    user_identifier: "MAC DELUCA", // This would normally be the user_id from the external system
    keycloak_uuid: "0054CF4823A744309BE399C34B6B0F43",
  },
];

export default seedUsers;
