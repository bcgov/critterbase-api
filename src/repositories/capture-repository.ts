import { Prisma } from '@prisma/client';
import { Capture, CaptureCreate, CaptureUpdate, DetailedCapture } from '../schemas/capture-schema';
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
   * Prisma capture properties, omitting audit columns.
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
   * Prisma location properties, omitting audit columns.
   *
   */
  private _captureLocationProperties = {
    location_id: true,
    latitude: true,
    longitude: true,
    coordinate_uncertainty: true,
    coordinate_uncertainty_unit: true,
    elevation: true,
    temperature: true,
    region_env_id: true,
    region_nr_id: true,
    wmu_id: true,
    location_comment: true
  };

  /**
   * Get a capture by id with location details.
   *
   * @async
   * @param {string} captureId - Capture primary identifier
   * @throws {apiError.notFound} - If unable to find capture by id
   * @returns {Promise<DetailedCapture>} Detailed capture
   */
  async getCaptureById(captureId: string): Promise<DetailedCapture> {
    const result = await this.prisma.capture.findUniqueOrThrow({
      where: {
        capture_id: captureId
      },
      select: {
        ...this._captureProperties,
        capture_location_id: false,
        release_location_id: false,
        capture_location: { select: this._captureLocationProperties },
        release_location: { select: this._captureLocationProperties }
      }
    });

    return result;
  }

  /**
   * Find all captures of a critter with location details.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<DetailedCapture[]>} Detailed captures
   */
  async findCritterCaptures(critterId: string): Promise<DetailedCapture[]> {
    const result = await this.prisma.capture.findMany({
      where: {
        critter_id: critterId
      },
      select: {
        ...this._captureProperties,
        capture_location_id: false,
        release_location_id: false,
        capture_location: { select: this._captureLocationProperties },
        release_location: { select: this._captureLocationProperties }
      }
    });

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
        capture_date: payload.capture_date,
        capture_time: payload.capture_time,
        release_date: payload.release_date,
        release_time: payload.release_time,
        capture_comment: payload.capture_comment,
        release_comment: payload.release_comment,
        critter: { connect: { critter_id: payload.critter_id } },
        // if the capture_method is included: connect to capture
        capture_method: payload.capture_method_id
          ? { connect: { capture_method_id: payload.capture_method_id } }
          : undefined,
        // if the capture_location included: create
        capture_location: payload.capture_location && { create: payload.capture_location },
        // if the release_location included: create
        release_location: payload.release_location && { create: payload.release_location }
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
    let releaseLocationUpsert;

    // Get the current capture record to compare location ids for upsert
    const capture = await this.getCaptureById(captureId);

    if (payload.release_location) {
      /**
       * If release and capture are referencing the same location id -> create release location
       * Why: The release location id is updated to the capture location id if no release details
       * are provided on creation.
       */
      if (capture?.capture_location?.location_id === capture?.release_location?.location_id) {
        releaseLocationUpsert = { create: payload.release_location };
        // If release and capture are referencing different location ids -> update existing release location
      } else {
        releaseLocationUpsert = {
          update: { ...payload.release_location, location_id: capture?.release_location?.location_id }
        };
      }
    }

    return this.prisma.capture.update({
      where: { capture_id: captureId },
      data: {
        capture_date: payload.capture_date,
        capture_time: payload.capture_time,
        release_date: payload.release_date,
        release_time: payload.release_time,
        capture_comment: payload.capture_comment,
        release_comment: payload.release_comment,
        /**
         * connect the capture to the critter
         * Note: Would a capture ever be updated to a different critter?
         */
        critter: payload.critter_id ? { connect: { critter_id: payload.critter_id } } : undefined,
        // if the capture_method_id exists connect to the capture record
        capture_method: payload.capture_method_id
          ? { connect: { capture_method_id: payload.capture_method_id } }
          : undefined,
        // if the capture location included: upsert
        capture_location: payload.capture_location && {
          upsert: {
            create: payload.capture_location,
            update: { ...payload.capture_location, location_id: capture.capture_location?.location_id }
          }
        },
        // if the release location included: upsert
        release_location: releaseLocationUpsert
      },
      select: this._captureProperties
    });
  }

  /**
   * Delete capture and related locations.
   * Locations are deleted via database `Cascade`.
   *
   * @async
   * @param {string} captureId - capture ids
   * @returns {Promise<Prisma.BatchPayload>} Deleted capture
   */
  async deleteCapture(captureId: string): Promise<Capture> {
    return this.prisma.capture.delete({ where: { capture_id: captureId }, select: this._captureProperties });
  }

  /**
   * Delete captures and related locations.
   * Locations are deleted via database `Cascade`.
   *
   * @async
   * @param {string} captureIds - capture ids
   * @returns {Promise<Prisma.BatchPayload>} Deleted captures count
   */
  async deleteMultipleCaptures(captureIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.capture.deleteMany({ where: { capture_id: { in: captureIds } } });
  }
}
