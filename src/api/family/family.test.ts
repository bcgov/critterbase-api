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
  getSiblingsOfCritterId as _getSiblingsOfCritterId,
  createNewFamily as _createNewFamily,
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
import {
  critter,
  family,
  family_child,
  family_parent,
  sex,
} from ".prisma/client";
import { get } from "superagent";

// Mock Location Objects
const ID = randomUUID();
const DATE = new Date();
const FAMILY_LABEL = "Family Label";

const mockAuditColumns = {
  create_timestamp: DATE,
  update_timestamp: DATE,
  create_user: ID,
  update_user: ID,
};

const mockCritter: critter = {
  critter_id: ID,
  taxon_id: ID,
  wlh_id: ID,
  animal_id: ID,
  sex: sex.Male,
  responsible_region_nr_id: ID,
  critter_comment: "test",
  ...mockAuditColumns,
};

const mockFamily: family = {
  family_id: ID,
  family_label: "test",
  ...mockAuditColumns,
};

const mockFamilyChild: family_child = {
  family_id: ID,
  child_critter_id: ID,
  ...mockAuditColumns,
};

const mockFamilyParent: family_parent = {
  family_id: ID,
  parent_critter_id: ID,
  ...mockAuditColumns,
};

const mockImmediateFamily: ImmediateFamily = {
  parents: [mockCritter],
  children: [mockCritter],
};

const mockImmediateFamilyCritter: ImmediateFamilyCritter = {
  ...mockImmediateFamily,
  siblings: [mockCritter],
};

// TODO: finish mocking objects

// Mock Prisma Calls

// Critter
const findMany_critter = jest
  .spyOn(prisma.critter, "findMany")
  .mockImplementation();

// Family
const create_family = jest.spyOn(prisma.family, "create").mockImplementation();
const findMany_family = jest
  .spyOn(prisma.family, "findMany")
  .mockImplementation();
const findFirstOrThrow_family = jest
  .spyOn(prisma.family, "findFirstOrThrow")
  .mockImplementation();
const findFirst_family = jest
  .spyOn(prisma.family, "findFirst")
  .mockImplementation();
const update_family = jest.spyOn(prisma.family, "update").mockImplementation();
const deleteFn_family = jest
  .spyOn(prisma.family, "delete")
  .mockImplementation();

// Family Child
const findMany_family_child = jest
  .spyOn(prisma.family_child, "findMany")
  .mockImplementation();
const findFirstOrThrow_family_child = jest
  .spyOn(prisma.family_child, "findFirstOrThrow")
  .mockImplementation();
const create_family_child = jest
  .spyOn(prisma.family_child, "create")
  .mockImplementation();
const deleteFn_family_child = jest
  .spyOn(prisma.family_child, "delete")
  .mockImplementation();

// Family Parent
const findMany_family_parent = jest
  .spyOn(prisma.family_parent, "findMany")
  .mockImplementation();
const findFirstOrThrow_family_parent = jest
  .spyOn(prisma.family_parent, "findFirstOrThrow")
  .mockImplementation();
const create_family_parent = jest
  .spyOn(prisma.family_parent, "create")
  .mockImplementation();
