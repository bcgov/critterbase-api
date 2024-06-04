import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  Capture,
  CaptureCreate,
  CaptureUpdate,
  DetailedCapture,
  DetailedCaptureSchema
} from '../schemas/capture-schema';
import { apiError } from '../utils/types';
import { Repository } from './base-repository';

/**
 * Capture Repository
 *
 * @export
 * @class CaptureRepository
 * @extends Repository
 */
export class CaptureRepository extends Repository {
  /**
   * Default capture properties, omitting audit columns.
   *
   */
  private _captureProperties = {
    capture_id: true,
    critter_id: true,
    capture_method_id: true,
    capture_location_id: true,
    release_location_id: true,
    capture_date: true,
    capture_time: true,
    release_date: true,
    release_time: true,
    capture_comment: true,
    release_comment: true
  };

  /**
   * Get a capture by id.
   *
   * @async
   * @param {string} captureId - Capture primary identifier
   * @throws {apiError.notFound} - If unable to find capture by id
   * @returns {Promise<DetailedCapture>} Detailed capture
   */
  async getCaptureById(captureId: string): Promise<DetailedCapture> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.capture_id,
          c.capture_method,
          c.capture_date,
          c.capture_time,
          c.release_date,
          c.release_time,
          c.capture_location_id,
          c.release_location_id,
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
      z.array(DetailedCaptureSchema)
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
   * @returns {Promise<DetailedCapture[]>} Detailed captures
   */
  async findCritterCaptures(critterId: string): Promise<DetailedCapture[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.capture_id,
          c.capture_method_id,
          c.capture_date,
          c.capture_time,
          c.release_date,
          c.release_time,
          c.capture_location_id,
          c.release_location_id,
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
      z.array(DetailedCaptureSchema)
    );

    return result;
  }

  /**
   * Create a capture.
   * If the release location is not included,
   * the DB trigger will populate release_location_id with capture_location_id.
   *
   * @async
   * @param {CaptureCreate} payload - Capture create payload
   * @returns {Promise<Capture>} Created capture
   */
  async createCapture(payload: CaptureCreate): Promise<Capture> {
    return this.prisma.capture.create({
      data: {
        capture_id: payload.capture_id,
        critter: { connect: { critter_id: payload.critter_id } },
        capture_method_id: payload.capture_method_id,
        capture_date: payload.capture_date,
        capture_time: payload.capture_time,
        release_date: payload.release_date,
        release_time: payload.release_time,
        capture_comment: payload.capture_comment,
        release_comment: payload.release_comment,
        location_capture_capture_location_idTolocation: { create: payload.capture_location },
        location_capture_release_location_idTolocation: { create: payload.release_location }
      },
      select: this._captureProperties
    });
  }

  /**
   * Update a capture.
   *
   * @async
   * @param {string} captureId - Capture primary identifier
   * @param {CaptureUpdate} payload - Capture update payload
   * @returns {Promise<Capture>} Updated capture
   */
  async updateCapture(captureId: string, payload: CaptureUpdate): Promise<Capture> {
    return this.prisma.capture.update({
      where: { capture_id: captureId },
      data: {
        capture_id: payload.capture_id,
        critter: { connect: { critter_id: payload.critter_id } },
        capture_date: payload.capture_date,
        capture_time: payload.capture_time,
        release_date: payload.release_date,
        release_time: payload.release_time,
        capture_comment: payload.capture_comment,
        release_comment: payload.release_comment,
        location_capture_capture_location_idTolocation: { create: payload.capture_location },
        location_capture_release_location_idTolocation: { create: payload.release_location }
      },
      select: this._captureProperties
    });
  }

  /**
   * Delete a capture and related locations.
   *
   * @async
   * @param {string} captureId - capture id
   * @returns {Promise<capture>} Deleted capture
   */
  async deleteCapture(captureId: string): Promise<Capture> {
    return this.transactionHandler(async () => {
      // Delete the capture + cascade location deletes
      const capture = await this.prisma.capture.delete({
        where: {
          capture_id: captureId
        },
        select: this._captureProperties
      });

      //if (capture.capture_location_id) {
      //  locationIdsSet.add(capture.capture_location_id);
      //}
      //
      //if (capture.release_location_id) {
      //  locationIdsSet.add(capture.release_location_id);
      //}

      // Delete the associated locations
      //await this.prisma.location.deleteMany({
      //  where: {
      //    location_id: { in: Array.from(locationIdsSet) }
      //  }
      //});

      return capture;
    });
  }
}
