import { Repository } from '../repositories/base-repository';
import { ItisService } from './itis-service';

/**
 * Base class for Critterbase internal services.
 *
 * @export
 * @class Service
 * @template TRepo - Repository Class
 */
export class InternalService<T extends Repository> {
  repository: T;
  itisService: ItisService;

  constructor(repository: T, itisService: ItisService) {
    this.repository = repository;
    this.itisService = itisService;
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