const deleteFn_family_parent = jest
  .spyOn(prisma.family_parent, "delete")
  .mockImplementation();

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
const getSiblingsOfCritterId = jest.fn();
const createNewFamily = jest.fn();
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
  getSiblingsOfCritterId.mockReset();
  createNewFamily.mockReset();
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
        findMany_family.mockResolvedValue([mockFamily]);
        const families = await _getAllFamilies();
        expect.assertions(3);
        expect(findMany_family).toHaveBeenCalledTimes(1);
        expect(families).toBeInstanceOf(Array);
        expect(families).toEqual([mockFamily]);
      });
    });

    describe("getAllParents", () => {
      it("should return all parents", async () => {
        findMany_family_parent.mockResolvedValue([mockFamilyParent]);
        const families = await _getAllParents();
        expect.assertions(3);
        expect(findMany_family_parent).toHaveBeenCalledTimes(1);
        expect(families).toBeInstanceOf(Array);
        expect(families).toEqual([mockFamilyParent]);
      });
    });

    describe("getAllChildren", () => {
      it("should return all children", async () => {
        findMany_family_child.mockResolvedValue([mockFamilyChild]);
        const families = await _getAllChildren();
        expect.assertions(3);
        expect(findMany_family_child).toHaveBeenCalledTimes(1);
        expect(families).toBeInstanceOf(Array);
        expect(families).toEqual([mockFamilyChild]);
      });
    });

    describe("getFamilyById", () => {
      it("should return a family when a valid id is provided", async () => {
        findFirstOrThrow_family.mockResolvedValue(mockFamily);
        const family = await _getFamilyById(ID);
        expect.assertions(2);
        expect(findFirstOrThrow_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it("should throw an error if family is not found", async () => {
        findFirstOrThrow_family.mockRejectedValue(new Error());
        await expect(_getFamilyById(ID)).rejects.toThrow();
      });
    });

    describe("getImmediateFamily", () => {
      it("should return a family when a valid id is provided", async () => {
        findMany_family_parent.mockResolvedValue([mockFamilyParent]);
        findMany_family_child.mockResolvedValue([mockFamilyChild]);
        findMany_critter.mockResolvedValue([mockCritter]);
        const family = await _getImmediateFamily(ID);
        expect.assertions(4);
        expect(findMany_family_parent).toHaveBeenCalledTimes(1);
        expect(findMany_family_child).toHaveBeenCalledTimes(1);
        expect(findMany_critter).toHaveBeenCalledTimes(2);
        expect(family).toEqual(mockImmediateFamily);
      });
    });

    describe("updateFamily", () => {
      it("should update a family when a valid id is provided", async () => {
        update_family.mockResolvedValue(mockFamily);
        const family = await _updateFamily(ID, mockFamily);
        expect.assertions(2);
        expect(update_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it("should throw an error if family is not found", async () => {
        update_family.mockRejectedValue(new Error());
        await expect(_updateFamily(ID, mockFamily)).rejects.toThrow();
      });
    });

    describe("deleteFamily", () => {
      it("should delete a family when a valid id is provided", async () => {
        deleteFn_family.mockResolvedValue(mockFamily);
        const family = await _deleteFamily(ID);
        expect.assertions(2);
        expect(deleteFn_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it("should throw an error if family is not found", async () => {
        deleteFn_family.mockRejectedValue(new Error());
        await expect(_deleteFamily(ID)).rejects.toThrow();
      });
    });

    describe("getFamilyByLabel", () => {
      it("should return a family when a valid label is provided", async () => {
        findFirst_family.mockResolvedValue(mockFamily);
        const family = await _getFamilyByLabel(FAMILY_LABEL);
        expect.assertions(2);
        expect(findFirst_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it("should throw an error if family is not found", async () => {
        findFirst_family.mockRejectedValue(new Error());
        await expect(_getFamilyByLabel(FAMILY_LABEL)).rejects.toThrow();
      });
    });

    describe("getParentsOfCritterId", () => {
      it("should return a list of parents when a valid critter_id is provided", async () => {
        findFirstOrThrow_family_child.mockResolvedValue(mockFamilyChild);
        findMany_family_parent.mockResolvedValue([mockFamilyParent]);
        findMany_critter.mockResolvedValue([mockCritter]);
        const parents = await _getParentsOfCritterId(ID);
        expect.assertions(5);
        expect(findFirstOrThrow_family_child).toHaveBeenCalledTimes(1);
        expect(findMany_family_parent).toHaveBeenCalledTimes(1);
        expect(findMany_critter).toHaveBeenCalledTimes(1);
        expect(parents).toBeInstanceOf(Array);
        expect(parents).toEqual([mockCritter]);
      });
      it("should throw an error on invalid critter_id", async () => {
        findMany_family_parent.mockRejectedValue(new Error());
        await expect(_getParentsOfCritterId(ID)).rejects.toThrow();
      });
    });

    describe("getChildrenOfCritterId", () => {
      it("should return a list of children when a valid critter_id is provided", async () => {
        findFirstOrThrow_family_parent.mockResolvedValue(mockFamilyParent);
        findMany_family_child.mockResolvedValue([mockFamilyChild]);
        findMany_critter.mockResolvedValue([mockCritter]);
        const children = await _getChildrenOfCritterId(ID);
        expect.assertions(5);
        expect(findFirstOrThrow_family_parent).toHaveBeenCalledTimes(1);
        expect(findMany_family_child).toHaveBeenCalledTimes(1);
        expect(findMany_critter).toHaveBeenCalledTimes(1);
        expect(children).toBeInstanceOf(Array);
        expect(children).toEqual([mockCritter]);
      });
      it("should throw an error on invalid critter_id", async () => {
        findMany_family_child.mockRejectedValue(new Error());
        await expect(_getChildrenOfCritterId(ID)).rejects.toThrow();
      });
    });

    describe("getSiblingsOfCritterId", () => {
      it("should return a list of siblings when a valid critter id_is provided", async () => {
        findFirstOrThrow_family_child.mockResolvedValue(mockFamilyChild);
        findMany_family_child.mockResolvedValue([mockFamilyChild]);
        findMany_critter.mockResolvedValue([mockCritter]);
        const siblings = await _getSiblingsOfCritterId(ID);
        expect.assertions(5);
        expect(findFirstOrThrow_family_child).toHaveBeenCalledTimes(1);
        expect(findMany_family_child).toHaveBeenCalledTimes(1);
        expect(findMany_critter).toHaveBeenCalledTimes(1);
        expect(siblings).toBeInstanceOf(Array);
        expect(siblings).toEqual([mockCritter]);
      });
      it("should throw an error on invalid critter_id", async () => {
        findMany_family_child.mockRejectedValue(new Error());
        await expect(_getSiblingsOfCritterId(ID)).rejects.toThrow();
      });
    });

    describe("createNewFamily", () => {
      it("should create a new family", async () => {
        create_family.mockResolvedValue(mockFamily);
        const family = await _createNewFamily(FAMILY_LABEL);
        expect.assertions(2);
        expect(create_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
    });

    describe("makeParentOfFamily", () => {
      it("should add a parent to a family", async () => {
        create_family_parent.mockResolvedValue(mockFamilyParent);
        const parent = await _makeParentOfFamily(ID, ID);
        expect.assertions(2);
        expect(create_family_parent).toHaveBeenCalledTimes(1);
        expect(parent).toEqual(mockFamilyParent);
      });
    });

    describe("makeChildOfFamily", () => {
      it("should add a child to a family", async () => {
        create_family_child.mockResolvedValue(mockFamilyChild);
        const child = await _makeChildOfFamily(ID, ID);
        expect.assertions(2);
        expect(create_family_child).toHaveBeenCalledTimes(1);
        expect(child).toEqual(mockFamilyChild);
      });
    });

    describe("removeParentOfFamily", () => {
      it("should remove a parent from a family", async () => {
        deleteFn_family_parent.mockResolvedValue(mockFamilyParent);
        const parent = await _removeParentOfFamily(ID, ID);
        expect.assertions(2);
        expect(deleteFn_family_parent).toHaveBeenCalledTimes(1);
        expect(parent).toEqual(mockFamilyParent);
      });
    });

    describe("removeChildOfFamily", () => {
      it("should remove a child from a family", async () => {
        deleteFn_family_child.mockResolvedValue(mockFamilyChild);
        const child = await _removeChildOfFamily(ID, ID);
        expect.assertions(2);
        expect(deleteFn_family_child).toHaveBeenCalledTimes(1);
        expect(child).toEqual(mockFamilyChild);
      });
    });

    describe("deleteFamily", () => {
      it("should delete a family", async () => {
        deleteFn_family.mockResolvedValue(mockFamily);
        const family = await _deleteFamily(ID);
        expect.assertions(2);
        expect(deleteFn_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
    });
  });

  // TODO: Router Tests
});
