import { Prisma, critter, mortality } from "@prisma/client";
import { defaultFormat, oneDay, prisma } from "../../utils/constants";
import {
  CritterCreate,
  CritterIdsRequest,
  CritterUpdate,
  UniqueCritterQuery,
  critterFormats,
} from "./critter.utils";
import { intersect } from "../../utils/helper_functions";
import { LocationResponse } from "../location/location.utils";
import { Service } from "../../utils/base_classes";
import { CritterRepository } from "./critter.repository";

export class CritterService extends Service<CritterRepository> {
  constructor(repository = new CritterRepository()) {
    super(repository);
  }

  async getAllCritters() {
    return this.repository.getAllCritters();
  }

  async getMultipleCrittersByIds() {
    return this.repository.getMultipleCrittersByIds();
  }
}

const getAllCritters = async (format = defaultFormat, whereFilter = {}) => {
  return await prisma.critter.findMany({
    ...critterFormats[format]?.prismaIncludes,
    where: whereFilter,
  });
};

/**
 * Fetch multiple critters by their IDs
 * Returns minimal required data for faster response
 */
const getMultipleCrittersByIds = async (
  critterIds: CritterIdsRequest,
  format = defaultFormat,
) => {
  const results = await prisma.critter.findMany({
    ...critterFormats[format]?.prismaIncludes,
    where: {
      critter_id: {
        in: critterIds.critter_ids,
      },
    },
  });
  return results;
};

const getCritterById = async (critter_id: string, format = defaultFormat) => {
  return await prisma.critter.findUniqueOrThrow({
    ...critterFormats[format]?.prismaIncludes,
    where: { critter_id: critter_id },
  });
};

const getCritterByWlhId = async (wlh_id: string, format = defaultFormat) => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  const results = await prisma.critter.findMany({
    ...critterFormats[format]?.prismaIncludes,
    where: {
      wlh_id: wlh_id,
    },
  });

  return results;
};

const updateCritter = async (
  critter_id: string,
  critter_data: CritterUpdate,
  format = defaultFormat,
) => {
  return prisma.critter.update({
    ...critterFormats[format]?.prismaIncludes,
    where: {
      critter_id: critter_id,
    },
    data: critter_data,
  });
};

const createCritter = async (
  critter_data: CritterCreate,
  format = defaultFormat,
) => {
  const critter = await prisma.critter.create({
    ...critterFormats[format]?.prismaIncludes,
    data: critter_data,
  });
  return critter;
};

const deleteCritter = async (critter_id: string, format = defaultFormat) => {
  const critter = await prisma.critter.delete({
    ...critterFormats[format]?.prismaIncludes,
    where: {
      critter_id: critter_id,
    },
  });
  return critter;
};

const formatLocationNameSearch = (
  obj: Partial<LocationResponse> | null | undefined,
):
  | (Prisma.Without<Prisma.LocationRelationFilter, Prisma.locationWhereInput> &
      Prisma.locationWhereInput)
  | (Prisma.Without<Prisma.locationWhereInput, Prisma.LocationRelationFilter> &
      Prisma.LocationRelationFilter)
  | null
  | undefined => {
  return {
    lk_region_env: obj?.region_env_name
      ? {
          region_env_name: {
            contains: obj.region_env_name,
            mode: "insensitive",
          },
        }
      : undefined,
    lk_region_nr: obj?.region_nr_name
      ? {
          region_nr_name: {
            contains: obj.region_nr_name,
            mode: "insensitive",
          },
        }
      : undefined,
    lk_wildlife_management_unit: obj?.wmu_name
      ? {
          wmu_name: {
            contains: obj.wmu_name,
            mode: "insensitive",
          },
        }
      : undefined,
  };
};
//changed body: any -> lk_taxon
const appendEnglishTaxonAsUUID = async (body: {
  taxon_name_common?: string;
  taxon_name_latin?: string;
  taxon_id?: string;
}) => {
  let taxon = null;
  if (body.taxon_name_common) {
    taxon = await prisma.lk_taxon.findFirst({
      where: {
        taxon_name_common: {
          equals: body.taxon_name_common,
          mode: "insensitive",
        },
      },
    });
  }
  if (body.taxon_name_latin) {
    taxon = await prisma.lk_taxon.findFirst({
      where: {
        taxon_name_latin: {
          equals: body.taxon_name_latin,
          mode: "insensitive",
        },
      },
    });
  }
  if (taxon) {
    body.taxon_id = taxon.taxon_id;
  }
  return body;
};

