import { apiError } from "../../utils/types";
import supertest from "supertest";
import { makeApp } from "../../app";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import {
  getAllFamilies as _getAllFamilies,
  getAllParents as _getAllParents,
  getAllChildren as _getAllChildren,
  getFamilyById as _getFamilyById,
  updateFamily as _updateFamily,
  deleteFamily as _deleteFamily,
  getFamilyByLabel as _getFamilyByLabel,
  getParentsOfCritterId as _getParentsOfCritterId,
  getChildrenOfCritterId as _getChildrenOfCritterId,
  createNewFamily as _createNewFamily,
  getImmediateFamilyOfCritter as _getImmediateFamilyOfCritter,
  removeChildOfFamily as _removeChildOfFamily,
  removeParentOfFamily as _removeParentOfFamily,
  makeChildOfFamily as _makeChildOfFamily,
  makeParentOfFamily as _makeParentOfFamily,
  getImmediateFamily as _getImmediateFamily,
} from "./family.service";
import {
  FamilyChildCreateBodySchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema,
  ImmediateFamily,
  ImmediateFamilyCritter,
  FamilyUpdate,
  FamilyCreate,
  FamilyChildCreate,
  FamilyParentCreate,
} from "./family.utils";

import { randomUUID } from "crypto";
import { family } from ".prisma/client";

// Mock Location Objects
const ID = randomUUID();
const DATE = new Date();

const mockFamily: family = {
  family_id: ID,
  family_label: "test",
  create_timestamp: DATE,
  update_timestamp: DATE,
  create_user: ID,
  update_user: ID,
};

// TODO: finish mocking objects

// Mock Prisma Calls
const create = jest.spyOn(prisma.family, "create").mockImplementation();
const findMany = jest.spyOn(prisma.family, "findMany").mockImplementation();
const findFirstOrThrow = jest
  .spyOn(prisma.family, "findFirstOrThrow")
  .mockImplementation();
const findFirst = jest.spyOn(prisma.family, "findFirst").mockImplementation();
const update = jest.spyOn(prisma.family, "update").mockImplementation();
const deleteFn = jest.spyOn(prisma.family, "delete").mockImplementation();

// Mock Services
const getAllFamilies = jest.fn();
const getAllParents = jest.fn();
const getAllChildren = jest.fn();
const getFamilyById = jest.fn();
const updateFamily = jest.fn();
const deleteFamily = jest.fn();
const getFamilyByLabel = jest.fn();
const getParentsOfCritterId = jest.fn();
const getChildrenOfCritterId = jest.fn();
const createNewFamily = jest.fn();
const getImmediateFamilyOfCritter = jest.fn();
const removeChildOfFamily = jest.fn();
const removeParentOfFamily = jest.fn();
const makeChildOfFamily = jest.fn();
const makeParentOfFamily = jest.fn();
const getImmediateFamily = jest.fn();

const request = supertest(
  makeApp({
    getAllFamilies,
    getAllParents,
    getAllChildren,
    getFamilyById,
    updateFamily,
    deleteFamily,
    getFamilyByLabel,
    getParentsOfCritterId,
    getChildrenOfCritterId,
    createNewFamily,
    getImmediateFamilyOfCritter,
    removeChildOfFamily,
    removeParentOfFamily,
    makeChildOfFamily,
    makeParentOfFamily,
    getImmediateFamily,
  } as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  //? Reset mocked prisma calls?

  // Reset Mocked Services
  getAllFamilies.mockReset();
  getAllParents.mockReset();
  getAllChildren.mockReset();
  getFamilyById.mockReset();
  updateFamily.mockReset();
  deleteFamily.mockReset();
  getFamilyByLabel.mockReset();
  getParentsOfCritterId.mockReset();
  getChildrenOfCritterId.mockReset();
  createNewFamily.mockReset();
  getImmediateFamilyOfCritter.mockReset();
  removeChildOfFamily.mockReset();
  removeParentOfFamily.mockReset();
  makeChildOfFamily.mockReset();
  makeParentOfFamily.mockReset();
  getImmediateFamily.mockReset();

  // TODO: Set default return values for mocked services
});

// Tests
describe("API: Family", () => {
  // TODO: Util Tests

  describe("SERVICES", () => {
    describe("getAllFamilies", () => {
      it("should return all families", async () => {
        findMany.mockResolvedValue([mockFamily]);
        const families = await _getAllFamilies();
        expect.assertions(2);
        expect(findMany).toHaveBeenCalledTimes(1);
        expect(families).toEqual([mockFamily]);
      });
    });

    // TODO: Finish Service Tests
  });

  // TODO: Router Tests
});
