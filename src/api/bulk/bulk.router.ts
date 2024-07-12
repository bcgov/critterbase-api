import express, { Request, Response } from 'express';
import { z } from 'zod';
import { CaptureCreateSchema, CaptureDeleteSchema, CaptureUpdateSchema } from '../../schemas/capture-schema';
import { BulkCritterCreateSchema, CritterCreateSchema, CritterUpdateSchema } from '../../schemas/critter-schema';
import { LocationUpdateSchema } from '../../schemas/location-schema';
import { MortalityCreateSchema, MortalityDeleteSchema, MortalityUpdateSchema } from '../../schemas/mortality-schema';
import { ICbDatabase } from '../../utils/database';
import { catchErrors } from '../../utils/middleware';
import { zodID } from '../../utils/zod_helpers';
import {
  CollectionUnitCreateBodySchema,
  CollectionUnitDeleteSchema,
  CollectionUnitUpsertSchema
} from '../collectionUnit/collectionUnit.utils';
import {
  FamilyChildCreateBodySchema,
  FamilyChildDeleteSchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema,
  FamilyParentDeleteSchema
} from '../family/family.utils';
import { MarkingCreateBodySchema, MarkingDeleteSchema, MarkingUpdateByIdSchema } from '../marking/marking.utils';
import {
  QualitativeCreateSchema,
  QualitativeDeleteSchema,
  QualitativeUpdateSchema,
  QuantitativeCreateSchema,
  QuantitativeDeleteSchema,
  QuantitativeUpdateSchema
} from '../measurement/measurement.utils';
import { IBulkDelete, IBulkMutate, bulkErrMap } from './bulk.service';
import { BulkCreationSchema, getBulkDeletes, getBulkUpdates } from './bulk.utils';

export const BulkRouter = (db: ICbDatabase) => {
  const bulkRouter = express.Router();

  bulkRouter.post(
    '/',
    catchErrors(async (req: Request, res: Response) => {
      const {
        critters,
        collections,
        markings,
        locations,
        captures,
        mortalities,
        qualitative_measurements,
        quantitative_measurements,
        families
      } = await BulkCreationSchema.parseAsync(req.body);

      const crittersAppend = critters
        ? await Promise.all(
            critters.map(async (critter: Record<string, unknown>) => {
              CritterCreateSchema.parse(critter);
              const patchedCritter = await db.itisService.patchTsnAndScientificName(critter);
              return BulkCritterCreateSchema.parse(patchedCritter);
            })
          )
        : [];

      const critterTsnLookup: Record<string, number> = {};

      if (crittersAppend.length) {
        for (const critter of crittersAppend) {
          if (critter.critter_id) {
            critterTsnLookup[critter.critter_id] = critter.itis_tsn;
          }
        }
      }

      const markingsAppend = markings
        ? await Promise.all(
            markings.map(async (marking: Record<string, unknown>) => {
              await db.appendEnglishMarkingsAsUUID(marking);
              return MarkingCreateBodySchema.parseAsync(marking);
            })
          )
        : [];

      const parsedCaptures = captures ? captures.map((c: Record<string, unknown>) => CaptureCreateSchema.parse(c)) : [];

      const parsedMortalities = mortalities
        ? await Promise.all(
            mortalities.map(async (m: Record<string, unknown>) => {
              await db.mortalityService.appendDefaultCOD(m);
              return MortalityCreateSchema.parse(m);
            })
          )
        : [];

      const parsedCollections = collections ? z.array(CollectionUnitCreateBodySchema).parse(collections) : [];

      const parsedQualitativeMeasurements = qualitative_measurements
        ? z.array(QualitativeCreateSchema).parse(qualitative_measurements)
        : [];

      const parsedQuantitativeMeasurements = quantitative_measurements
        ? z.array(QuantitativeCreateSchema).parse(quantitative_measurements)
        : [];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const familyUnits = families?.families ? z.array(FamilyCreateBodySchema).parse(families.families) : [];

      const familyParents = families?.parents ? z.array(FamilyParentCreateBodySchema).parse(families.parents) : [];

      const familyChildren = families?.children ? z.array(FamilyChildCreateBodySchema).parse(families.children) : [];

      const results = await db.bulkService.repository.createEntities({
        critters: crittersAppend,
        collections: parsedCollections,
        markings: markingsAppend,
        locations: locations ?? [],
        captures: parsedCaptures,
        mortalities: parsedMortalities,
        qualitative_measurements: parsedQualitativeMeasurements,
        quantitative_measurements: parsedQuantitativeMeasurements,
        families: familyUnits,
        family_children: familyChildren,
        family_parents: familyParents
      });
      return res.status(201).json(results);
    })
  );

  bulkRouter.patch(
    '/',
    catchErrors(async (req: Request, res: Response) => {
      const {
        critters,
        collections,
        markings,
        locations,
        captures,
        mortalities,
        qualitative_measurements,
        quantitative_measurements,
        families
      } = BulkCreationSchema.parse(req.body);

      const critterUpdates = getBulkUpdates(critters);
      const markingUpdates = getBulkUpdates(markings);
      const collectionUpdates = getBulkUpdates(collections);
      const qualUpdates = getBulkUpdates(qualitative_measurements);
      const quantUpdates = getBulkUpdates(quantitative_measurements);
      const captureUpdates = getBulkUpdates(captures);
      const mortalityUpdates = getBulkUpdates(mortalities);

      const markingDeletes = getBulkDeletes(markings);
      const collectionDeletes = getBulkDeletes(collections);
      const qualDeletes = getBulkDeletes(qualitative_measurements);
      const quantDeletes = getBulkDeletes(quantitative_measurements);
      const captureDeletes = getBulkDeletes(captures);
      const mortalityDeletes = getBulkDeletes(mortalities);
      const parentDeletes = getBulkDeletes(families?.parents);
      const childDeletes = getBulkDeletes(families?.children);

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
        locations: locations
          ? z.array(LocationUpdateSchema.extend({ location_id: zodID })).parse(locations, {
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
