import cors from "cors";
import express from "express";
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
import {
  auth,
  errorHandler,
  errorLogger,
  health,
  home,
  login,
  signUp,
  validateApiKey,
} from "./utils/middleware";
import { IS_DEV, IS_PROD, PORT, expressSession } from "./utils/constants";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(expressSession);
app.use(validateApiKey);

app.get("/api/", home);
app.get("/api/health", health);
app.post("/api/login", login);
app.post("/api/signup", signUp);

app.use("/api/critters", auth, critterRouter);
app.use("/api/locations", auth, locationRouter);
app.use("/api/markings", auth, markingRouter);
app.use("/api/users", auth, userRouter);
app.use("/api/collection-units", auth, collectionUnitRouter);
app.use("/api/artifacts", auth, artifactRouter);
app.use("/api/family", auth, familyRouter);
app.use("/api/captures/", auth, captureRouter);
app.use("/api/mortality", auth, mortalityRouter);
app.use("/api/measurements", auth, measurementRouter);

app.use(errorLogger);
app.use(errorHandler);

if (IS_DEV || IS_PROD) {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT ?? 8080}`);
  });
}

export { app };
