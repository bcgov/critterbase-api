import { Repository } from '../repositories/base-repository';

/**
 * Base class for Critterbase internal services.
 *
 * This class should be implemented (not extended) by the children classes.
 * Implementing provides a cleaner constructor on the child class and prevents
 * generic types from being needed on the repository dependency.
 *
 * @export
 * @class Service
 * @template TRepo - Repository Class.
 */
export class Service {
  repository: Repository;

  /**
   * Construct Service class.
   *
   * @param {Repository} repository - Repository dependency.
   */
  constructor(repository: Repository) {
    this.repository = repository;
  }
}

/**
 * Base class for external services. ie: Itis / Biohub
 *
 * @export
 * @class ExternalService
 */
export class ExternalService {
  externalServiceUrl: string;

  /**
   * Construct ExternalService class.
   *
   * @param {string} externalServiceUrl - Base url of external service.
   */
  constructor(externalServiceUrl: string) {
    this.externalServiceUrl = externalServiceUrl;
  }
}
