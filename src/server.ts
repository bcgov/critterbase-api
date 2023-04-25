import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import memorystore from "memorystore";
import { accessRouter } from "./api/access/access.router";
import { artifactRouter } from "./api/artifact/artifact.router";
import { captureRouter } from "./api/capture/capture.router";
import { collectionUnitRouter } from "./api/collectionUnit/collectionUnit.router";
import { critterRouter } from "./api/critter/critter.router";
import { familyRouter } from "./api/family/family.router";
import { locationRouter } from "./api/location/location.router";
import { markingRouter } from "./api/marking/marking.router";
import { measurementRouter } from "./api/measurement/measurement.router";
import { mortalityRouter } from "./api/mortality/mortality.router";
import { userRouter } from "./api/user/user.router";
import { IS_DEV, IS_PROD, PORT } from "./utils/constants";
import { sessionHours } from "./utils/helper_functions";
import {
  auth,
  errorHandler,
  errorLogger,
  validateApiKey,
} from "./utils/middleware";
import { bulkRouter } from "./api/bulk/bulk.router";
import { lookupRouter } from "./api/lookup/lookup.router";
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

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(session(options));
app.use(validateApiKey);

app.use("/api/", accessRouter);
app.use("/api/critters", auth, critterRouter);
app.use("/api/locations", auth, locationRouter);
app.use("/api/markings", auth, markingRouter);
app.use("/api/users", auth, userRouter);
app.use("/api/collection-units", auth, collectionUnitRouter);
app.use("/api/artifacts", auth, artifactRouter);
app.use("/api/family", auth, familyRouter);
app.use("/api/captures", auth, captureRouter);
app.use("/api/mortality", auth, mortalityRouter);
app.use("/api/measurements", auth, measurementRouter);
app.use("/api/bulk", auth, bulkRouter);
app.use("/api/lookups", auth, lookupRouter);

app.use(errorLogger);
app.use(errorHandler);

if (IS_DEV || IS_PROD) {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT ?? 8080}`);
  });
}

export { app };
