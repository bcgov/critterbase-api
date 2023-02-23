import express from "express";
import cors from "cors";
import helmet from "helmet";
import { critterRouter } from "./api/critter/critter.router";
import {
  errorLogger,
  errorHandler,
  home,
  catchErrors,
  startServer,
} from "./utils/express_handlers";
import { IS_TEST, PORT } from "./utils/constants";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.get("/api/", home);
app.use("/api/critters", critterRouter);
app.use(errorLogger);
app.use(errorHandler);

startServer();

export { app };
