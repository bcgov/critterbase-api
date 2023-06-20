import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../utils/constants";
import { CritterUpdate } from "../critter/critter.utils";
import { CollectionUnitDeleteSchema, CollectionUnitUpsertType } from "../collectionUnit/collectionUnit.utils";
import {
  MarkingDeleteSchema,
  MarkingUpdateByIdSchema,
} from "../marking/marking.utils"; 
import { MortalityUpdate } from "../mortality/mortality.utils";
import { apiError } from "../../utils/types";
import { deleteMarking } from "../marking/marking.service";
import { ICbDatabase } from "../../utils/database";
import { CaptureUpdate } from "../capture/capture.utils";
import { deleteCollectionUnit } from "../collectionUnit/collectionUnit.service";

interface IBulkCreate {
  critters: Prisma.critterCreateManyInput[];
  collections: Prisma.critter_collection_unitCreateManyInput[];
  markings: Prisma.markingCreateManyInput[];
  locations: Prisma.locationCreateManyInput[];
  captures: Prisma.captureCreateManyInput[];
  mortalities: Prisma.mortalityCreateManyInput[];
}

interface IBulkMutate {
  critters: CritterUpdate[];
  collections: CollectionUnitUpsertType[];
  markings: z.infer<typeof MarkingUpdateByIdSchema>[];
  locations: Prisma.locationUpdateInput[];
  captures: CaptureUpdate[];
  mortalities: MortalityUpdate[];
  //Deletes
  _deleteMarkings: z.infer<typeof MarkingDeleteSchema>[];
  _deleteUnits: z.infer<typeof CollectionUnitDeleteSchema>[];
}

interface IBulkResCount {
  created: Partial<Record<keyof IBulkCreate, number>>;
  updated: Partial<Record<keyof IBulkCreate, number>>;
  deleted: Partial<Record<keyof IBulkCreate, number>>;
}

const bulkCreateData = async (bulkParams: IBulkCreate) => {
  const { critters, collections, markings, locations, captures, mortalities } =
    bulkParams;
  const result = await prisma.$transaction(async (prisma) => {
    const critterRes = await prisma.critter.createMany({
      data: critters,
    });

    await prisma.critter_collection_unit.createMany({
      data: collections,
    });

    await prisma.location.createMany({
      data: locations,
    });

    await prisma.capture.createMany({
      data: captures,
    });

    await prisma.mortality.createMany({
      data: mortalities,
    });

    await prisma.marking.createMany({
      data: markings,
    });

    return critterRes;
  });

  return result;
};

const bulkUpdateData = async (bulkParams: IBulkMutate, db: ICbDatabase) => {
  const {
    critters,
    collections,
    locations,
    captures,
    mortalities,
    markings,
    _deleteMarkings,
    _deleteUnits
  } = bulkParams;
  const counts: Omit<IBulkResCount, "created"> = {
    updated: {},
    deleted: {},
  };
    await prisma.$transaction(async (prisma) => {
    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      counts.updated.critters = i + 1;
      await prisma.critter.update({
        where: { critter_id: c.critter_id },
        data: c,
      });
    }
    for (let i = 0; i < collections.length; i++) {
      const c = collections[i];
      counts.updated.collections = i + 1;
      if(c.critter_collection_unit_id) {
        await prisma.critter_collection_unit.update({
          where: { critter_collection_unit_id: c.critter_collection_unit_id },
          data: c,
        });
      }
      else if(c.critter_id !== undefined) {
        await prisma.critter_collection_unit.create({
          data: { //XOR typing seems to force me to use the connect syntax here 
            critter: { connect: { critter_id: c.critter_id }},
            xref_collection_unit: { connect: { collection_unit_id: c.collection_unit_id }}
          }
        })
      }
    }
    for (let i = 0; i < locations.length; i++) {
      const l = locations[i];
      counts.updated.locations = i + 1;
      await prisma.location.update({
        where: { location_id: l.location_id as string },
        data: l,
      });
    }
    for (let i = 0; i < captures.length; i++) {
      const c = captures[i];
      counts.updated.captures = i + 1;
      if (!c.capture_id) {
        throw apiError.requiredProperty("capture_id");
      }
      await db.updateCapture(c.capture_id, c, prisma);
    }
    for (let i = 0; i < mortalities.length; i++) {
      const m = mortalities[i];
      counts.updated.mortalities = i + 1;
      if (!m.mortality_id) {
        throw apiError.requiredProperty("mortality_id");
      }
      await db.updateMortality(m.mortality_id, m, prisma);
    }
    for (let i = 0; i < markings.length; i++) {
      const ma = markings[i];
      counts.updated.markings = i + 1;
      if(ma.marking_id) {
        await prisma.marking.update({
          where: { marking_id: ma.marking_id},
          data: ma
        })
      }
      else {
        await prisma.marking.create({
          data: ma
        })
      }
      
    }
    for (let i = 0; i < _deleteMarkings.length; i++) {
      const _dma = _deleteMarkings[i];
      counts.deleted.markings = i + 1;
      await deleteMarking(_dma.marking_id);
    }
    for(let i = 0; i < _deleteUnits.length; i++) {
      const _dma = _deleteUnits[i];
      counts.deleted.collections = i + 1;
      await deleteCollectionUnit(_dma.critter_collection_unit_id);
    }
  }, {timeout: 90000});
  return counts;
};

const bulkErrMap = (
  issue: z.ZodIssueOptionalMessage,
  ctx: z.ErrorMapCtx,
  objKey: keyof IBulkMutate
) => ({
  message: `${objKey}[${issue.path[0]}].${issue.path[1]}~${ctx.defaultError}`,
});

export { IBulkCreate, IBulkMutate, bulkCreateData, bulkErrMap, bulkUpdateData };
