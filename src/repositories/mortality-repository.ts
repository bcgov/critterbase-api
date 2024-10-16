import type { mortality } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DetailedCritterMortalitySchema, IDetailedCritterMortality } from '../schemas/critter-schema';
import {
  MortalityCreate,
  MortalityDetailed,
  MortalityDetailedSchema,
  MortalityUpdate
} from '../schemas/mortality-schema';
import { apiError } from '../utils/types';
import { Repository } from './base-repository';

const UNKNOWN_CAUSE_OF_DEATH = 'Unknown';

/**
 * Mortality Repository
 *
 * @extends Repository
 */
export class MortalityRepository extends Repository {
  /**
   * Get all mortality records in Critterbase.
   *
   * @async
   * @returns {Promise<mortality[]>} Critter mortality.
   */
  async getAllMortalities(): Promise<mortality[]> {
    return this.prisma.mortality.findMany();
  }

  /**
   * Get critter mortality by mortality id.
   *
   * @async
   * @throws {apiError.notFound} - Mortality not found.
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @returns {Promise<MortalityDetailed>} Critter mortality or null.
   */
  async getMortalityById(mortality_id: string): Promise<MortalityDetailed> {
    const data = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.*,
          json_build_object(
            'latitude', l.latitude,
            'longitude', l.longitude,
            'coordinate_uncertainty', l.coordinate_uncertainty,
            'temperature', l.temperature,
            'location_comment', l.location_comment,
            'region_env_id', l.region_env_id,
            'region_nr_id', l.region_nr_id,
            'wmu_id', l.wmu_id,
            'region_env_name', re.region_env_name,
            'region_nr_name', rn.region_nr_name,
            'wmu_name', rw.wmu_name
          ) as location,
        json_build_object(
          'cod_category', c1.cod_category,
          'cod_reason', c1.cod_reason
        ) as proximate_cause_of_death,
        json_build_object(
          'cod_category', c2.cod_category,
          'cod_reason', c2.cod_reason
        ) as ultimate_cause_of_death
        FROM mortality m
        JOIN lk_cause_of_death d1 ON m.proximate_cause_of_death_id = d1.cod_id
        LEFT JOIN lk_cause_of_death d2 ON m.ultimate_cause_of_death_id = d2.cod_id
        LEFT JOIN location l ON m.location_id = l.location_id
        LEFT JOIN lk_region_env re ON re.region_env_id = l.region_env_id
        LEFT JOIN lk_region_nr rn ON rn.region_nr_id = l.region_nr_id
        LEFT JOIN lk_wildlife_management_unit rw ON rw.wmu_id = l.wmu_id
        LEFT JOIN lk_cause_of_death c1 ON c1.cod_id = m.proximate_cause_of_death_id
        LEFT JOIN lk_cause_of_death c2 ON c2.cod_id = m.ultimate_cause_of_death_id
        WHERE mortality_id = ${mortality_id}::uuid;`,
      z.array(MortalityDetailedSchema)
    );

    if (!data[0]) {
      throw apiError.notFound(`Failed to find specific mortality record.`, [
        `MortalityRepository -> getMortalityById`,
        'result was undefined'
      ]);
    }

    return data[0];
  }

  /**
   * Get the default `cause of death (cod)` id.
   *
   * @async
   * @template T
   * @returns {Promise<string>} Default cause of death id
   */
  async getDefaultCauseOfDeathId(): Promise<string> {
    const response = await this.prisma.lk_cause_of_death.findFirstOrThrow({
      where: { cod_category: UNKNOWN_CAUSE_OF_DEATH }
    });

    return response.cod_id;
  }

  /**
   * Get all mortality records by critter id.
   *
   * @async
   * @param {string} critter_id - Primary identifier of a critter.
   * @returns {Promise<MortalityDetailed[]>} Critter mortalities.
   */
  async getMortalityByCritter(critter_id: string): Promise<MortalityDetailed[]> {
    const data = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.*,
          json_build_object(
            'latitude', l.latitude,
            'longitude', l.longitude,
            'coordinate_uncertainty', l.coordinate_uncertainty,
            'temperature', l.temperature,
            'location_comment', l.location_comment,
            'region_env_id', l.region_env_id,
            'region_nr_id', l.region_nr_id,
            'wmu_id', l.wmu_id,
            'region_env_name', re.region_env_name,
            'region_nr_name', rn.region_nr_name,
            'wmu_name', rw.wmu_name
          ) as location,
        json_build_object(
          'cod_category', c1.cod_category,
          'cod_reason', c1.cod_reason
        ) as proximate_cause_of_death,
        json_build_object(
          'cod_category', c2.cod_category,
          'cod_reason', c2.cod_reason
        ) as ultimate_cause_of_death
        FROM mortality m
        JOIN lk_cause_of_death d1 ON m.proximate_cause_of_death_id = d1.cod_id
        LEFT JOIN lk_cause_of_death d2 ON m.ultimate_cause_of_death_id = d2.cod_id
        LEFT JOIN location l ON m.location_id = l.location_id
        LEFT JOIN lk_region_env re ON re.region_env_id = l.region_env_id
        LEFT JOIN lk_region_nr rn ON rn.region_nr_id = l.region_nr_id
        LEFT JOIN lk_wildlife_management_unit rw ON rw.wmu_id = l.wmu_id
        LEFT JOIN lk_cause_of_death c1 ON c1.cod_id = m.proximate_cause_of_death_id
        LEFT JOIN lk_cause_of_death c2 ON c2.cod_id = m.ultimate_cause_of_death_id
        WHERE critter_id = ${critter_id}::uuid;`,
      z.array(MortalityDetailedSchema)
    );

