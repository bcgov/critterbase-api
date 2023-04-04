import cors from "cors";
import express, { Request } from "express";
import helmet from "helmet";
import { artifactRouter } from "./api/artifact/artifact.router";
import { collectionUnitRouter } from "./api/collectionUnit/collectionUnit.router";
import { captureRouter } from "./api/capture/capture.router";
import { critterRouter } from "./api/critter/critter.router";
import { familyRouter } from "./api/family/family.router";
import { locationRouter } from "./api/location/location.router";
import { markingRouter } from "./api/marking/marking.router";
import { mortalityRouter } from "./api/mortality/mortality.router";
import { measurementRouter } from "./api/measurement/measurement.router";
import { userRouter } from "./api/user/user.router";
import { errorHandler, errorLogger, health, home } from "./utils/middleware";
import { IS_DEV, IS_PROD, PORT, expressSession } from "./utils/constants";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(expressSession);

app.get("/api/", home);
app.get("/api/health", health);
app.use("/api/critters", critterRouter);
app.use("/api/locations", locationRouter);
app.use("/api/markings", markingRouter);
app.use("/api/users", userRouter);
app.use("/api/collection-units", collectionUnitRouter);
app.use("/api/artifacts", artifactRouter);
app.use("/api/family", familyRouter);
app.use("/api/captures/", captureRouter);
app.use("/api/mortality", mortalityRouter);
app.use("/api/measurements", measurementRouter);

app.use(errorLogger);
app.use(errorHandler);

if (IS_DEV || IS_PROD) {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT ?? 8000}`);
  });
}

export { app };
