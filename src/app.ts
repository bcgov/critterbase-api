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
import { options } from "./openapi/root-api-doc";

import swaggerJSDoc from "swagger-jsdoc";
import { yaml } from "./swagger";

export const makeApp = (db: ICbDatabase) => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use(
    "/api-docs",
    swaggerUIExperss.serve,
    swaggerUIExperss.setup(yaml)
  );

  app.use("/api/", AccessRouter(db));

  app.use(auth);
  app.use("/api/critters", CritterRouter(db));
  app.use("/api/locations", LocationRouter(db));
  app.use("/api/markings", MarkingRouter(db));
  app.use("/api/users", UserRouter(db));
  app.use("/api/collection-units", CollectionUnitRouter(db));
  app.use("/api/artifacts", ArtifactRouter(db));
  app.use("/api/family", FamilyRouter(db));
  app.use("/api/captures", CaptureRouter(db));
  app.use("/api/mortality", MortalityRouter(db));
  app.use("/api/measurements", MeasurementRouter(db));
  app.use("/api/lookups", LookupRouter(db));
  app.use("/api/bulk", BulkRouter(db));
  app.use("/api/xref", XrefRouter(db));

  app.all("*", (req, res) => {
    throw apiError.notFound(`${req.method} ${req.url} -> route not found`);
  });

  app.use(errorLogger);
  app.use(errorHandler);

  return app;
};
