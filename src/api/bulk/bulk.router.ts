import express, { Request, Response } from 'express';
import { catchErrors } from '../../utils/middleware';
import { CaptureCreateSchema, CaptureDeleteSchema, CaptureUpdateSchema } from '../capture/capture.utils';
import { MarkingCreateBodySchema, MarkingDeleteSchema, MarkingUpdateByIdSchema } from '../marking/marking.utils';
import { MortalityCreateSchema, MortalityDeleteSchema, MortalityUpdateSchema } from '../../schemas/mortality-schema';
import { IBulkDelete, IBulkMutate, bulkErrMap } from './bulk.service';
import { BulkCreationSchema, filterAndRemoveDeletes } from './bulk.utils';
import {
  CollectionUnitCreateBodySchema,
  CollectionUnitDeleteSchema,
  CollectionUnitUpsertSchema
} from '../collectionUnit/collectionUnit.utils';
import { z } from 'zod';
import { LocationUpdateSchema } from '../location/location.utils';
import { zodID } from '../../utils/zod_helpers';
import { ICbDatabase } from '../../utils/database';
import {
  QualitativeCreateSchema,
  QualitativeDeleteSchema,
  QualitativeUpdateSchema,
  QuantitativeCreateSchema,
  QuantitativeDeleteSchema,
  QuantitativeUpdateSchema
} from '../measurement/measurement.utils';
import {
  FamilyChildCreateBodySchema,
  FamilyChildDeleteSchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema,
  FamilyParentDeleteSchema
} from '../family/family.utils';
import { BulkCritterCreateSchema, CritterCreateSchema, CritterUpdateSchema } from '../../schemas/critter-schema';

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

      const results = await db.bulkCreateData({
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

      const markingDeletes = filterAndRemoveDeletes(markings);
      const collectionDeletes = filterAndRemoveDeletes(collections);
      const qualDeletes = filterAndRemoveDeletes(qualitative_measurements);
      const quantDeletes = filterAndRemoveDeletes(quantitative_measurements);
      const captureDeletes = filterAndRemoveDeletes(captures);
      const mortalityDeletes = filterAndRemoveDeletes(mortalities);
      const parentDeletes = filterAndRemoveDeletes(families?.parents);
      const childDeletes = filterAndRemoveDeletes(families?.children);

      const updateBody: IBulkMutate = {
        critters: critters
          ? z.array(CritterUpdateSchema.extend({ critter_id: zodID })).parse(critters, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'critters')
            })
          : [],
        collections: collections
          ? z.array(CollectionUnitUpsertSchema).parse(collections, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'collections')
            })
          : [],
        markings: markings
          ? z.array(MarkingUpdateByIdSchema).parse(markings, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'markings')
            })
          : [],
        locations: locations
          ? z.array(LocationUpdateSchema.extend({ location_id: zodID })).parse(locations, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'locations')
            })
          : [],
        captures: captures
          ? z.array(CaptureUpdateSchema.extend({ capture_id: zodID })).parse(captures, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'captures')
            })
          : [],
        mortalities: mortalities
          ? z.array(MortalityUpdateSchema.extend({ mortality_id: zodID })).parse(mortalities, {
              errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'mortalities')
            })
          : [],
        qualitative_measurements: qualitative_measurements
          ? z
              .array(
                QualitativeUpdateSchema.required({
                  measurement_qualitative_id: true
                })
              )
              .parse(qualitative_measurements, {
                errorMap: (issue, ctx) => bulkErrMap(issue, ctx, 'qualitative_measurements')
              })
          : [],
        quantitative_measurements: quantitative_measurements
          ? z
              .array(
                QuantitativeUpdateSchema.required({
                  measurement_quantitative_id: true
                })
              )
              .parse(quantitative_measurements, {
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
