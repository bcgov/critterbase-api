import { z } from "zod";
import { ResponseSchema } from "../../utils/zod_helpers";

const BulkCreationSchema = z.object({
    critters: z.array(ResponseSchema).optional(),
    collections: z.array(ResponseSchema).optional(),
    markings: z.array(ResponseSchema).optional(),
    locations: z.array(ResponseSchema).optional(),
    captures: z.array(ResponseSchema).optional(),
    mortalities: z.array(ResponseSchema).optional(),
    quantitative_measurements: z.array(ResponseSchema).optional(),
    qualitative_measurements: z.array(ResponseSchema).optional()
});

export { BulkCreationSchema }