import cors from "cors";
import express from "express";
import helmet from "helmet";
import { AccessRouter } from "./api/access/access.router";
import { ArtifactRouter } from "./api/artifact/artifact.router";
import { BulkRouter } from "./api/bulk/bulk.router";
import { CaptureRouter } from "./api/capture/capture.router";
import { CollectionUnitRouter } from "./api/collectionUnit/collectionUnit.router";
import { CritterRouter } from "./api/critter/critter.router";
import { FamilyRouter } from "./api/family/family.router";
import { LocationRouter } from "./api/location/location.router";
import { MarkingRouter } from "./api/marking/marking.router";
import { MeasurementRouter } from "./api/measurement/measurement.router";
import { MortalityRouter } from "./api/mortality/mortality.router";
import { LookupRouter } from "./api/lookup/lookup.router";
import { UserRouter } from "./api/user/user.router";
import { XrefRouter } from "./api/xref/xref.router";
import { ICbDatabase } from "./utils/database";
import { auth, errorHandler, errorLogger } from "./utils/middleware";
import { apiError } from "./utils/types";
import swaggerUIExperss from "swagger-ui-express";
import { yaml } from "./swagger";
import { routes } from "./utils/constants";

export const makeApp = (db: ICbDatabase) => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use(
    "/api-docs",
    swaggerUIExperss.serve,
    swaggerUIExperss.setup(yaml/*, {swaggerOptions: { supportedSubmitMethods: [ 'get' ] }}*/)
  );

  app.use(routes.home, AccessRouter(db));

  app.use(auth);
  app.use(routes.critters, CritterRouter(db));
  app.use(routes.locations, LocationRouter(db));
  app.use(routes.markings, MarkingRouter(db));
  app.use(routes.users, UserRouter(db));
  app.use(routes.collection_units, CollectionUnitRouter(db));
  app.use(routes.artifacts, ArtifactRouter(db));
  app.use(routes.family, FamilyRouter(db));
  app.use(routes.captures, CaptureRouter(db));
  app.use(routes.mortality, MortalityRouter(db));
  app.use(routes.measurements, MeasurementRouter(db));
  app.use(routes.lookups, LookupRouter(db));
  app.use(routes.bulk, BulkRouter(db));
  app.use(routes.xref, XrefRouter(db));

  app.all("*", (req, res) => {
    throw apiError.notFound(`${req.method} ${req.url} -> route not found`);
  });

  app.use(errorLogger);
  app.use(errorHandler);

  return app;
};
