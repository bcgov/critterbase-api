import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { Repository } from '../../repositories/base-repository';
import { CaptureDeleteSchema, CaptureUpdate } from '../../schemas/capture-schema';
import { BulkCritterUpdateSchema } from '../../schemas/critter-schema';
import { MortalityDeleteSchema, MortalityUpdate } from '../../schemas/mortality-schema';
import { prisma } from '../../utils/constants';
import { ICbDatabase } from '../../utils/database';
import { PrismaTransactionClient, apiError } from '../../utils/types';
import { CollectionUnitDeleteSchema, CollectionUnitUpsertType } from '../collectionUnit/collectionUnit.utils';
import { FamilyChildDeleteSchema, FamilyParentDeleteSchema } from '../family/family.utils';
import { MarkingDeleteSchema, MarkingUpdateByIdSchema } from '../marking/marking.utils';
import { QualitativeDeleteSchema, QuantitativeDeleteSchema } from '../measurement/measurement.utils';

interface IBulkCreate {
  critters: Prisma.critterCreateManyInput[];
  collections: Prisma.critter_collection_unitCreateManyInput[];
  markings: Prisma.markingCreateManyInput[];
  quantitative_measurements: Prisma.measurement_quantitativeCreateManyInput[];
  qualitative_measurements: Prisma.measurement_qualitativeCreateManyInput[];
  locations: Prisma.locationCreateManyInput[];
  captures: Prisma.captureCreateManyInput[];
  mortalities: Prisma.mortalityCreateManyInput[];
  families: Prisma.familyCreateManyInput[];
  family_parents: Prisma.family_parentCreateManyInput[];
  family_children: Prisma.family_childCreateManyInput[];
}

interface IBulkMutate {
  critters: BulkCritterUpdateSchema[];
  collections: CollectionUnitUpsertType[];
  markings: z.infer<typeof MarkingUpdateByIdSchema>[];
  locations: Prisma.locationUpdateInput[];
  captures: CaptureUpdate[];
  mortalities: MortalityUpdate[];
  qualitative_measurements: Prisma.measurement_qualitativeUpdateInput[];
  quantitative_measurements: Prisma.measurement_quantitativeUpdateInput[];
}

interface IBulkDelete {
  //Deletes
  _deleteMarkings: z.infer<typeof MarkingDeleteSchema>[];
  _deleteUnits: z.infer<typeof CollectionUnitDeleteSchema>[];
  _deleteCaptures: z.infer<typeof CaptureDeleteSchema>[];
  _deleteMoralities: z.infer<typeof MortalityDeleteSchema>[];
  _deleteQuant: z.infer<typeof QuantitativeDeleteSchema>[];
  _deleteQual: z.infer<typeof QualitativeDeleteSchema>[];
  _deleteParents: z.infer<typeof FamilyParentDeleteSchema>[];
  _deleteChildren: z.infer<typeof FamilyChildDeleteSchema>[];
}

interface IBulkResCount {
  created: Partial<Record<keyof IBulkCreate, number>>;
  updated: Partial<Record<keyof IBulkCreate, number>>;
  deleted: Partial<Record<keyof IBulkCreate, number>>;
}

const bulkUpdateData = async (bulkParams: IBulkMutate, db: ICbDatabase) => {
  const {
    critters,
    collections,
    locations,
    captures,
    mortalities,
    markings,
    qualitative_measurements,
    quantitative_measurements
  } = bulkParams;
  const counts: Omit<IBulkResCount, 'created' | 'deleted'> = {
    updated: {}
  };
  await prisma.$transaction(
    async (prisma) => {
      for (let i = 0; i < critters.length; i++) {
        const c = critters[i];
        counts.updated.critters = i + 1;
        await prisma.critter.update({
          where: { critter_id: c.critter_id },
          data: c
        });
      }
      for (let i = 0; i < collections.length; i++) {
        const c = collections[i];
        counts.updated.collections = i + 1;
        if (c.critter_collection_unit_id) {
          await prisma.critter_collection_unit.update({
            where: { critter_collection_unit_id: c.critter_collection_unit_id },
            data: c
          });
        } else if (c.critter_id !== undefined) {
          await prisma.critter_collection_unit.create({
            data: {
              //XOR typing seems to force me to use the connect syntax here
              critter: { connect: { critter_id: c.critter_id } },
              xref_collection_unit: {
                connect: { collection_unit_id: c.collection_unit_id }
              }
            }
          });
        }
      }
      for (let i = 0; i < locations.length; i++) {
        const l = locations[i];
        counts.updated.locations = i + 1;
        await prisma.location.update({
          where: { location_id: l.location_id as string },
          data: l
        });
      }
      for (let i = 0; i < captures.length; i++) {
        const c = captures[i];
        counts.updated.captures = i + 1;
        if (!c.capture_id) {
          throw apiError.requiredProperty('capture_id');
        }
        await db.captureService.updateCapture(c.capture_id, c);
      }
      for (let i = 0; i < mortalities.length; i++) {
        const m = mortalities[i];
        counts.updated.mortalities = i + 1;
        if (!m.mortality_id) {
          throw apiError.requiredProperty('mortality_id');
        }
        await db.mortalityService.updateMortality(m.mortality_id, m);
      }
      for (let i = 0; i < markings.length; i++) {
        const ma = markings[i];
        counts.updated.markings = i + 1;
        if (ma.marking_id) {
          await prisma.marking.update({
            where: { marking_id: ma.marking_id },
            data: ma
          });
        } else {
          await prisma.marking.create({
            data: ma
          });
        }
      }
      for (let i = 0; i < qualitative_measurements.length; i++) {
        const meas = qualitative_measurements[i];
        counts.updated.qualitative_measurements = i + 1;
        if (!meas.measurement_qualitative_id) {
          throw apiError.requiredProperty('measurement_qualitative_id');
        }
        await prisma.measurement_qualitative.update({
          where: {
            measurement_qualitative_id: meas.measurement_qualitative_id as string
          },
          data: meas
        });
      }
      for (let i = 0; i < quantitative_measurements.length; i++) {
        const meas = quantitative_measurements[i];
        counts.updated.quantitative_measurements = i + 1;
        if (!meas.measurement_quantitative_id) {
          throw apiError.requiredProperty('measurement_qualitative_id');
        }
        await prisma.measurement_quantitative.update({
          where: {
            measurement_quantitative_id: meas.measurement_quantitative_id as string
          },
          data: meas
        });
      }
    },
    { timeout: 90000 }
  );
  return counts;
};

