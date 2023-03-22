import cors from "cors";
import express from "express";
import helmet from "helmet";
import { artifactRouter } from "./api/artifact/artifact.router";
import { collectionUnitRouter } from "./api/collectionUnit/collectionUnit.router";
import { critterRouter } from "./api/critter/critter.router";
import { locationRouter } from "./api/location/location.router";
import { markingRouter } from "./api/marking/marking.router";
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
app.use("/api/collection_units", collectionUnitRouter);
app.use("/api/artifacts", artifactRouter);

app.use(errorLogger);
app.use(errorHandler);

startServer();

export { app };
