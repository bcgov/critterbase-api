import cors from "cors";
import express from "express";
import helmet from "helmet";
import { critterRouter } from "./api/critter/critter.router";
import { userRouter } from "./api/user/user.router";
import { IS_DEV, IS_PROD, PORT } from "./utils/constants";
import { startServer } from "./utils/helper_functions";
import {
  errorHandler,
  errorLogger,
  home,
  excludeAuditFields,
  catchErrors,
  checkUuidParam,
} from "./utils/middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(excludeAuditFields);

// Apply the checkUuidParam middleware to all routes that have an 'id' parameter
app.param('id', checkUuidParam);

app.get("/api/", home);
app.use("/api/critters", critterRouter);
app.use("/api/users", userRouter);

app.use(errorLogger);
app.use(errorHandler);

startServer();

export { app };
