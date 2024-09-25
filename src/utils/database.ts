import * as access from '../api/access/access.service';
import * as artifact from '../api/artifact/artifact.service';
import * as bulk from '../api/bulk/bulk.service';
import * as collectionUnit from '../api/collectionUnit/collectionUnit.service';
import * as family from '../api/family/family.service';
import * as lookup from '../api/lookup/lookup.service';
import * as marking from '../api/marking/marking.service';
import * as measurement from '../api/measurement/measurement.service';
import { getDBClient, transaction } from '../client/client';
import { BulkService } from '../services/bulk-service';
import { CaptureService } from '../services/capture-service';
import { CritterService } from '../services/critter-service';
import { ItisService } from '../services/itis-service';
import { MarkingService } from '../services/marking-service';
import { UserService } from '../services/user-service';
import { XrefService } from '../services/xref-service';
import { getContext } from './context';

const client = getDBClient();

/**
 * Critterbase Data Layer
 *
 */
export const db = {
  getDBClient: getDBClient,
  getContext: getContext,
  transaction: transaction,
  /**
   * NOTE: Eventually all services should exist in the `services` object below.
   * Temporarily, services exist in the `db` object for backwards compatibility.
   *
   * ie: db.userService.getUser() -> db.UserService.init(client).getUser();
   */
  services: {
    UserService,
    BulkService
  },
  /**
   * TODO: Move the classes below into the `services` object above.
   * Also, restructure existing endpoints to use init() method syntax.
   */
  critterService: CritterService.init(client),
  xrefService: XrefService.init(client),
  markingService: MarkingService.init(client),
  itisService: new ItisService(),
  captureService: CaptureService.init(client),
  // OLD
  ...access,
  ...artifact,
  ...bulk,
  ...collectionUnit,
  ...family,
  ...lookup,
  ...measurement,
  ...marking
};

export type ICbDatabase = typeof db;
