import cors from "cors";
import express from "express";
import helmet from "helmet";
import { captureRouter } from "./api/critter/critter.router";
import { IS_DEV, IS_PROD, PORT } from "./utils/constants";
import { startServer } from "./utils/helper_functions";
import {
  errorHandler,
  errorLogger,
  home,
  excludeAuditFields,
  catchErrors,
} from "./utils/middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(excludeAuditFields);

app.get("/api/", home);
app.use("/api/critters", captureRouter);

app.use(errorLogger);
app.use(errorHandler);

startServer();

export { app };
