import cors from "cors";
import express from "express";
import helmet from "helmet";
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
import { auth, errorHandler, errorLogger } from "./utils/middleware";
import { lookupRouter } from "./api/lookup/lookup.router";
import { bulkRouter } from "./api/bulk/bulk.router";
import { xrefRouter } from "./api/xref/xref.router";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/", accessRouter);
app.use(auth);

app.use("/api/critters", critterRouter);
app.use("/api/locations", locationRouter);
app.use("/api/markings", markingRouter);
app.use("/api/users", userRouter);
app.use("/api/collection-units", collectionUnitRouter);
app.use("/api/artifacts", artifactRouter);
app.use("/api/family", familyRouter);
app.use("/api/captures", captureRouter);
app.use("/api/mortality", mortalityRouter);
app.use("/api/measurements", measurementRouter);
app.use("/api/lookups", lookupRouter);
app.use("/api/bulk", bulkRouter);
app.use("/api/xref", xrefRouter);

app.use(errorLogger);
app.use(errorHandler);

if (IS_DEV || IS_PROD) {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT ?? 8080}`);
  });
}

export { app };
