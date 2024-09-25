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
import { MortalityService } from '../services/mortality-service';
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
  services: {
    CritterService,
    MortalityService,
    XrefService,
    MarkingService,
    CaptureService,
    UserService,
    BulkService
  },
  /**
   * NOTE: This is backwards compatibility for the old services structure.
   * Eventually these will be removed and only exist in the above `services` object.
   * This will include changes in all of the endpoints that use these services.
   */
  critterService: CritterService.init(client),
  mortalityService: MortalityService.init(client),
  xrefService: XrefService.init(client),
  markingService: MarkingService.init(client),
  itisService: new ItisService(),
  //captureService: CaptureService.init(client),
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
