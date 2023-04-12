import { Prisma, critter, mortality } from "@prisma/client";
import { prisma } from "../../utils/constants";
import {
  CritterCreate,
  CritterResponseSchema,
  CritterUpdate,
  UniqueCritterQuery,
  formattedCritterInclude,
} from "./critter.utils";
import { markingIncludes } from "../marking/marking.utils";
import { intersect } from "../../utils/helper_functions";
import { LocationResponse } from "../location/location.utils";

const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

const getCritterById = async (critter_id: string): Promise<critter | null> => {
  return await prisma.critter.findUniqueOrThrow({
    where: { critter_id: critter_id },
  });
};

const getCritterByIdWithDetails = async (
  critter_id: string
): Promise<critter | null> => {
  const result = await prisma.critter.findUniqueOrThrow({
    ...formattedCritterInclude,
    where: {
      critter_id: critter_id,
    },
  });

  return result;
};

const getCritterByWlhId = async (wlh_id: string): Promise<critter[]> => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  const results = await prisma.critter.findMany({
    ...formattedCritterInclude,
    where: {
      wlh_id: wlh_id,
    },
  });

  return results;
};

const updateCritter = async (
  critter_id: string,
  critter_data: CritterUpdate
): Promise<critter> => {
  return prisma.critter.update({
    where: {
      critter_id: critter_id,
    },
    data: critter_data,
  });
};

const createCritter = async (critter_data: CritterCreate): Promise<critter> => {
  const critter = await prisma.critter.create({
    data: critter_data,
  });
  return critter;
};

const deleteCritter = async (critter_id: string): Promise<critter> => {
  const critter = await prisma.critter.delete({
    where: {
      critter_id: critter_id,
    },
  });
  return critter;
};

const formatLocationNameSearch = (obj: Partial<LocationResponse> | null | undefined): 
(Prisma.Without<Prisma.LocationRelationFilter, Prisma.locationWhereInput> & Prisma.locationWhereInput) 
| (Prisma.Without<Prisma.locationWhereInput, Prisma.LocationRelationFilter> & Prisma.LocationRelationFilter) | null | undefined => {
  return {
    lk_region_env: {
      region_env_name:  { contains: obj?.region_env_name ?? undefined, mode: 'insensitive' }
    },
    lk_region_nr: {
      region_nr_name: { contains: obj?.region_nr_name ?? undefined, mode: 'insensitive' } ,
    },
    lk_wildlife_management_unit: {
      wmu_name: { contains: obj?.wmu_name ?? undefined, mode: 'insensitive' }
    }
  }
}

const getSimilarCritters = async (body: UniqueCritterQuery & {detail: boolean}): Promise<critter[]> => {
  let critters: critter[] = [];
  if(body.critter) {
    critters = await prisma.critter.findMany({
      where: {
            lk_taxon: body.critter?.taxon_name_common || body.critter?.taxon_name_latin ? {
              taxon_name_latin: body.critter.taxon_name_latin ?? undefined,
              taxon_name_common: body.critter.taxon_name_common ?? undefined
            } : undefined,
            wlh_id: body.critter.wlh_id,
            sex: body.critter.sex,
            animal_id: { endsWith: body.critter.animal_id ?? undefined, mode: 'insensitive' } 
        }
    });
  }

  if (critters.length == 1) {
    return critters;
  }

  const markings = [];
  if(body.markings) { 
    for(const m of body.markings) {
      const markingMatches = await prisma.marking.findMany({
        where: {
          xref_taxon_marking_body_location: m.body_location ? {
            body_location: {contains: m.body_location, mode: "insensitive" } 
          } : undefined,
          lk_colour_marking_primary_colour_idTolk_colour: m.primary_colour ? {
            colour: {contains: m.primary_colour, mode: "insensitive" } 
          } : undefined,
          lk_colour_marking_secondary_colour_idTolk_colour: m.secondary_colour ? {
            colour: {contains: m.secondary_colour, mode: "insensitive" } 
          } : undefined,
          identifier: m.identifier ? String(m.identifier) : undefined
        }
      });
      markings.push(...markingMatches);
    };
  }

  const oneDay = 60 * 60 * 24 * 1000;
  const captures = [];
  if(body.captures) {
    for(const c of body.captures) {
      const capture_timestamp = c.capture_timestamp ? new Date(c.capture_timestamp) : undefined;
      const release_timestamp = c.release_timestamp ? new Date(c.release_timestamp) : undefined;
      const captureMatches = await prisma.capture.findMany({
        where: {
          capture_timestamp: capture_timestamp ? {
            gte: capture_timestamp,
            lt: new Date(capture_timestamp.getTime() + oneDay)
          } : undefined,
          release_timestamp: release_timestamp ? {
            gte: release_timestamp,
            lt: new Date(release_timestamp.getTime() + oneDay)
          } : undefined,
          location_capture_capture_location_idTolocation: formatLocationNameSearch(c.capture_location),
          location_capture_release_location_idTolocation: formatLocationNameSearch(c.release_location)
      }});
      captures.push(...captureMatches);
    }
  }
  
  const mortality: mortality[] = [];
  if(body.mortality) { 
    const m = body.mortality;
    const mortality_timestamp = m.mortality_timestamp ? new Date(m.mortality_timestamp) : undefined;
    const mortality_result = await prisma.mortality.findMany({
      where: {
        mortality_timestamp: mortality_timestamp ? {
          gte: mortality_timestamp,
          lt: new Date(mortality_timestamp.getTime() + oneDay)
        } : undefined,
        location: formatLocationNameSearch(m.location)
      }
    });
    mortality.push(...mortality_result);
  }

  let overlappingIds = Array.from(new Set([...critters.map(a => a.critter_id), ...markings.map(a => a.critter_id)]));
  if(critters.length && markings.length) {
    overlappingIds = intersect(critters.map(c => c.critter_id), markings.map(m => m.critter_id));
  }
  if(captures.length) {
    overlappingIds = intersect(captures.map(c => c.critter_id), overlappingIds);
  }
  if(mortality.length) {
    overlappingIds = intersect(mortality.map(m => m.critter_id), overlappingIds);
  }

  const detailedCritters = await prisma.critter.findMany({
    ...formattedCritterInclude,
    where: {
      critter_id: { in: overlappingIds }
    }
  });
  return detailedCritters.map(c => CritterResponseSchema.parse(c));
}

const getTableDataTypes = async () => {
  const results = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'critter'`;
  return results;
}

export {
  getAllCritters,
  getCritterById,
  getCritterByWlhId,
  updateCritter,
  createCritter,
  deleteCritter,
  getCritterByIdWithDetails,
  getSimilarCritters,
  getTableDataTypes
};
