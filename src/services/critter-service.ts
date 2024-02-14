import { Prisma, critter, mortality } from "@prisma/client";
import { defaultFormat, oneDay, prisma } from "../utils/constants";
import {
  UniqueCritterQuery,
  critterFormats,
} from "../api/critter/critter.utils"; //TODO: remove utils here
import { intersect } from "../utils/helper_functions";
import { LocationResponse } from "../api/location/location.utils";
import { CritterRepository } from "../repositories/critter-repository";
import { Service } from "./base-service";
import { apiError, QueryFormats } from "../utils/types";
import { CritterCreate, CritterUpdate } from "../schemas/critter-schema";
import { ItisWebService } from "./itis-service";

export class CritterService extends Service<CritterRepository> {
  serviceFactory: { itisService: ItisWebService };

  constructor(
    repository = new CritterRepository(),
    serviceFactory = { itisService: new ItisWebService() },
  ) {
    super(repository);
    this.serviceFactory = serviceFactory;
  }

  /**
   * Get all critters.
   *
   * @async
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getAllCritters() {
    return this.repository.getAllCritters();
  }

  /**
   * Get multiple critters by critter ids.
   *
   * @async
   * @param {string[]} critterIds - array of critter ids.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getMultipleCrittersByIds(critterIds: string[]) {
    return this.repository.getMultipleCrittersByIds(critterIds);
  }

  /**
   * Get critter by critter id.
   *
   * @async
   * @param {string} critterId - critter id.
   * @param {QueryFormats} format - additional response format (supports detailed).
   * @returns {Promise<ICritter | ICritterDetailed>} critter object.
   */
  async getCritterById(critterId: string, format = defaultFormat) {
    if (format === QueryFormats.detailed) {
      const critter = await this.repository.getCritterById(critterId);
      const markings = await this.repository.getCritterMarkings(critterId);
      const captures = await this.repository.getCritterCaptures(critterId);
      const qualitative =
        await this.repository.getCritterQualitativeMeasurements(critterId);
      const quantitative =
        await this.repository.getCritterQuantitativeMeasurements(critterId);

      return {
        ...critter,
        markings,
        captures,
        measurements: { qualitative, quantitative },
      };
    }
    return this.repository.getCritterById(critterId);
  }

  /**
   * Get critter by WLH id.
   * Note: It might seem weird to return array of critters, but it's known that
   * WLH id is not able to guarantee uniqueness.
   *
   * @async
   * @param {string} wlhId - wildlife health id.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getCrittersByWlhId(wlhId: string) {
    return this.repository.getCrittersByWlhId(wlhId);
  }

  /**
   * Get all critters or critters with matching WLH id.
   *
   * @async
   * @param {string} [wlhId] - wildlife health id.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getAllCrittersOrCrittersWithWlhId(wlhId?: string) {
    if (wlhId) {
      return this.repository.getCrittersByWlhId(wlhId);
    }
    return this.repository.getAllCritters();
  }

  /**
   * Update existing critter.
   *
   * @async
   * @param {string} critterId - critter id.
   * @param {CritterUpdate} critterData - critter update payload.
   * @returns {Promise<ICritter>} critter object.
   */
  async updateCritter(critterId: string, critterData: CritterUpdate) {
    return this.repository.updateCritter(critterId, critterData);
  }

  /**
   * Create a critter.
   * Note: ... TODO: update with new ITIS flow.
   *
   * @async
   * @param {CritterCreate} critterData - create critter payload.
   * @throws {apiError.notFound} - when invalid tsn.
   * @returns {Promise<ICritter>} critter object.
   */
  async createCritter(critterData: CritterCreate) {
    if (critterData.itis_tsn) {
      const isTsn = await this.serviceFactory.itisService.isValueTsn(
        critterData.itis_tsn,
      );

      if (!isTsn) {
        throw apiError.notFound(`Invalid ITIS TSN: ${critterData.itis_tsn}`, [
          "CritterService -> createCritter",
          "ITIS has no reference to this TSN",
        ]);
      }
    }

    if (critterData.itis_scientific_name) {
      const foundTsn =
        await this.serviceFactory.itisService.getTsnFromScientificName(
          critterData.itis_scientific_name,
        );

      if (!foundTsn) {
        throw apiError.notFound(
          `Unable to translate scientific name to ITIS TSN`,
          [
            "CritterService -> createCritter",
            `getTsnFromScientificName(${critterData.itis_scientific_name}) returned undefined`,
          ],
        );
      }

      return this.repository.createCritter({
        ...critterData,
        itis_tsn: foundTsn,
      });
    }

    return this.repository.createCritter(critterData);
  }
}

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
  getSimilarCritters,
  appendEnglishTaxonAsUUID,
  formatLocationNameSearch,
};
