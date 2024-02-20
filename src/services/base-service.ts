import { Repository } from "../repositories/base-repository";

/**
 * Base class for Critterbase internal services.
 *
 * @export
 * @class Service
 * @template TRepo - Repository Class
 */
export class InternalService<T extends Repository> {
  repository: T;

  constructor(repository: T) {
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

  constructor(externalServiceUrl: string) {
    this.externalServiceUrl = externalServiceUrl;
  }
}
