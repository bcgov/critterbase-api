import express, { Request, Response } from 'express';
import { z } from 'zod';
import { transaction } from '../../client/client';
import { CaptureDeleteSchema, CaptureUpdateSchema } from '../../schemas/capture-schema';
import { CritterUpdateSchema } from '../../schemas/critter-schema';
import { LocationUpdateSchema } from '../../schemas/location-schema';
import { MortalityDeleteSchema, MortalityUpdateSchema } from '../../schemas/mortality-schema';
import { BulkService } from '../../services/bulk-service';
import { getContext } from '../../utils/context';
import { ICbDatabase } from '../../utils/database';
import { catchErrors } from '../../utils/middleware';
import { zodID } from '../../utils/zod_helpers';
import { CollectionUnitDeleteSchema, CollectionUnitUpsertSchema } from '../collectionUnit/collectionUnit.utils';
import { FamilyChildDeleteSchema, FamilyParentDeleteSchema } from '../family/family.utils';
import { MarkingDeleteSchema, MarkingUpdateByIdSchema } from '../marking/marking.utils';
import {
  QualitativeDeleteSchema,
  QualitativeUpdateSchema,
  QuantitativeDeleteSchema,
  QuantitativeUpdateSchema
} from '../measurement/measurement.utils';
import { IBulkDelete, IBulkMutate, bulkErrMap } from './bulk.service';
import { BulkCreationSchema, BulkShapeSchema, getBulkDeletes, getBulkUpdates } from './bulk.utils';

