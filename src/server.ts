import cors from "cors";
import express from "express";
import helmet from "helmet";
import { captureRouter } from "./api/capture/capture.router";
import { critterRouter } from "./api/critter/critter.router";
import { locationRouter } from "./api/location/location.router";
import { markingRouter } from "./api/marking/marking.router";
import { mortalityRouter } from "./api/mortality/mortality.router";
import { userRouter } from "./api/user/user.router";
import { IS_DEV, IS_PROD, PORT } from "./utils/constants";
import { startServer } from "./utils/helper_functions";
import {
  errorHandler,
  errorLogger,
  home,
  catchErrors,
} from "./utils/middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
//app.use(excludeAuditFields);

app.get("/api/", home);
app.use("/api/critters", critterRouter);
app.use("/api/locations", locationRouter);
app.use("/api/markings", markingRouter);
app.use("/api/users", userRouter);
app.use("/api/captures/", captureRouter);
app.use("/api/mortality", mortalityRouter);

app.use(errorLogger);
app.use(errorHandler);

startServer();

export { app };
