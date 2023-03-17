import { z } from "zod";

const uuidParamsSchema = z.object({
  id: z.string().uuid("query param is an invalid UUID"),
});

export { uuidParamsSchema };
