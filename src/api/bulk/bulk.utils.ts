import { z } from "zod";
import { CritterCreateSchema } from "../critter/critter.utils";
import { CollectionUnitCreateBodySchema } from "../collectionUnit/collectionUnit.utils";
import { MarkingCreateBodySchema } from "../marking/marking.utils";
import { LocationCreateSchema } from "../location/location.utils";
import { CaptureCreateSchema } from "../capture/capture.utils";
import { MortalityCreateSchema } from "../mortality/mortality.utils";

const BulkCreationSchema = z.object({
    critters: z.array(CritterCreateSchema).optional(),
    collections: z.array(CollectionUnitCreateBodySchema).optional(),
    markings: z.array(MarkingCreateBodySchema).optional(),
    locations: z.array(LocationCreateSchema).optional(),
    captures: z.array(CaptureCreateSchema).optional(),
    mortalities: z.array(MortalityCreateSchema).optional()
});

export { BulkCreationSchema }