import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../utils/constants";
import { CritterUpdate } from "../critter/critter.utils";
import { CollectionUnitDeleteSchema, CollectionUnitUpsertType } from "../collectionUnit/collectionUnit.utils";
import {
  MarkingDeleteSchema,
  MarkingUpdateByIdSchema,
} from "../marking/marking.utils"; 
import { MortalityUpdate, mortalityInclude } from "../mortality/mortality.utils";
import { apiError } from "../../utils/types";
import { ICbDatabase } from "../../utils/database";
import { CaptureUpdate } from "../capture/capture.utils";

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
  const { critters, collections, markings, locations, captures, mortalities, quantitative_measurements, qualitative_measurements, families, family_children, family_parents } =
    bulkParams;
  const counts: Omit<IBulkResCount, "updated" | "deleted"> = {
    created: {}
  };
  console.log (JSON.stringify(bulkParams, null, 2) );
  await prisma.$transaction(async (prisma) => {
    const critterCount = await prisma.critter.createMany({
      data: critters,
    });
    counts.created.critters = critterCount.count;

    const cuCount = await prisma.critter_collection_unit.createMany({
      data: collections,
    });
    counts.created.collections = cuCount.count;

    const locCount = await prisma.location.createMany({
      data: locations,
    });
    counts.created.locations = locCount.count;

    const captureCount = await prisma.capture.createMany({
      data: captures,
    });
    counts.created.captures = captureCount.count;
    
    const mortalitycount = await prisma.mortality.createMany({
      data: mortalities,
    });
    counts.created.mortalities = mortalitycount.count;

    const markingCount = await prisma.marking.createMany({
      data: markings,
    });
    counts.created.markings = markingCount.count;

    const measQualCount = await prisma.measurement_qualitative.createMany({
      data: qualitative_measurements,
    });
    counts.created.qualitative_measurements = measQualCount.count;

    const measQuantCount = await prisma.measurement_quantitative.createMany({
      data: quantitative_measurements,
    });
    counts.created.quantitative_measurements = measQuantCount.count;

    const familyCount = await prisma.family.createMany({
      data: families
    });
    counts.created.families = familyCount.count;

    const familyParentCount = await prisma.family_parent.createMany({
      data: family_parents
    });
    counts.created.family_parents = familyParentCount.count;

    const familyChildCount = await prisma.family_child.createMany({
      data: family_children
    });
    counts.created.family_children = familyChildCount.count;
  });

  return counts;
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
      await db.deleteMarking(_dma.marking_id);
    }
    for(let i = 0; i < _deleteUnits.length; i++) {
      const _dma = _deleteUnits[i];
      counts.deleted.collections = i + 1;
      await db.deleteCollectionUnit(_dma.critter_collection_unit_id);
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
