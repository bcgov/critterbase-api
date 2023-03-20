import { z } from "zod";

const uuidParamsSchema = z.object({
  id: z.string().uuid("query param is an invalid UUID"),
});

const nonEmpty = (obj: Record<string | number | symbol, unknown>) =>
  Object.values(obj).some(v => v !== undefined);

export { uuidParamsSchema, nonEmpty };
