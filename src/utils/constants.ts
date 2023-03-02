import supertest from "supertest";
import { app } from "../server";
import { PrismaClient } from "@prisma/client";

const request = supertest(app);

const prisma = new PrismaClient();

const PORT = process.env.PORT;

const IS_DEV = process.env.NODE_ENV === "development";

const IS_PROD = process.env.NODE_ENV === "production";

const IS_TEST = process.env.NODE_ENV === "test";

export { PORT, IS_DEV, IS_PROD, IS_TEST, request, prisma };
