import * as access from "../api/access/access.service";
import * as artifact from "../api/artifact/artifact.service";
import * as bulk from "../api/bulk/bulk.service";
import * as capture from "../api/capture/capture.service";
import * as collectionUnit from "../api/collectionUnit/collectionUnit.service";
import { CritterService } from "../api/critter/critter.service";
import * as family from "../api/family/family.service";
import * as location from "../api/location/location.service";
import * as lookup from "../api/lookup/lookup.service";
import * as marking from "../api/marking/marking.service";
import * as measurement from "../api/measurement/measurement.service";
import * as mortality from "../api/mortality/mortality.service";
import * as user from "../api/user/user.service";
import { XrefService } from "../api/xref/xref.service";

export type ICbDatabase = typeof db;

export const db = {
  CritterService,
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
  XrefService,
};