const getSimilarCritters = async (
  body: UniqueCritterQuery,
  format = defaultFormat,
): Promise<critter[]> => {
  let critters: critter[] = [];
  if (body.critter) {
    critters = await prisma.critter.findMany({
      where: {
        lk_taxon:
          body.critter.taxon_name_common || body.critter.taxon_name_latin
            ? {
                taxon_name_latin: body.critter.taxon_name_latin ?? undefined,
                taxon_name_common: body.critter.taxon_name_common ?? undefined,
              }
            : undefined,
        wlh_id: body.critter.wlh_id,
        sex: body.critter.sex,
        animal_id: {
          endsWith: body.critter.animal_id ?? undefined,
          mode: "insensitive",
        },
      },
    });
  }

  const markings = [];
  if (body.markings) {
    for (const m of body.markings) {
      const markingMatches = await prisma.marking.findMany({
        where: {
          xref_taxon_marking_body_location: m.body_location
            ? {
                body_location: {
                  contains: m.body_location,
                  mode: "insensitive",
                },
              }
            : undefined,
          lk_colour_marking_primary_colour_idTolk_colour: m.primary_colour
            ? {
                colour: { contains: m.primary_colour, mode: "insensitive" },
              }
            : undefined,
          lk_colour_marking_secondary_colour_idTolk_colour: m.secondary_colour
            ? {
                colour: { contains: m.secondary_colour, mode: "insensitive" },
              }
            : undefined,
          lk_marking_type: m.marking_type
            ? {
                name: { contains: m.marking_type, mode: "insensitive" },
              }
            : undefined,
          identifier: m.identifier ? String(m.identifier) : undefined,
        },
      });
      markings.push(...markingMatches);
    }
  }

  const captures = [];
  if (body.captures) {
    for (const c of body.captures) {
      const capture_timestamp = c.capture_timestamp
        ? new Date(c.capture_timestamp)
        : undefined;
      const release_timestamp = c.release_timestamp
        ? new Date(c.release_timestamp)
        : undefined;
      const captureMatches = await prisma.capture.findMany({
        where: {
          capture_timestamp: capture_timestamp
            ? {
                gte: capture_timestamp,
                lt: new Date(+capture_timestamp.getTime() + +oneDay),
              }
            : undefined,
          release_timestamp: release_timestamp
            ? {
                gte: release_timestamp,
                lt: new Date(+release_timestamp.getTime() + +oneDay),
              }
            : undefined,
          location_capture_capture_location_idTolocation:
            formatLocationNameSearch(c.capture_location),
          location_capture_release_location_idTolocation:
            formatLocationNameSearch(c.release_location),
        },
      });
      captures.push(...captureMatches);
    }
  }

  const mortality: mortality[] = [];
  if (body.mortality) {
    const m = body.mortality;
    const mortality_timestamp = m.mortality_timestamp
      ? new Date(m.mortality_timestamp)
      : undefined;
    const mortality_result = await prisma.mortality.findMany({
      where: {
        mortality_timestamp: mortality_timestamp
          ? {
              gte: mortality_timestamp,
              lt: new Date(+mortality_timestamp.getTime() + +oneDay),
            }
          : undefined,
        location: formatLocationNameSearch(m.location),
      },
    });
    mortality.push(...mortality_result);
  }

  let overlappingIds = Array.from(
    new Set([
      ...critters.map((a) => a.critter_id),
      ...markings.map((a) => a.critter_id),
    ]),
  );

  if (critters.length && markings.length) {
    overlappingIds = intersect(
      critters.map((c) => c.critter_id),
      markings.map((m) => m.critter_id),
    );
  }
  if (captures.length) {
    overlappingIds = intersect(
      captures.map((c) => c.critter_id),
      overlappingIds,
    );
  }
  if (mortality.length) {
    overlappingIds = intersect(
      mortality.map((m) => m.critter_id),
      overlappingIds,
    );
  }

  const foundCritters = await prisma.critter.findMany({
    ...critterFormats[format]?.prismaIncludes,
    where: {
      critter_id: {
        in:
          critters.length == 1
            ? critters.map((c) => c.critter_id)
            : overlappingIds,
      },
    },
  });
  return foundCritters;
};

export {
  getAllCritters,
  getCritterById,
  getCritterByWlhId,
  updateCritter,
  createCritter,
  deleteCritter,
  getSimilarCritters,
  appendEnglishTaxonAsUUID,
  getMultipleCrittersByIds,
  formatLocationNameSearch,
};
