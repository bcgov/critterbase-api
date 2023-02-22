import express from "express";
import cors from "cors";
import { critterRouter } from "./api/critter/critter.router";
import { errorLogger, errorHandler, root } from "./utils/express_handlers";
import { PORT } from "./utils/constants";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/", root);
app.use("/api/critter", critterRouter);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
