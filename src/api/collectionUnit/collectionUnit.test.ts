import { prisma, request } from "../../utils/constants";
import {
  getAllCollectionUnits,
  getCollectionUnitById,
  getCollectionUnitByCritterId,
  updateCollectionUnit,
  createCollectionUnit,
  deleteCollectionUnit,
} from "./collectionUnit.service";
import type { Prisma, marking } from "@prisma/client";
import { randomInt, randomUUID } from "crypto";