const bulkDeleteData = async (bulkParams: IBulkDelete, db: ICbDatabase) => {
  const {
    _deleteMarkings,
    _deleteUnits,
    _deleteCaptures,
    _deleteMoralities,
    _deleteQual,
    _deleteQuant,
    _deleteParents,
    _deleteChildren
  } = bulkParams;
  const counts: Omit<IBulkResCount, 'created' | 'updated'> = {
    deleted: {}
  };

  const repository = new Repository(prisma);

  //TODO: Update this service to use Promise.all once all services are refactored

  await repository.transactionHandler(async () => {
    for (let i = 0; i < _deleteMarkings.length; i++) {
      const _dma = _deleteMarkings[i];
      counts.deleted.markings = i + 1;
      await db.deleteMarking(_dma.marking_id, repository.prisma as unknown as PrismaTransactionClient);
    }
    for (let i = 0; i < _deleteUnits.length; i++) {
      const _dma = _deleteUnits[i];
      counts.deleted.collections = i + 1;
      await db.deleteCollectionUnit(
        _dma.critter_collection_unit_id,
        repository.prisma as unknown as PrismaTransactionClient
      );
    }

    const captureIds = _deleteCaptures.map((capture) => capture.capture_id);
    const captureCount = await db.captureService.deleteMultipleCaptures(captureIds);
    counts.deleted.captures = captureCount.count;

    for (let i = 0; i < _deleteMoralities.length; i++) {
      const _dma = _deleteMoralities[i];
      counts.deleted.mortalities = i + 1;
      await db.mortalityService.deleteMortality(_dma.mortality_id);
    }
    for (let i = 0; i < _deleteQual.length; i++) {
      const _dma = _deleteQual[i];
      counts.deleted.qualitative_measurements = i + 1;
      await db.deleteQualMeasurement(
        _dma.measurement_qualitative_id,
        repository.prisma as unknown as PrismaTransactionClient
      );
    }
    for (let i = 0; i < _deleteQuant.length; i++) {
      const _dma = _deleteQuant[i];
      counts.deleted.captures = i + 1;
      await db.deleteQuantMeasurement(
        _dma.measurement_quantitative_id,
        repository.prisma as unknown as PrismaTransactionClient
      );
    }
    for (let i = 0; i < _deleteParents.length; i++) {
      const _dma = _deleteParents[i];
      counts.deleted.family_parents = i + 1;
      await db.removeParentOfFamily(
        _dma.family_id,
        _dma.parent_critter_id,
        repository.prisma as unknown as PrismaTransactionClient
      );
    }
    for (let i = 0; i < _deleteChildren.length; i++) {
      const _dma = _deleteChildren[i];
      counts.deleted.family_children = i + 1;
      await db.removeChildOfFamily(
        _dma.family_id,
        _dma.child_critter_id,
        repository.prisma as unknown as PrismaTransactionClient
      );
    }
  });
  return counts;
};

const bulkErrMap = (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx, objKey: keyof IBulkMutate) => ({
  message: `${objKey}[${issue.path[0]}].${issue.path[1]}~${ctx.defaultError}`
});

export { IBulkCreate, IBulkDelete, IBulkMutate, bulkDeleteData, bulkErrMap, bulkUpdateData };
