import { capture } from '@prisma/client';
import { CaptureUpdate } from '../api/capture/capture.utils';
import { CaptureRepository } from '../repositories/capture-repository';
import { CaptureCreate } from '../schemas/capture-schema';
import { IDetailedCritterCapture } from '../schemas/critter-schema';
import { Service } from './base-service';

/**
 * Marking Service
 *
 * @export
 * @class CaptureService
 * @implements Service
 */
export class CaptureService implements Service {
  repository: CaptureRepository;

  /**
   * Construct CaptureService class.
   *
   * @param {CaptureRepository} repository - Repository dependency
   */
  constructor(repository: CaptureRepository) {
    this.repository = repository;
  }

  /**
   * Instantiate CaptureService and inject dependencies.
   *
   * @static
   * @returns {MarkingService}
   */
  static init(): CaptureService {
    return new CaptureService(new CaptureRepository());
  }

  async getCaptureById(captureId: string) {
    return this.repository.getCaptureById(captureId);
  }

  /**
   * Find all captures of a critter.
   *
   * @async
   * @param {string} critterId - Critter primary identifier
   * @returns {Promise<IDetailedCritterCapture[]>} captures
   */
  async findCritterCaptures(critterId: string): Promise<IDetailedCritterCapture[]> {
    return this.repository.findCritterCaptures(critterId);
  }

  /**
   * Create a capture
   *
   * @async
   * @param {CaptureCreate} payload - [TODO:description]
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async createCapture(payload: CaptureCreate) {
    return this.repository.createCapture(payload);
  }

  /**
   * Update a capture
   *
   * @async
   * @param {string} captureId - Capture primary identifier
   * @param {CaptureUpdate} payload - Capture update payload
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async updateCapture(captureId: string, payload: CaptureUpdate) {
    return this.repository.updateCapture(captureId, payload);
  }

  /**
   * Delete a capture and related locations.
   *
   * @async
   * @param {string} captureId - capture primary id
   * @returns {Promise<capture>}
   */
  async deleteCapture(captureId: string): Promise<capture> {
    return this.repository.deleteCapture(captureId);
  }
}
