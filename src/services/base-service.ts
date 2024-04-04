import { Repository } from '../repositories/base-repository';
import { ItisService } from './itis-service';

export interface IBaseServices {
  itisService: ItisService;
}

/**
 * Base class for Critterbase internal services.
 *
 * @export
 * @class Service
 * @template TRepo - Repository Class.
 */
export class Service<TRepo extends Repository> {
  repository: TRepo;

  constructor(repository: TRepo) {
    this.repository = repository;
  }
}

/**
 * Base class for Critterbase internal services with additional services as dependencies.
 *
 * @template TRepo - Repository Class.
 * @template TServices - Services.
 * @extends Service
 */
export class ServiceHandler<TRepo extends Repository, TServices> extends Service<TRepo> {
  services: TServices;

  constructor(repository: TRepo, services: TServices) {
    super(repository);
    this.services = services;
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
