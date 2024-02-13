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

  _getDetailedCritterSql(critterId: string) {
    return Prisma.sql`
      SELECT
        c.critter_id, c.itis_tsn, c.animal_id, c.sex,
        c.wlh_id, c.responsible_region_nr_id, c.critter_comment,

        coalesce(json_agg(json_build_object(
          'marking_id', mark.marking_id,
          'capture_id', mark.capture_id,
          'mortality_id', mark.mortality_id,
          'taxon_marking_body_location_id', mark.taxon_marking_body_location_id,
          'marking_type_id', mark.marking_type_id
        )) FILTER (WHERE mark.critter_id IS NOT NULL), '[]') as markings,
        coalesce(json_agg(cap) FILTER (WHERE cap.critter_id IS NOT NULL), '[]') as captures,
        coalesce(json_agg(mor) FILTER (WHERE mor.critter_id IS NOT NULL), '[]') as mortality,
        coalesce(json_agg(qual) FILTER (WHERE qual.critter_id IS NOT NULL), '[]') as qualitative_measurements,
        coalesce(json_agg(quant) FILTER (WHERE quant.critter_id IS NOT NULL), '[]') as quantitative_measurements

      FROM critter c
      LEFT JOIN marking mark ON mark.critter_id = c.critter_id
      LEFT JOIN capture cap ON cap.critter_id = c.critter_id
      LEFT JOIN mortality mor ON mor.critter_id = c.critter_id
      LEFT JOIN measurement_qualitative qual ON qual.critter_id = c.critter_id
      LEFT JOIN measurement_quantitative quant ON quant.critter_id = c.critter_id
      WHERE c.critter_id = ${critterId}::uuid
      GROUP BY c.critter_id;`;
  }

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
   * TODO: create full detailed response
   * Get 'detailed' critter by critter id.
   *
   * @async
   * @throws {apiError.notFound} - if query returns no critter.
   * @returns {Promise<ICritterDetailed>} detailed critter object.
   */
  async detailed_getCritterById(critterId: string) {
    const result = await this.prisma.$queryRaw(
      this._getDetailedCritterSql(critterId),
    );

    if (!result) {
      throw apiError.notFound(`Failed to find critters.`, [
        "CritterRepository -> detailed_getCritterById",
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
}
