import express, { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  CaptureCreateSchema,
  CaptureUpdateSchema,
} from "../capture/capture.utils";
import { appendEnglishTaxonAsUUID } from "../critter/critter.service";
import {
  CritterCreateSchema,
  CritterUpdateSchema,
} from "../critter/critter.utils";
import {
  MarkingCreateBodySchema,
  MarkingDeleteSchema,
  MarkingUpdateByIdSchema,
} from "../marking/marking.utils";
import { appendDefaultCOD } from "../mortality/mortality.service";
import {
  MortalityCreateSchema,
  MortalityUpdateSchema,
} from "../mortality/mortality.utils";
import {
  IBulkMutate,
  bulkCreateData,
  bulkErrMap,
  bulkUpdateData,
} from "./bulk.service";
import { BulkCreationSchema } from "./bulk.utils";
import {
  CollectionUnitCreateBodySchema,
  CollectionUnitUpdateBodySchema,
} from "../collectionUnit/collectionUnit.utils";
import { z } from "zod";
import { appendEnglishMarkingsAsUUID } from "../marking/marking.service";
import { LocationUpdateSchema } from "../location/location.utils";
import { zodID } from "../../utils/zod_helpers";

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
          taxonLookup[c.critter_id as string] = c.taxon_id as string;
        }
      }
    }

    const markingsAppend = markings
      ? await Promise.all(
          markings.map(async (m: Record<string, unknown>) => {
            const taxon_id = taxonLookup[m.critter_id as string];
            await appendEnglishMarkingsAsUUID(m, taxon_id);
            return MarkingCreateBodySchema.parseAsync(m);
          })
        )
      : [];

    const parsedCaptures = captures
      ? captures.map((c: Record<string, unknown>) =>
          CaptureCreateSchema.parse(c)
        )
      : [];

    const parsedMortalities = mortalities
      ? await Promise.all(
          mortalities.map(async (m: Record<string, unknown>) => {
            await appendDefaultCOD(m);
            return MortalityCreateSchema.parse(m);
          })
        )
      : [];

    const parsedCollections = collections
      ? z.array(CollectionUnitCreateBodySchema).parse(collections)
      : [];

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

bulkRouter.put(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const {
      critters,
      collections,
      markings,
      locations,
      captures,
      mortalities,
    } = BulkCreationSchema.parse(req.body);

    const markingDeletes = markings?.filter((m, i, arr) => {
      if (m._delete) {
        arr.splice(i, 1);
      }
      return m._delete;
    });

    const body: IBulkMutate = {
      critters: critters
        ? z
            .array(CritterUpdateSchema.extend({ critter_id: zodID }))
            .parse(critters, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, "critters"),
            })
        : [],
      collections: collections
        ? z.array(CollectionUnitUpdateBodySchema).parse(collections, {
            errorMap: (issue, ctx) => bulkErrMap(issue, ctx, "collections"),
          })
        : [],
      markings: markings
        ? z.array(MarkingUpdateByIdSchema).parse(markings, {
            errorMap: (issue, ctx) => bulkErrMap(issue, ctx, "markings"),
          })
        : [],
      locations: locations
        ? z
            .array(LocationUpdateSchema.extend({ location_id: zodID }))
            .parse(locations, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, "locations"),
            })
        : [],
      captures: captures
        ? z
            .array(CaptureUpdateSchema.extend({ capture_id: zodID }))
            .parse(captures, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, "captures"),
            })
        : [],
      mortalities: mortalities
        ? z
            .array(MortalityUpdateSchema.extend({ mortality_id: zodID }))
            .parse(mortalities, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, "mortalities"),
            })
        : [],
      _deleteMarkings: markingDeletes
        ? z.array(MarkingDeleteSchema).parse(markingDeletes)
        : [],
    };

    const r = await bulkUpdateData(body);
    return res.status(200).json(r);
  })
);
