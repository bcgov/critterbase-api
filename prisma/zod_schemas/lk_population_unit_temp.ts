import * as z from "zod"

export const lk_population_unit_tempSchema = z.object({
  population_unit_id: z.string().uuid(),
  unit_name: z.string().nullish(),
})
