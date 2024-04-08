import { Prisma } from '@prisma/client';
import type { mortality } from '@prisma/client';
import { MortalityCreate, MortalityUpdate } from '../schemas/mortality-schema';
import { apiError } from '../utils/types';
import { Repository } from './base-repository';
import { z } from 'zod';

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
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @returns {Promise<mortality | null>} Critter mortality or null.
   */
  async getMortalityById(mortality_id: string): Promise<mortality | null> {
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
        JOIN lk_cause_of_death d2 ON m.ultimate_cause_of_death_id = d2.cod_id
        JOIN location l ON m.location_id = l.location_id
        JOIN lk_region_env re ON re.region_env_id = l.region_env_id
        JOIN lk_region_nr rn ON rn.region_nr_id = l.region_nr_id
        JOIN lk_wildlife_management_unit rw ON rw.wmu_id = l.wmu_id
        JOIN lk_cause_of_death c1 ON c1.cod_id = m.proximate_cause_of_death_id
        JOIN lk_cause_of_death c2 ON c2.cod_id = m.ultimate_cause_of_death_id
        WHERE mortality_id = ${mortality_id}::uuid;`,
      z.array(z.unknown())
    );

    if (!data[0]) {
      throw apiError.notFound(`Failed to find specific mortality record.`, [
        `MortalityRepository -> getMortalityById`,
        'result was undefined'
      ]);
    }

    return data[0] as mortality;
  }

  async appendDefaultCOD(body: { proximate_cause_of_death_id?: string }) {
    const cod_res = await this.prisma.lk_cause_of_death.findFirstOrThrow({
      where: { cod_category: 'Unknown' }
    });
    if (!body.proximate_cause_of_death_id) {
      body.proximate_cause_of_death_id = cod_res.cod_id; //This is just a temp solution, ideally they should be forced to provide this.
    }
    return body;
  }

  /**
   * Get all mortality records by critter id.
   *
   * @async
   * @param {string} critter_id - Primary identifier of a critter.
   * @returns {Promise<mortality[]>} Critter mortalities.
   */
  async getMortalityByCritter(critter_id: string): Promise<mortality[]> {
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
        JOIN lk_cause_of_death d2 ON m.ultimate_cause_of_death_id = d2.cod_id
        JOIN location l ON m.location_id = l.location_id
        JOIN lk_region_env re ON re.region_env_id = l.region_env_id
        JOIN lk_region_nr rn ON rn.region_nr_id = l.region_nr_id
        JOIN lk_wildlife_management_unit rw ON rw.wmu_id = l.wmu_id
        JOIN lk_cause_of_death c1 ON c1.cod_id = m.proximate_cause_of_death_id
        JOIN lk_cause_of_death c2 ON c2.cod_id = m.ultimate_cause_of_death_id
        WHERE critter_id = ${critter_id}::uuid;`,
      z.array(z.unknown())
    );

    return data as mortality[];
  }

  /**
   * Create a critter mortality.
   *
   * @async
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
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @param {MortalityUpdate} mortality_data - Update payload.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async updateMortality(mortality_id: string, mortality_data: MortalityUpdate) {
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
   * Delete a critter mortality.
   *
   * @async
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async deleteMortality(mortality_id: string) {
    return this.transactionHandler(async () => {
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
    });
  }
}
