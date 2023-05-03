import express, { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { CaptureCreateSchema } from "../capture/capture.utils";
import { appendEnglishTaxonAsUUID } from "../critter/critter.service";
import {  CritterCreateSchema } from "../critter/critter.utils";
import {
  MarkingCreateBodySchema,
} from "../marking/marking.utils";
import { appendDefaultCOD } from "../mortality/mortality.service";
import {
  MortalityCreateSchema,
} from "../mortality/mortality.utils";
import { bulkCreateData } from "./bulk.service";
import { BulkCreationSchema } from "./bulk.utils";
import { CollectionUnitCreateBodySchema } from "../collectionUnit/collectionUnit.utils";
import { z } from "zod";
import { appendEnglishMarkingsAsUUID } from "../marking/marking.service";

export const bulkRouter = express.Router();

bulkRouter.post(
  "/",
  catchErrors(async (req: Request, res: Response) => {

    const {
      critters,
      collections,
      markings,
      locations,
      captures,
      mortalities,
    } = await BulkCreationSchema.parseAsync(req.body);

    const crittersAppend = critters
      ? await Promise.all(
          critters.map(async (c: Record<string, unknown>) => {
            await appendEnglishTaxonAsUUID(c);
            return CritterCreateSchema.parse(c);
          })
        )
      : [];
    const taxonLookup: Record<string, string> = {};
    if (critters) {
      for (const c of critters) {
        if (c.critter_id) {
          taxonLookup[(c.critter_id as string)] = (c.taxon_id as string);
        }
      }
    }

    const markingsAppend = markings
      ? await Promise.all(
          markings.map(async (m: Record<string, unknown>) =>{
            const taxon_id = taxonLookup[(m.critter_id as string)];
            await appendEnglishMarkingsAsUUID(m, taxon_id);
            return MarkingCreateBodySchema.parseAsync(m)
          }
          )
        )
      : [];

    const parsedCaptures = captures
      ? captures.map((c: Record<string, unknown>) => CaptureCreateSchema.parse(c))
      : [];

    const parsedMortalities = mortalities
      ? await Promise.all(
          mortalities.map(async (m: Record<string, unknown>) => {
            await appendDefaultCOD(m);
            return MortalityCreateSchema.parse(m);
          })
        )
      : [];
    
    const collectionParser = z.array(CollectionUnitCreateBodySchema);
    const parsedCollections = collectionParser.parse(collections);

    const results = await bulkCreateData({
      critters: crittersAppend,
      collections: parsedCollections,
      markings: markingsAppend,
      locations: locations ?? [],
      captures: parsedCaptures,
      mortalities: parsedMortalities,
    });
    return res.status(201).json(results);
  })
);
