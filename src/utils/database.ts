import * as access from '../api/access/access.service';
import * as artifact from '../api/artifact/artifact.service';
import * as bulk from '../api/bulk/bulk.service';
import * as capture from '../api/capture/capture.service';
import * as collectionUnit from '../api/collectionUnit/collectionUnit.service';
import * as family from '../api/family/family.service';
import * as location from '../api/location/location.service';
import * as lookup from '../api/lookup/lookup.service';
import * as marking from '../api/marking/marking.service';
import * as measurement from '../api/measurement/measurement.service';
import * as mortality from '../api/mortality/mortality.service';
import * as user from '../api/user/user.service';
import { CritterRepository } from '../repositories/critter-repository';
import { MarkingRepository } from '../repositories/marking-repository';
import { XrefRepository } from '../repositories/xref-repository';
import { CritterService } from '../services/critter-service';
import { ItisService } from '../services/itis-service';
import { MarkingService } from '../services/marking-service';
import { XrefService } from '../services/xref-service';

/**
 * Instantiating Services
 *
 */

const itisService = new ItisService();

const critterService = new CritterService(new CritterRepository(), itisService);

const xrefService = new XrefService(new XrefRepository(), itisService);

const markingService = new MarkingService(new MarkingRepository(), itisService);

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
  ...marking,
  ...measurement,
  ...mortality,
  ...user,
  // NEW
  critterService,
  xrefService,
  markingService,
  itisService
};

export type ICbDatabase = typeof db;
