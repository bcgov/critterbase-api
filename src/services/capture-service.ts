import { CaptureRepository } from '../repositories/capture-repository';
import { Capture, CaptureCreate, CaptureUpdate, DetailedCapture } from '../schemas/capture-schema';
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

  /**
   * Get a capture by id.
   *
   * @async
   * @param {string} captureId - Capture primary identifier
   * @returns {Promise<DetailedCapture>} Detailed capture
   */
  async getCaptureById(captureId: string): Promise<DetailedCapture> {
    return this.repository.getCaptureById(captureId);
  }

  /**
   * Find all captures of a critter.
   *
   * @async
   * @param {string} critterId - Critter primary identifier
   * @returns {Promise<IDetailedCritterCapture[]>} Captures
   */
  async findCritterCaptures(critterId: string): Promise<DetailedCapture[]> {
    return this.repository.findCritterCaptures(critterId);
  }

  /**
   * Create a capture.
   *
   * @async
   * @param {CaptureCreate} payload - Capture create payload
   * @returns {Promise<>} Created capture
   */
  async createCapture(payload: CaptureCreate): Promise<Capture> {
    return this.repository.createCapture(payload);
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
    return this.repository.updateCapture(captureId, payload);
  }

  /**
   * Delete a capture and related locations.
   *
   * @async
   * @param {string} captureId - capture primary id
   * @returns {Promise<capture>} Deleted capture
   */
  async deleteCapture(captureId: string): Promise<Capture> {
    return this.repository.deleteCapture(captureId);
  }
}
