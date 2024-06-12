import * as access from '../api/access/access.service';
import * as artifact from '../api/artifact/artifact.service';
import * as bulk from '../api/bulk/bulk.service';
import * as capture from '../api/capture/capture.service';
import * as collectionUnit from '../api/collectionUnit/collectionUnit.service';
import * as family from '../api/family/family.service';
import * as location from '../api/location/location.service';
import * as lookup from '../api/lookup/lookup.service';
import * as measurement from '../api/measurement/measurement.service';
import { MortalityService } from '../services/mortality-service';
import { CritterService } from '../services/critter-service';
import { ItisService } from '../services/itis-service';
import { MarkingService } from '../services/marking-service';
import { XrefService } from '../services/xref-service';
import { UserService } from '../services/user-service';

/**
 * Data services
 *
 */
const critterService = CritterService.init();
const markingService = MarkingService.init();
const mortalityService = MortalityService.init();
const userService = UserService.init();
/**
 * Reference services
 *
 */
const xrefService = XrefService.init();
/**
 * External Services.
 *
 */
const itisService = new ItisService();

/**
 * Critterbase Services DB
 *
 */
export const db = {
  // Eventually these old services will be converted into the new format
  // OLD
  ...access,
  ...artifact,
  ...bulk,
  ...capture,
  ...collectionUnit,
  ...family,
  ...location,
  ...lookup,
  ...measurement,
  // NEW
  userService,
  mortalityService,
  critterService,
  xrefService,
  markingService,
  itisService
};

export type ICbDatabase = typeof db;
