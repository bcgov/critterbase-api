import cors from "cors";
import express from "express";
import helmet from "helmet";
import { critterRouter } from "./api/critter/critter.router";
import { IS_DEV, IS_PROD, PORT } from "./utils/constants";
import { errorHandler, errorLogger, home } from "./utils/middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.get("/api/", home);
app.use("/api/critters", critterRouter);

app.use(errorLogger);
app.use(errorHandler);

if (IS_DEV || IS_PROD) {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
}

export { app };
