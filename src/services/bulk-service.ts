import { DBClient, DBTxClient } from '../client/client';
import { BulkRepository } from '../repositories/bulk-repository';
import { Service } from './base-service';

/**
 * Bulk Service
 * Handles multiple create / update / get actions for related Critter entities.
 *
 * @export
 * @class BulkService
 * @implements Service
 */
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
   * @param {DBTxClient | DBClient} client - Database client
   * @returns {BulkService}
   */
  static init(client: DBTxClient | DBClient): BulkService {
    return new BulkService(new BulkRepository(client));
  }
}
