import { Repository } from "../repositories/base-repository";

/**
 * Base class for Critterbase internal services.
 *
 * @export
 * @class Service
 * @template TRepo - Repository Class
 */
export class Service<T extends Repository> {
  repository: T;

  constructor(repository: T) {
    this.repository = repository;
  }
}
