import { BulkRepository } from '../repositories/bulk-repository';
import { Service } from './base-service';

export class BulkService implements Service {
  repository: BulkRepository;
  /**
   * Construct BulkService class.
   *
   * @param {CaptureRepository} repository - Repository dependency
   */
  constructor(repository: BulkRepository) {
    this.repository = repository;
  }

  /**
   * Instantiate BulkService and inject dependencies.
   *
   * @static
   * @returns {BulkService}
   */
  static init(): BulkService {
    return new BulkService(new BulkRepository());
  }
}
