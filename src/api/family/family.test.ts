import supertest from 'supertest';
import { makeApp } from '../../app';
import { prisma } from '../../utils/constants';
import { ICbDatabase } from '../../utils/database';
import { apiError } from '../../utils/types';
import {
  createNewFamily as _createNewFamily,
  deleteFamily as _deleteFamily,
  getAllChildren as _getAllChildren,
  getAllFamilies as _getAllFamilies,
  getAllParents as _getAllParents,
  getChildrenOfCritterId as _getChildrenOfCritterId,
  getFamilyById as _getFamilyById,
  getFamilyByLabel as _getFamilyByLabel,
  getImmediateFamily as _getImmediateFamily,
  getParentsOfCritterId as _getParentsOfCritterId,
  getSiblingsOfCritterId as _getSiblingsOfCritterId,
  makeChildOfFamily as _makeChildOfFamily,
  makeParentOfFamily as _makeParentOfFamily,
  removeChildOfFamily as _removeChildOfFamily,
  removeParentOfFamily as _removeParentOfFamily,
  updateFamily as _updateFamily
} from './family.service';
import { ImmediateFamily, ImmediateFamilyCritter } from './family.utils';

import { critter, family, family_child, family_parent, sex } from '.prisma/client';
import { randomUUID } from 'crypto';

// Mock Location Objects
const ID = randomUUID();
const DATE = new Date();
const FAMILY_LABEL = 'Family Label';

const mockAuditColumns = {
  create_timestamp: DATE,
  update_timestamp: DATE,
  create_user: ID,
  update_user: ID
};

const mockCritter: critter = {
  critter_id: ID,
  taxon_id: ID,
  wlh_id: ID,
  animal_id: ID,
  sex: sex.Male,
  responsible_region_nr_id: ID,
  critter_comment: 'test',
  ...mockAuditColumns
};

const mockCritterResponse = {
  ...mockCritter,
  create_timestamp: DATE.toISOString(),
  update_timestamp: DATE.toISOString()
};

const mockFamily: family = {
  family_id: ID,
  family_label: 'test',
  ...mockAuditColumns
};

const mockFamilyResponse = {
  ...mockFamily,
  create_timestamp: DATE.toISOString(),
  update_timestamp: DATE.toISOString()
};

const mockFamilyChild: family_child = {
  family_id: ID,
  child_critter_id: ID,
  ...mockAuditColumns
};

const mockFamilyChildResponse = {
  ...mockFamilyChild,
  create_timestamp: DATE.toISOString(),
  update_timestamp: DATE.toISOString()
};

const mockFamilyParent: family_parent = {
  family_id: ID,
  parent_critter_id: ID,
  ...mockAuditColumns
};

const mockFamilyParentResponse = {
  ...mockFamilyParent,
  create_timestamp: DATE.toISOString(),
  update_timestamp: DATE.toISOString()
};

const mockImmediateFamily: ImmediateFamily = {
  parents: [mockCritter],
  children: [mockCritter]
};

const mockImmediateFamilyResponse = {
  parents: [mockCritterResponse],
  children: [mockCritterResponse]
};

const mockImmediateFamilyCritter: ImmediateFamilyCritter = {
  ...mockImmediateFamily,
  siblings: [mockCritter]
};

const mockImmediateFamilyCritterResponse = {
  ...mockImmediateFamilyResponse,
  siblings: [mockCritterResponse]
};

// TODO: finish mocking objects

// Mock Prisma Calls

// Critter
const findMany_critter = jest.spyOn(prisma.critter, 'findMany').mockImplementation();

// Family
const create_family = jest.spyOn(prisma.family, 'create').mockImplementation();
const findMany_family = jest.spyOn(prisma.family, 'findMany').mockImplementation();
const findFirstOrThrow_family = jest.spyOn(prisma.family, 'findFirstOrThrow').mockImplementation();
const findFirst_family = jest.spyOn(prisma.family, 'findFirst').mockImplementation();
const update_family = jest.spyOn(prisma.family, 'update').mockImplementation();
const deleteFn_family = jest.spyOn(prisma.family, 'delete').mockImplementation();
const findUniqueOrThrow_family = jest.spyOn(prisma.family, 'findUniqueOrThrow').mockImplementation();

