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
   * @throws {apiError.sqlIssue} - if query returns no critters.
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getAllCritters(): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.sqlIssue(`Failed to get critters.`, [
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
   * @throws {apiError.sqlIssue} - if query returns no critters.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getMultipleCrittersByIds(critter_ids: string[]): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      where: { critter_id: { in: critter_ids } },
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.sqlIssue(`Failed to find critters.`, [
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
   * @throws {apiError.sqlIssue} - if query returns no critter.
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getCritterById(critterId: string): Promise<ICritter> {
    const result = await this.prisma.critter.findUnique({
      where: { critter_id: critterId },
      select: this.critterProperties,
    });

    if (!result) {
      throw apiError.sqlIssue(`Failed to find specific critter.`, [
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
   * @throws {apiError.sqlIssue} - if query returns no critter.
   * @returns {Promise<ICritterDetailed>} detailed critter object.
   */
  async detailed_getCritterById(critterId: string) {
    return this.prisma.critter.findUniqueOrThrow({
      where: { critter_id: critterId },
    });
  }

  /**
   * Get critter by WLH id.
   * Note: It might seem weird to return array of critters, but it's known that
   * WLH id is not able to guarantee uniqueness.
   *
   * @async
   * @throws {apiError.sqlIssue} - if query returns no critter.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getCrittersByWlhId(wlhId: string) {
    const result = await this.prisma.critter.findMany({
      where: { wlh_id: wlhId },
    });

    if (!result.length) {
      throw apiError.sqlIssue(
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
   * @throws {apiError.sqlIssue} - if query was unable to update critter.
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
      throw apiError.sqlIssue(`Failed to update critter.`, [
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
   * @throws {apiError.sqlIssue} - if query was unable to create critter.
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
      throw apiError.sqlIssue(`Failed to create critter.`, [
        "CritterRepository -> createCritter",
        "prisma threw error",
        err,
      ]);
    }
  }
}
