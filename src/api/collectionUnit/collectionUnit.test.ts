import { apiError } from "../../utils/types";
import supertest from "supertest";
import { makeApp } from "../../app";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import {
    getAllCollectionUnits as _getAllCollectionUnits,
    getCollectionUnitById as _getCollectionUnitById,
    getCollectionUnitsByCritterId as _getCollectionUnitsByCritterId,
    updateCollectionUnit as _updateCollectionUnit,
    createCollectionUnit as _createCollectionUnit,
    deleteCollectionUnit as _deleteCollectionUnit
} from "./collectionUnit.service";
