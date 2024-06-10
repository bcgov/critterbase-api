import * as access from '../api/access/access.service';
import * as artifact from '../api/artifact/artifact.service';
import * as bulk from '../api/bulk/bulk.service';
import * as collectionUnit from '../api/collectionUnit/collectionUnit.service';
import * as family from '../api/family/family.service';
import * as lookup from '../api/lookup/lookup.service';
import * as marking from '../api/marking/marking.service';
import * as measurement from '../api/measurement/measurement.service';
import * as user from '../api/user/user.service';
import * as mortality from '../repositories/mortality-repository';
import { CaptureService } from '../services/capture-service';
import { CritterService } from '../services/critter-service';
import { ItisService } from '../services/itis-service';
import { MarkingService } from '../services/marking-service';
import { MortalityService } from '../services/mortality-service';
import { XrefService } from '../services/xref-service';

/**
 * Instantiating Services.
 *
 */
const itisService = new ItisService();

const critterService = CritterService.init();
const xrefService = XrefService.init();
const markingService = MarkingService.init();
const mortalityService = MortalityService.init();
const captureService = CaptureService.init();

export const db = {
  // Eventually these old services will be converted into the new format
  // OLD
  ...access,
  ...artifact,
  ...bulk,
  ...collectionUnit,
  ...family,
  ...lookup,
  ...marking,
  ...measurement,
  ...mortality,
  ...user,
  // NEW
  mortalityService,
  critterService,
  xrefService,
  markingService,
  captureService,
  itisService
};

export type ICbDatabase = typeof db;
