import { Prisma } from "@prisma/client";
import {
  CritterUpdate,
  ICritter,
  CritterCreate,
} from "../schemas/critter-schema";
import { apiError } from "../utils/types";
import { Repository } from "./base-repository";

export class CritterRepository extends Repository {
  /**
   * Default critter properties, omitting audit columns.
   *
   */
  private critterProperties = {
    critter_id: true,
    itis_tsn: true,
    animal_id: true,
    sex: true,
    wlh_id: true,
    responsible_region_nr_id: true,
    critter_comment: true,
  };

  /**
   * Get all critters.
   *
   * @async
   * @throws {apiError.notFound} - if query returns no critters.
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getAllCritters(): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.notFound(`Failed to find critters.`, [
        "CritterRepository -> getAllCritters",
        "results had a length of 0",
      ]);
    }

    return result;
  }

  /**
   * Get multiple critters by critter ids.
   *
   * @async
   * @throws {apiError.notFound} - if query returns no critters.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getMultipleCrittersByIds(critter_ids: string[]): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      where: { critter_id: { in: critter_ids } },
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.notFound(`Failed to find critters.`, [
        `CritterRepository -> getMultipleCrittersByIds`,
        "results had a length of 0",
      ]);
    }

    return result;
  }

  /**
   * Get critter by critter id.
   *
   * @async
   * @throws {apiError.notFound} - if query returns no critter.
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getCritterById(critterId: string): Promise<ICritter> {
    const result = await this.prisma.critter.findUnique({
      where: { critter_id: critterId },
      select: this.critterProperties,
    });

    if (!result) {
      throw apiError.notFound(`Failed to find specific critter.`, [
        "CritterRepository -> getCritterById",
        "result was undefined",
      ]);
    }

    return result;
  }

  /**
   * Get critter by WLH id.
   * Note: It might seem weird to return array of critters, but it's known that
   * WLH id is not able to guarantee uniqueness.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - if query returns no critter.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getCrittersByWlhId(wlhId: string) {
    const result = await this.prisma.critter.findMany({
      where: { wlh_id: wlhId },
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.notFound(
        `Failed to find critters with wlh-id: ${wlhId}.`,
        ["CritterRepository -> getCritterByWlhId", "results had a length of 0"],
      );
    }

    return result;
  }

  /**
   * Update existing critter.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - if query was unable to update critter.
   * @returns {Promise<ICritter>} critter object.
   */
  async updateCritter(
    critterId: string,
    critterData: CritterUpdate,
  ): Promise<ICritter> {
    try {
      const result = await this.prisma.critter.update({
        where: {
          critter_id: critterId,
        },
        data: critterData,
        select: this.critterProperties,
      });

      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to update critter.`, [
        "CritterRepository -> updateCritter",
        "prisma threw error",
        err,
      ]);
    }
  }

  /**
   * Create a critter.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - if query was unable to create critter.
   * @returns {Promise<ICritter>} critter object.
   */
  async createCritter(critterData: CritterCreate): Promise<ICritter> {
    try {
      const result = await this.prisma.critter.create({
        data: critterData,
        select: this.critterProperties,
      });

      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to create critter.`, [
        "CritterRepository -> createCritter",
        "prisma threw error",
        err,
      ]);
    }
  }

  // TODO: Move these repository methods to individual repositories once built.
  // ie: CritterRepository.getCritterMarkings -> MarkingRepository.getCritterMarkings
  async getCritterMarkings(critterId: string) {
    const result = await this.prisma.$queryRaw`
      SELECT
        m.marking_id,
        m.capture_id,
        m.mortality_id,
        b.body_location,
        t.name as marking_type,
        mt.material,
        c1.colour as primary_colour,
        c2.colour as secondary_colour,
        c3.colour as text_colour,
        m.identifier,
        m.frequency_unit,
        m.order,
        m.removed_timestamp
      FROM marking m
      LEFT JOIN xref_taxon_marking_body_location b
        ON m.taxon_marking_body_location_id = b.taxon_marking_body_location_id
      LEFT JOIN lk_marking_type t
        ON t.marking_type_id = m.marking_type_id
      LEFT JOIN lk_marking_material mt
        ON mt.marking_material_id = m.marking_material_id
      LEFT JOIN lk_colour c1
        ON c1.colour_id = m.primary_colour_id
      LEFT JOIN lk_colour c2
        ON c2.colour_id = m.secondary_colour_id
      LEFT JOIN lk_colour c3
        ON c3.colour_id = m.text_colour_id
      WHERE m.critter_id = ${critterId}::uuid
  `;

    return result;
  }

  async getCritterCaptures(critterId: string) {
    const result = await this.prisma.$queryRaw`
    SELECT
      c.capture_id,
      c.capture_timestamp,
      json_agg(cl) as capture_location,
      json_agg(rl) as release_location,
      c.release_timestamp,
      c.capture_comment,
      c.release_comment
    FROM capture c
    LEFT JOIN location cl
      ON cl.location_id = c.capture_location_id
    LEFT JOIN location rl
      ON rl.location_id = c.release_location_id
    WHERE c.critter_id = ${critterId}::uuid
    GROUP BY c.capture_id;
    `;

    return result;
  }

  async getCritterMortalities(critterId: string) {
    const result = await this.prisma.mortality.findMany({
      where: { critter_id: critterId },
    });

    return result;
  }

  async getCritterQualitativeMeasurements(critterId: string) {
    const result = await this.prisma.measurement_qualitative.findMany({
      where: { critter_id: critterId },
    });

    return result;
  }

  async getCritterQuantitativeMeasurements(critterId: string) {
    const result = await this.prisma.measurement_qualitative.findMany({
      where: { critter_id: critterId },
    });

    return result;
  }
}
