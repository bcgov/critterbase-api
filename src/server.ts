import cors from "cors";
import express from "express";
import helmet from "helmet";
import { critterRouter } from "./api/critter/critter.router";
import {
  errorHandler,
  errorLogger,
  home,
  startServer,
} from "./utils/express_handlers";

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
