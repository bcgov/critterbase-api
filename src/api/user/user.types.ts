import { z } from "zod";
import { nonEmpty } from "../../utils/zod_schemas";

// Zod schema to validate create user data
const CreateUserSchema = z.object({
  system_user_id: z.string(),
  system_name: z.string(),
  keycloak_uuid: z.string().uuid().nullable().optional(),
});

// Zod schema to validate update user data
const UpdateUserSchema = CreateUserSchema.partial().refine(
  nonEmpty,
  "no new data was provided or the format was invalid"
);

type UserCreateInput = z.infer<typeof CreateUserSchema>;
type UserUpdateInput = z.infer<typeof UpdateUserSchema>;

export { CreateUserSchema, UpdateUserSchema };
export type { UserCreateInput, UserUpdateInput };
