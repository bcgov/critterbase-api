import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import memorystore from "memorystore";
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
import { sessionHours } from "./utils/helper_functions";
import { auth, errorHandler, errorLogger } from "./utils/middleware";

const SafeMemoryStore = memorystore(session);
const options: session.SessionOptions = {
  cookie: {
    maxAge: sessionHours(24), //how long until the session expires
  },
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SafeMemoryStore({
    checkPeriod: sessionHours(1), //how frequently it attempts to prune stale sessions
  }),
};

export const makeApp = (db: ICbDatabase) => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(session(options));
  //app.use(validateApiKey);

  app.use("/api/", AccessRouter(db));
  app.use("/api/critters", auth, CritterRouter(db));
  app.use("/api/locations", auth, LocationRouter(db));
  app.use("/api/markings", auth, MarkingRouter(db));
  app.use("/api/users", auth, UserRouter(db));
  app.use("/api/collection-units", auth, CollectionUnitRouter(db));
  app.use("/api/artifacts", auth, ArtifactRouter(db));
  app.use("/api/family", auth, FamilyRouter(db));
  app.use("/api/captures", auth, CaptureRouter(db));
  app.use("/api/mortality", auth, MortalityRouter(db));
  app.use("/api/measurements", auth, MeasurementRouter(db));
  app.use("/api/lookups", auth, LookupRouter(db));
  app.use("/api/bulk", auth, BulkRouter(db));
  app.use("/api/xref", auth, XrefRouter(db));

  app.use(errorLogger);
  app.use(errorHandler);

  return app;
};