// Family Child
const findMany_family_child = jest.spyOn(prisma.family_child, 'findMany').mockImplementation();
const findFirstOrThrow_family_child = jest.spyOn(prisma.family_child, 'findFirstOrThrow').mockImplementation();
const create_family_child = jest.spyOn(prisma.family_child, 'create').mockImplementation();
const deleteFn_family_child = jest.spyOn(prisma.family_child, 'delete').mockImplementation();

// Family Parent
const findMany_family_parent = jest.spyOn(prisma.family_parent, 'findMany').mockImplementation();
const findFirstOrThrow_family_parent = jest.spyOn(prisma.family_parent, 'findFirstOrThrow').mockImplementation();
const create_family_parent = jest.spyOn(prisma.family_parent, 'create').mockImplementation();
const deleteFn_family_parent = jest.spyOn(prisma.family_parent, 'delete').mockImplementation();

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
    getSiblingsOfCritterId,
    createNewFamily,
    removeChildOfFamily,
    removeParentOfFamily,
    makeChildOfFamily,
    makeParentOfFamily,
    getImmediateFamily
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
  findUniqueOrThrow_family.mockResolvedValue(mockFamily);
});

// Tests
describe('API: Family', () => {
  // TODO: Util Tests

  describe('SERVICES', () => {
    describe('getAllFamilies', () => {
      it('should return all families', async () => {
        findMany_family.mockResolvedValue([mockFamily]);
        const families = await _getAllFamilies();
        expect.assertions(3);
        expect(findMany_family).toHaveBeenCalledTimes(1);
        expect(families).toBeInstanceOf(Array);
        expect(families).toEqual([mockFamily]);
      });
    });

    describe('getAllParents', () => {
      it('should return all parents', async () => {
        findMany_family_parent.mockResolvedValue([mockFamilyParent]);
        const families = await _getAllParents();
        expect.assertions(3);
        expect(findMany_family_parent).toHaveBeenCalledTimes(1);
        expect(families).toBeInstanceOf(Array);
        expect(families).toEqual([mockFamilyParent]);
      });
    });

    describe('getAllChildren', () => {
      it('should return all children', async () => {
        findMany_family_child.mockResolvedValue([mockFamilyChild]);
        const families = await _getAllChildren();
        expect.assertions(3);
        expect(findMany_family_child).toHaveBeenCalledTimes(1);
        expect(families).toBeInstanceOf(Array);
        expect(families).toEqual([mockFamilyChild]);
      });
    });

    describe('getFamilyById', () => {
      it('should return a family when a valid id is provided', async () => {
        findFirstOrThrow_family.mockResolvedValue(mockFamily);
        const family = await _getFamilyById(ID);
        expect.assertions(2);
        expect(findFirstOrThrow_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it('should throw an error if family is not found', async () => {
        findFirstOrThrow_family.mockRejectedValue(new Error());
        await expect(_getFamilyById(ID)).rejects.toThrow();
      });
    });

    describe('getImmediateFamily', () => {
      it('should return a family when a valid id is provided', async () => {
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

    describe('updateFamily', () => {
      it('should update a family when a valid id is provided', async () => {
        update_family.mockResolvedValue(mockFamily);
        const family = await _updateFamily(ID, mockFamily);
        expect.assertions(2);
        expect(update_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it('should throw an error if family is not found', async () => {
        update_family.mockRejectedValue(new Error());
        await expect(_updateFamily(ID, mockFamily)).rejects.toThrow();
      });
    });

    describe('deleteFamily', () => {
      it('should delete a family when a valid id is provided', async () => {
        deleteFn_family.mockResolvedValue(mockFamily);
        const family = await _deleteFamily(ID);
        expect.assertions(2);
        expect(deleteFn_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it('should throw an error if family is not found', async () => {
        deleteFn_family.mockRejectedValue(new Error());
        await expect(_deleteFamily(ID)).rejects.toThrow();
      });
    });

    describe('getFamilyByLabel', () => {
      it('should return a family when a valid label is provided', async () => {
        findFirst_family.mockResolvedValue(mockFamily);
        const family = await _getFamilyByLabel(FAMILY_LABEL);
        expect.assertions(2);
        expect(findFirst_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
      it('should throw an error if family is not found', async () => {
        findFirst_family.mockRejectedValue(new Error());
        await expect(_getFamilyByLabel(FAMILY_LABEL)).rejects.toThrow();
      });
    });

    describe('getParentsOfCritterId', () => {
      it('should return a list of parents when a valid critter_id is provided', async () => {
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
      it('should throw an error on invalid critter_id', async () => {
        findMany_family_parent.mockRejectedValue(new Error());
        await expect(_getParentsOfCritterId(ID)).rejects.toThrow();
      });
    });

    describe('getChildrenOfCritterId', () => {
      it('should return a list of children when a valid critter_id is provided', async () => {
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
      it('should throw an error on invalid critter_id', async () => {
        findMany_family_child.mockRejectedValue(new Error());
        await expect(_getChildrenOfCritterId(ID)).rejects.toThrow();
      });
    });

    describe('getSiblingsOfCritterId', () => {
      it('should return a list of siblings when a valid critter id_is provided', async () => {
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
      it('should throw an error on invalid critter_id', async () => {
        findMany_family_child.mockRejectedValue(new Error());
        await expect(_getSiblingsOfCritterId(ID)).rejects.toThrow();
      });
    });

    describe('createNewFamily', () => {
      it('should create a new family', async () => {
        create_family.mockResolvedValue(mockFamily);
        const family = await _createNewFamily(FAMILY_LABEL);
        expect.assertions(2);
        expect(create_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
    });

    describe('makeParentOfFamily', () => {
      it('should add a parent to a family', async () => {
        create_family_parent.mockResolvedValue(mockFamilyParent);
        const parent = await _makeParentOfFamily(ID, ID);
        expect.assertions(2);
        expect(create_family_parent).toHaveBeenCalledTimes(1);
        expect(parent).toEqual(mockFamilyParent);
      });
    });

    describe('makeChildOfFamily', () => {
      it('should add a child to a family', async () => {
        create_family_child.mockResolvedValue(mockFamilyChild);
        const child = await _makeChildOfFamily(ID, ID);
        expect.assertions(2);
        expect(create_family_child).toHaveBeenCalledTimes(1);
        expect(child).toEqual(mockFamilyChild);
      });
    });

    describe('removeParentOfFamily', () => {
      it('should remove a parent from a family', async () => {
        deleteFn_family_parent.mockResolvedValue(mockFamilyParent);
        const parent = await _removeParentOfFamily(ID, ID);
        expect.assertions(2);
        expect(deleteFn_family_parent).toHaveBeenCalledTimes(1);
        expect(parent).toEqual(mockFamilyParent);
      });
    });

    describe('removeChildOfFamily', () => {
      it('should remove a child from a family', async () => {
        deleteFn_family_child.mockResolvedValue(mockFamilyChild);
        const child = await _removeChildOfFamily(ID, ID);
        expect.assertions(2);
        expect(deleteFn_family_child).toHaveBeenCalledTimes(1);
        expect(child).toEqual(mockFamilyChild);
      });
    });

    describe('deleteFamily', () => {
      it('should delete a family', async () => {
        deleteFn_family.mockResolvedValue(mockFamily);
        const family = await _deleteFamily(ID);
        expect.assertions(2);
        expect(deleteFn_family).toHaveBeenCalledTimes(1);
        expect(family).toEqual(mockFamily);
      });
    });
  });

  describe('ROUTERS', () => {
    describe('GET /api/family', () => {
      it('should return an array of families', async () => {
        getAllFamilies.mockResolvedValue([mockFamily]);
        const res = await request.get('/api/family');
        expect.assertions(3);
        expect(getAllFamilies).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([mockFamilyResponse]);
      });
    });

    describe('POST /api/family/create', () => {
      it('should create a new family', async () => {
        createNewFamily.mockResolvedValue(mockFamily);
        const res = await request
          .post('/api/family/create')
          .send({ family_label: FAMILY_LABEL, family_id: randomUUID() });
        expect.assertions(3);
        expect(createNewFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(201);
        expect(res.body).toEqual(mockFamilyResponse);
      });

      it('should return a 400 error if family_label is not provided', async () => {
        createNewFamily.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.post('/api/family/create');
        expect.assertions(2);
        expect(createNewFamily).toHaveBeenCalledTimes(0);
        expect(res.status).toEqual(400);
      });
    });

    describe('GET /api/family/children', () => {
      it('should return an array of children', async () => {
        getAllChildren.mockResolvedValue([mockFamilyChild]);
        const res = await request.get('/api/family/children');
        expect.assertions(3);
        expect(getAllChildren).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([mockFamilyChildResponse]);
      });
    });

    describe('GET /api/family/parents', () => {
      it('should return an array of parents', async () => {
        getAllParents.mockResolvedValue([mockFamilyParent]);
        const res = await request.get('/api/family/parents');
        expect.assertions(3);
        expect(getAllParents).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([mockFamilyParentResponse]);
      });
    });

    describe('GET /api/family/children/:id', () => {
      it('should return an array of children', async () => {
        getChildrenOfCritterId.mockResolvedValue([mockCritter]);
        const res = await request.get(`/api/family/children/${ID}`);
        expect.assertions(3);
        expect(getChildrenOfCritterId).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([mockCritterResponse]);
      });
    });

    describe('GET /api/family/parents/:id', () => {
      it('should return an array of parents', async () => {
        getParentsOfCritterId.mockResolvedValue([mockCritter]);
        const res = await request.get(`/api/family/parents/${ID}`);
        expect.assertions(3);
        expect(getParentsOfCritterId).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([mockCritterResponse]);
      });
    });

    describe('POST /api/family/parents', () => {
      it('should add a parent to a family', async () => {
        makeParentOfFamily.mockResolvedValue(mockFamilyParent);
        const res = await request.post('/api/family/parents').send({ family_id: ID, parent_critter_id: ID });
        expect.assertions(3);
        expect(makeParentOfFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(201);
        expect(res.body).toEqual(mockFamilyParentResponse);
      });

      it('should return a 400 error if data is invalid', async () => {
        makeParentOfFamily.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.post('/api/family/parents');
        expect.assertions(2);
        expect(makeParentOfFamily).toHaveBeenCalledTimes(0);
        expect(res.status).toEqual(400);
      });
    });

    describe('DELETE /api/family/parents', () => {
      it('should remove a parent from a family', async () => {
        removeParentOfFamily.mockResolvedValue(mockFamilyParent);
        const res = await request.delete('/api/family/parents').send({ family_id: ID, parent_critter_id: ID });
        expect.assertions(3);
        expect(removeParentOfFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockFamilyParentResponse);
      });

      it('should return a 400 error if data is invalid', async () => {
        removeParentOfFamily.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.delete('/api/family/parents');
        expect.assertions(2);
        expect(removeParentOfFamily).toHaveBeenCalledTimes(0);
        expect(res.status).toEqual(400);
      });
    });

    describe('POST /api/family/children', () => {
      it('should add a child to a family', async () => {
        makeChildOfFamily.mockResolvedValue(mockFamilyChild);
        const res = await request.post('/api/family/children').send({ family_id: ID, child_critter_id: ID });
        expect.assertions(3);
        expect(makeChildOfFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(201);
        expect(res.body).toEqual(mockFamilyChildResponse);
      });

      it('should return a 400 error if data is invalid', async () => {
        makeChildOfFamily.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.post('/api/family/children');
        expect.assertions(2);
        expect(makeChildOfFamily).toHaveBeenCalledTimes(0);
        expect(res.status).toEqual(400);
      });
    });

    describe('DELETE /api/family/children', () => {
      it('should remove a child from a family', async () => {
        removeChildOfFamily.mockResolvedValue(mockFamilyChild);
        const res = await request.delete('/api/family/children').send({ family_id: ID, child_critter_id: ID });
        expect.assertions(3);
        expect(removeChildOfFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockFamilyChildResponse);
      });

      it('should return a 400 error if data is invalid', async () => {
        removeChildOfFamily.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.delete('/api/family/children');
        expect.assertions(2);
        expect(removeChildOfFamily).toHaveBeenCalledTimes(0);
        expect(res.status).toEqual(400);
      });
    });

    describe('GET /api/family/immediate/:id', () => {
      it('should return an immediate family object', async () => {
        getParentsOfCritterId.mockResolvedValue([mockCritter]);
        getChildrenOfCritterId.mockResolvedValue([mockCritter]);
        getSiblingsOfCritterId.mockResolvedValue([mockCritter]);
        const res = await request.get(`/api/family/immediate/${ID}`);
        expect.assertions(5);
        expect(getParentsOfCritterId).toHaveBeenCalledTimes(1);
        expect(getChildrenOfCritterId).toHaveBeenCalledTimes(1);
        expect(getSiblingsOfCritterId).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockImmediateFamilyCritterResponse);
      });
    });

    describe('GET /api/family/:id', () => {
      it('should return the family when a valid id is provided', async () => {
        getImmediateFamily.mockResolvedValue(mockImmediateFamily);
        const res = await request.get(`/api/family/${ID}`);
        expect.assertions(3);
        expect(getImmediateFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockImmediateFamilyResponse);
      });

      it('should return a 404 error when an invalid id is provided', async () => {
        findUniqueOrThrow_family.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.get(`/api/family/${ID}`);
        expect.assertions(3);
        expect(getImmediateFamily).toHaveBeenCalledTimes(0);
        expect(findUniqueOrThrow_family).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(404);
      });
    });

    describe('PATCH /api/family/:id', () => {
      it('should update a family', async () => {
        updateFamily.mockResolvedValue(mockFamily);
        const res = await request.patch(`/api/family/${ID}`).send({ family_label: FAMILY_LABEL });
        expect.assertions(3);
        expect(updateFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockFamilyResponse);
      });

      it('should return a 400 error if data is invalid', async () => {
        const res = await request.patch(`/api/family/${ID}`);
        expect.assertions(2);
        expect(updateFamily).toHaveBeenCalledTimes(0);
        expect(res.status).toEqual(400);
      });
    });

    describe('DELETE /api/family/:id', () => {
      it('should delete a family', async () => {
        deleteFamily.mockResolvedValue(mockFamily);
        const res = await request.delete(`/api/family/${ID}`);
        expect.assertions(3);
        expect(deleteFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockFamilyResponse);
      });

      it('should return a 404 error if id is invalid', async () => {
        deleteFamily.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.delete(`/api/family/${ID}`);
        expect.assertions(2);
        expect(deleteFamily).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(404);
      });
    });

    describe('GET /api/family/label/:label', () => {
      it('should return a family when a valid label is provided', async () => {
        getFamilyByLabel.mockResolvedValue(mockFamily);
        const res = await request.get(`/api/family/label/${FAMILY_LABEL}`);
        expect.assertions(3);
        expect(getFamilyByLabel).toHaveBeenCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockFamilyResponse);
      });
    });
  });
});