    return data;
  }

  /**
   * Create a critter mortality.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - Failed to create mortality.
   * @param {MortalityCreate} mortality_data - Create payload.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async createMortality(mortality_data: MortalityCreate): Promise<mortality> {
    const { critter_id, location_id, location, proximate_cause_of_death_id, ultimate_cause_of_death_id, ...rest } =
      mortality_data;

    try {
      const result = this.prisma.mortality.create({
        data: {
          critter: { connect: { critter_id } },
          location: location_id
            ? {
                connect: { location_id: location_id }
              }
            : location
              ? { create: location }
              : undefined,
          lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: {
            connect: { cod_id: proximate_cause_of_death_id }
          },
          lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: ultimate_cause_of_death_id
            ? { connect: { cod_id: ultimate_cause_of_death_id } }
            : undefined,
          ...rest
        }
      });

      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to create mortality record.`, [
        `MortalityRepository`,
        `prisma threw error`,
        err
      ]);
    }
  }

  /**
   * Update a critter mortality.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - Failed to update mortality.
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @param {MortalityUpdate} mortality_data - Update payload.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async updateMortality(mortality_id: string, mortality_data: MortalityUpdate): Promise<mortality> {
    const { location, location_id, critter_id, proximate_cause_of_death_id, ultimate_cause_of_death_id, ...rest } =
      mortality_data;
    const upsertBody = { create: {}, update: {} };
    if (location) {
      const { location_id, ...others } = location;
      upsertBody.create = { ...others };
      upsertBody.update = { location_id, ...others };
    }
    try {
      const result = await this.prisma.mortality.update({
        where: { mortality_id: mortality_id },
        data: {
          location: {
            upsert: upsertBody
          },
          lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: {
            connect: proximate_cause_of_death_id ? { cod_id: proximate_cause_of_death_id } : undefined
          },
          lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: {
            connect: ultimate_cause_of_death_id ? { cod_id: ultimate_cause_of_death_id } : undefined
          },
          ...rest
        }
      });
      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to update mortality record.`, [
        `MortalityRepository`,
        `prisma threw error`,
        err
      ]);
    }
  }

  /**
   * Delete a critter mortality and location as a transaction.
   *
   * @async
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async deleteMortality(mortality_id: string): Promise<mortality> {
    const mortality = await this.prisma.mortality.delete({
      where: {
        mortality_id: mortality_id
      }
    });

    if (mortality.location_id) {
      await this.prisma.location.delete({
        where: {
          location_id: mortality.location_id
        }
      });
    }

    return mortality;
  }

  /**
   * Find a critter's mortality(s).
   * Business rules allow critters to have multiple mortalities.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterMortality[]>} mortalities.
   */
  async findCritterMortalities(critterId: string): Promise<IDetailedCritterMortality[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.mortality_id,
          m.mortality_timestamp,
          row_to_json(ml) as location,
          m.proximate_cause_of_death_id,
          m.proximate_cause_of_death_confidence,
          m.ultimate_cause_of_death_id,
          m.ultimate_cause_of_death_confidence,
          m.mortality_comment,
          m.proximate_predated_by_itis_tsn,
          m.ultimate_predated_by_itis_tsn
        FROM mortality m
        JOIN (
          SELECT
            l.location_id, l.latitude, l.longitude, l.coordinate_uncertainty,
            l.region_env_id, l.region_nr_id, l.wmu_id,
            e.region_env_name, n.region_nr_name, w.wmu_name,
            l.coordinate_uncertainty_unit, l.elevation, l.temperature, l.location_comment
          FROM location l
          LEFT JOIN lk_region_env e ON e.region_env_id = l.region_env_id
          LEFT JOIN lk_region_nr n ON n.region_nr_id = l.region_nr_id
          LEFT JOIN lk_wildlife_management_unit w ON w.wmu_id = l.wmu_id
        ) as ml
          ON ml.location_id = m.location_id
        LEFT JOIN lk_cause_of_death pd
          ON m.proximate_cause_of_death_id = pd.cod_id
        LEFT JOIN lk_cause_of_death ud
          ON m.proximate_cause_of_death_id = ud.cod_id
        WHERE m.critter_id = ${critterId}::uuid
        GROUP BY m.mortality_id, pd.cod_category, ud.cod_category, pd.cod_reason, ud.cod_reason, ml.*;`,
      z.array(DetailedCritterMortalitySchema)
    );

    return result;
  }
}