export const BulkRouter = (db: ICbDatabase) => {
  const bulkRouter = express.Router();

  bulkRouter.post(
    '/',
    catchErrors(async (req: Request, res: Response) => {
      const ctx = getContext(req);

      // Cast request body to make patching easier
      const preParsed = BulkShapeSchema.parse(req.body);

      // Patch critters to contain itis_tsn and scientific_name
      const patchCritterPromises =
        preParsed?.critters?.map((critter) => {
          return db.itisService.patchTsnAndScientificName(critter);
        }) ?? [];

      // Patch markings to swap marking values for UUIDs
      const patchMarkingPromises =
        preParsed?.markings?.map((marking) => {
          return db.appendEnglishMarkingsAsUUID(marking);
        }) ?? [];

      const patchedCritters = await Promise.all(patchCritterPromises);
      const patchedMarkings = await Promise.all(patchMarkingPromises);
      let patchedMortalities: Record<string, unknown>[] = [];

      // Patch mortalities to include default cause of death id ('Unknown') if missing
      if (preParsed?.mortalities?.length) {
        const unknownCodId = await db.mortalityService.getDefaultCauseOfDeathId();

        patchedMortalities = preParsed?.mortalities?.map((mortality) => {
          if (!mortality?.cod_id) {
            mortality.cod_id = unknownCodId;
          }
          return mortality;
        });
      }

      const parsed = BulkCreationSchema.parse({
        ...req.body,
        critters: patchedCritters,
        markings: patchedMarkings,
        mortalities: patchedMortalities
      });

      const response = await transaction(ctx, async (txClient) => {
        const bulkService = BulkService.init(txClient);

        return bulkService.repository.createEntities({
          critters: parsed.critters ?? [],
          collections: parsed.collections ?? [],
          markings: parsed.markings ?? [],
          locations: parsed.locations ?? [],
          captures: parsed.captures ?? [],
          mortalities: parsed.mortalities ?? [],
          qualitative_measurements: parsed.qualitative_measurements ?? [],
          quantitative_measurements: parsed.quantitative_measurements ?? [],
          families: parsed.families?.families ?? [],
          family_children: parsed.families?.children ?? [],
          family_parents: parsed.families?.parents ?? []
        });
      });

      return res.status(201).json(response);
    })
  );

  bulkRouter.patch(
    '/',
    catchErrors(async (req: Request, res: Response) => {
      const preParsed = BulkShapeSchema.parse(req.body);

      const critterUpdates = getBulkUpdates(preParsed.critters);
      const markingUpdates = getBulkUpdates(preParsed.markings);
      const collectionUpdates = getBulkUpdates(preParsed.collections);
      const qualUpdates = getBulkUpdates(preParsed.qualitative_measurements);
      const quantUpdates = getBulkUpdates(preParsed.quantitative_measurements);
      const captureUpdates = getBulkUpdates(preParsed.captures);
      const mortalityUpdates = getBulkUpdates(preParsed.mortalities);

      const markingDeletes = getBulkDeletes(preParsed.markings);
      const collectionDeletes = getBulkDeletes(preParsed.collections);
      const qualDeletes = getBulkDeletes(preParsed.qualitative_measurements);
      const quantDeletes = getBulkDeletes(preParsed.quantitative_measurements);
      const captureDeletes = getBulkDeletes(preParsed.captures);
      const mortalityDeletes = getBulkDeletes(preParsed.mortalities);
      const parentDeletes = getBulkDeletes(preParsed.families?.parents);
      const childDeletes = getBulkDeletes(preParsed.families?.children);

      const updateBody: IBulkMutate = {
        critters: critterUpdates
          ? z.array(CritterUpdateSchema.extend({ critter_id: zodID })).parse(critterUpdates, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'critters')
            })
          : [],
        collections: collectionUpdates
          ? z.array(CollectionUnitUpsertSchema).parse(collectionUpdates, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'collections')
            })
          : [],
        markings: markingUpdates
          ? z.array(MarkingUpdateByIdSchema).parse(markingUpdates, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'markings')
            })
          : [],
        locations: preParsed.locations
          ? z.array(LocationUpdateSchema.extend({ location_id: zodID })).parse(preParsed.locations, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'locations')
            })
          : [],
        captures: captureUpdates
          ? z.array(CaptureUpdateSchema.extend({ capture_id: zodID })).parse(captureUpdates, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'captures')
            })
          : [],
        mortalities: mortalityUpdates
          ? z.array(MortalityUpdateSchema.extend({ mortality_id: zodID })).parse(mortalityUpdates, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'mortalities')
            })
          : [],
        qualitative_measurements: qualUpdates
          ? z
              .array(
                QualitativeUpdateSchema.required({
                  measurement_qualitative_id: true
                })
              )
              .parse(qualUpdates, {
                errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'qualitative_measurements')
              })
          : [],
        quantitative_measurements: quantUpdates
          ? z
              .array(
                QuantitativeUpdateSchema.required({
                  measurement_quantitative_id: true
                })
              )
              .parse(quantUpdates, {
                errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'quantitative_measurements')
              })
          : []
      };

      const deleteBody: IBulkDelete = {
        _deleteMarkings: markingDeletes ? z.array(MarkingDeleteSchema).parse(markingDeletes) : [],
        _deleteUnits: collectionDeletes ? z.array(CollectionUnitDeleteSchema).parse(collectionDeletes) : [],
        _deleteCaptures: captureDeletes ? z.array(CaptureDeleteSchema).parse(captureDeletes) : [],
        _deleteMoralities: mortalityDeletes ? z.array(MortalityDeleteSchema).parse(mortalityDeletes) : [],
        _deleteQual: qualDeletes ? z.array(QualitativeDeleteSchema).parse(qualDeletes) : [],
        _deleteQuant: quantDeletes ? z.array(QuantitativeDeleteSchema).parse(quantDeletes) : [],
        _deleteChildren: childDeletes ? z.array(FamilyChildDeleteSchema).parse(childDeletes) : [],
        _deleteParents: parentDeletes ? z.array(FamilyParentDeleteSchema).parse(parentDeletes) : []
      };

      const updateRes = await db.bulkUpdateData(updateBody, db);
      const deleteRes = await db.bulkDeleteData(deleteBody, db);
      return res.status(200).json({ ...updateRes, ...deleteRes });
    })
  );

  return bulkRouter;
};
