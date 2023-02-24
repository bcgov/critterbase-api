import supertest from "supertest";
import { app } from "../server";

const request = supertest(app);

const PORT = process.env.PORT;

const IS_DEV = process.env.NODE_ENV === "development";

const IS_TEST = process.env.NODE_ENV === "test";

export { PORT, IS_DEV, IS_TEST, request };
