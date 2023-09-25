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
    qualitative_measurements: z.array(ResponseSchema).optional(),
    families: z.object({
        families: z.array(ResponseSchema).optional(),
        parents: z.array(ResponseSchema).optional(),
        children: z.array(ResponseSchema).optional()
    }).optional()
});

const filterAndRemoveDeletes = <T,>(arr: T & {_delete?: boolean}[] | undefined) => {
    return arr?.filter((val, idx, arr) => {
        if (val._delete) {
            arr.splice(idx, 1);
        }
        return val._delete;
    })
}

export { BulkCreationSchema, filterAndRemoveDeletes }