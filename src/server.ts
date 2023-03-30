import cors from "cors";
import express from "express";
import helmet from "helmet";
import { captureRouter } from "./api/capture/capture.router";
import { critterRouter } from "./api/critter/critter.router";
import { familyRouter } from "./api/family/family.router";
import { locationRouter } from "./api/location/location.router";
import { markingRouter } from "./api/marking/marking.router";
import { mortalityRouter } from "./api/mortality/mortality.router";
import { measurementRouter } from "./api/measurement/measurement.router";
import { userRouter } from "./api/user/user.router";
import { startServer } from "./utils/helper_functions";
import { errorHandler, errorLogger, home } from "./utils/middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/api/", home);
app.use("/api/critters", critterRouter);
app.use("/api/locations", locationRouter);
app.use("/api/markings", markingRouter);
app.use("/api/users", userRouter);
app.use("/api/family", familyRouter);
app.use("/api/captures/", captureRouter);
app.use("/api/mortality", mortalityRouter);
app.use("/api/measurements", measurementRouter);

app.use(errorLogger);
app.use(errorHandler);

startServer();

export { app };
