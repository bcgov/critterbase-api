import { Prisma, marking } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { CritterUpdate } from "../critter/critter.utils";
import { CollectionUnitUpdateInput } from "../collectionUnit/collectionUnit.utils";
import {
  MarkingDeleteSchema,
  MarkingUpdateByIdSchema,
  MarkingUpdateInput,
} from "../marking/marking.utils";
import { CaptureUpdate } from "../capture/capture.utils";
import { MortalityUpdate } from "../mortality/mortality.utils";
import { updateMortality } from "../mortality/mortality.service";
import { apiError } from "../../utils/types";
import { updateCapture } from "../capture/capture.service";
import { z } from "zod";
import { deleteMarking, updateMarking } from "../marking/marking.service";

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
  collections: CollectionUnitUpdateInput[];
  markings: z.infer<typeof MarkingUpdateByIdSchema>[];
  locations: Prisma.locationUpdateInput[];
  captures: CaptureUpdate[];
  mortalities: MortalityUpdate[];
  //Deletes
  _deleteMarkings: z.infer<typeof MarkingDeleteSchema>[];
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

const bulkUpdateData = async (bulkParams: IBulkMutate) => {
  const {
    critters,
    collections,
    locations,
    captures,
    mortalities,
    markings,
    _deleteMarkings,
  } = bulkParams;
  const counts: Omit<IBulkResCount, "created"> = {
    updated: {},
    deleted: {},
  };
  const result = await prisma.$transaction(async (prisma) => {
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
      await prisma.critter_collection_unit.update({
        where: { critter_collection_unit_id: c.critter_collection_unit_id },
        data: c,
      });
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
      await updateCapture(c.capture_id, c);
    }
    for (let i = 0; i < mortalities.length; i++) {
      const m = mortalities[i];
      counts.updated.mortalities = i + 1;
      if (!m.mortality_id) {
        throw apiError.requiredProperty("mortality_id");
      }
      await updateMortality(m.mortality_id, m);
    }
    for (let i = 0; i < markings.length; i++) {
      const ma = markings[i];
      counts.updated.markings = i + 1;
      await updateMarking(ma.marking_id, ma);
    }
    for (let i = 0; i < _deleteMarkings.length; i++) {
      const _dma = _deleteMarkings[i];
      counts.deleted.markings = i + 1;
      await deleteMarking(_dma.marking_id);
    }
  });
  return counts;
};

const bulkErrMap = (
  issue: z.ZodIssueOptionalMessage,
  ctx: z.ErrorMapCtx,
  objKey: keyof IBulkMutate
) => ({
  message: `${objKey}[${issue.path[0]}].${issue.path[1]}~${ctx.defaultError}`,
});

export { bulkCreateData, bulkUpdateData, IBulkCreate, IBulkMutate, bulkErrMap };
