import { app } from "../server";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT;

const IS_DEV = process.env.NODE_ENV === "development";

const IS_PROD = process.env.NODE_ENV === "production";

const IS_TEST = process.env.NODE_ENV === "test";

const prisma = new PrismaClient();

export { PORT, IS_DEV, IS_PROD, IS_TEST, prisma };
