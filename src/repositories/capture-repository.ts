import { Prisma, capture } from '@prisma/client';
import { z } from 'zod';
import { CaptureUpdate } from '../api/capture/capture.utils';
import { CaptureCreate } from '../schemas/capture-schema';
import { DetailedCritterCaptureSchema, IDetailedCritterCapture } from '../schemas/critter-schema';
import { apiError } from '../utils/types';
import { Repository } from './base-repository';

export class CaptureRepository extends Repository {
  /**
   * Get a capture by id.
   *
   * @async
   * @param {string} captureId - Capture primary identifier
   * @throws {apiError.notFound} - If unable to find capture by id
   * @returns {Promise<IDetailedCritterCapture>} Detailed critter capture
   */
  async getCaptureById(captureId: string): Promise<IDetailedCritterCapture> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.capture_id,
          c.capture_timestamp,
          c.release_timestamp,
          row_to_json(cl) as capture_location,
          row_to_json(rl) as release_location,
          c.capture_comment,
          c.release_comment
        FROM capture c
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
        ) as cl
          ON cl.location_id = c.capture_location_id
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
        ) as rl
          ON rl.location_id = c.release_location_id
        WHERE c.capture_id = ${captureId}::uuid
        GROUP BY c.capture_id, cl.*, rl.*;`,
      z.array(DetailedCritterCaptureSchema)
    );

    if (!result.length) {
      throw apiError.notFound(`Failed to find capture`, [
        'CaptureRespository -> getCaptureById',
        'results had a length of 0'
      ]);
    }

    return result[0];
  }
  /**
   * Find all captures of a critter.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterCapture[]>} captures.
   */
  async findCritterCaptures(critterId: string): Promise<IDetailedCritterCapture[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.capture_id,
          c.capture_timestamp,
          c.release_timestamp,
          row_to_json(cl) as capture_location,
          row_to_json(rl) as release_location,
          c.capture_comment,
          c.release_comment
        FROM capture c
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
        ) as cl
          ON cl.location_id = c.capture_location_id
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
        ) as rl
          ON rl.location_id = c.release_location_id
        WHERE c.critter_id = ${critterId}::uuid
        GROUP BY c.capture_id, cl.*, rl.*;`,
      z.array(DetailedCritterCaptureSchema)
    );

    return result;
  }

  async createCapture(payload: CaptureCreate) {
    return this.prisma.capture.create({
      data: {
        capture_id: payload.capture_id,
        critter: { connect: { critter_id: payload.critter_id } },
        capture_timestamp: payload.capture_timestamp,
        release_timestamp: payload.release_timestamp,
        capture_comment: payload.capture_comment,
        release_comment: payload.release_comment,
        location_capture_capture_location_idTolocation: { create: payload.capture_location },
        // if the release location exists create it - otherwise db trigger will use capture_location_id
        location_capture_release_location_idTolocation: payload.release_location
          ? { create: payload.release_location }
          : undefined
      }
    });
  }

  async updateCapture(captureId: string, payload: CaptureUpdate) {
    return this.prisma.capture.update({
      where: { capture_id: captureId },
      data: {}
    });
  }

  /**
   * Delete a capture and related locations.
   *
   * @async
   * @param {string} captureId - capture id
   * @returns {Promise<capture>}
   */
  async deleteCapture(captureId: string): Promise<capture> {
    return this.transactionHandler(async () => {
      const locationIdsSet: Set<string> = new Set();

      const capture = await this.prisma.capture.delete({
        where: {
          capture_id: captureId
        }
      });

      if (capture.capture_location_id) {
        locationIdsSet.add(capture.capture_location_id);
      }

      if (capture.release_location_id) {
        locationIdsSet.add(capture.release_location_id);
      }

      await this.prisma.location.deleteMany({
        where: {
          location_id: { in: Array.from(locationIdsSet) }
        }
      });

      return capture;
    });
  }
}
