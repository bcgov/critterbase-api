import { capture, critter, critter_collection_unit, location, marking, mortality } from '@prisma/client';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { prisma } from '../../utils/constants';
import { PrismaTransactionClient, apiError } from '../../utils/types';
import {
  bulkCreateData as _bulkCreateData,
  bulkDeleteData as _bulkDeleteData,
  bulkUpdateData as _bulkUpdateData,
  bulkErrMap
} from './bulk.service';

const bulkCreateData = jest.fn();
const bulkUpdateData = jest.fn();
const bulkDeleteData = jest.fn();
const updateCapture = jest.fn();
const updateMortality = jest.fn();
const appendEnglishTaxonAsUUID = jest.fn();
const appendEnglishMarkingsAsUUID = jest.fn();
const appendDefaultCOD = jest.fn();
const deleteMarking = jest.fn();
const deleteCollectionUnit = jest.fn();
const patchTsnAndScientificName = jest.fn();
const deleteMultipleCaptures = jest.fn().mockResolvedValue({ count: 1 });

const db: any = {
  bulkCreateData,
  bulkUpdateData,
  bulkDeleteData,
  updateMortality,
  appendEnglishTaxonAsUUID,
  appendEnglishMarkingsAsUUID,
  deleteMarking,
  deleteCollectionUnit,
  itisService: { patchTsnAndScientificName },
  mortalityService: { appendDefaultCOD, updateMortality },
  captureService: { updateCapture, deleteMultipleCaptures }
};

const request = supertest(makeApp(db));

const CRITTER_ID = '11084b96-5cbd-421e-8106-511ecfb51f7a';
const OTHER_CRITTER_ID = '27e2b7c9-2754-4286-9eb9-fd4f0a8378ef';
const WLH_ID = '12-1234';
const CRITTER: critter = {
  itis_tsn: 1,
  itis_scientific_name: 'alces',
  critter_id: CRITTER_ID,
  wlh_id: WLH_ID,
  animal_id: 'A13',
  sex: 'Male',
  responsible_region_nr_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date(),
  critter_comment: 'Hi :)'
};

const MARKING: marking = {
  marking_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  critter_id: CRITTER_ID,
  capture_id: null,
  mortality_id: null,
  taxon_marking_body_location_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  marking_type_id: null,
  marking_material_id: null,
  primary_colour_id: null,
  secondary_colour_id: null,
  text_colour_id: null,
  identifier: null,
  frequency: null,
  frequency_unit: null,
  order: null,
  comment: null,
  attached_timestamp: new Date(),
  removed_timestamp: null,
  create_user: '',
  update_user: '',
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const CAPTURE: capture = {
  capture_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  critter_id: CRITTER_ID,
  capture_method_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  capture_location_id: null,
  release_location_id: null,
  capture_date: new Date(),
  capture_time: new Date(),
  release_date: null,
  release_time: null,
  capture_comment: null,
  release_comment: null,
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const MORTALITY: mortality = {
  mortality_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  critter_id: CRITTER_ID,
  location_id: null,
  mortality_timestamp: new Date(),
  proximate_cause_of_death_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  proximate_cause_of_death_confidence: null,
  proximate_predated_by_itis_tsn: null,
  ultimate_cause_of_death_id: null,
  ultimate_cause_of_death_confidence: null,
  ultimate_predated_by_itis_tsn: null,
  mortality_comment: null,
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const COLLECTION: critter_collection_unit = {
  critter_collection_unit_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  critter_id: CRITTER_ID,
  collection_unit_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const LOCATION: location = {
  location_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  latitude: 2,
  longitude: 2,
  coordinate_uncertainty: null,
  coordinate_uncertainty_unit: null,
  wmu_id: null,
  region_nr_id: null,
  region_env_id: null,
  elevation: null,
  temperature: null,
  location_comment: null,
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const prismaMock = {
  critter: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    update: jest.fn()
  },
  capture: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
  mortality: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
  marking: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    delete: jest.fn(),
    update: jest.fn(),
    create: jest.fn()
  },
  location: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    delete: jest.fn(),
    update: jest.fn()
  },
  critter_collection_unit: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    create: jest.fn(),
    update: jest.fn()
  },
  measurement_quantitative: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  measurement_qualitative: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  family: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  family_child: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  family_parent: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  }
};
jest
  .spyOn(prisma, '$transaction')
  .mockImplementation((callback) => callback(prismaMock as unknown as PrismaTransactionClient));

describe('API: Bulk', () => {
  describe('SERVICES', () => {
    describe('bulkCreateData()', () => {
      it('should insert critters, collections, locations, captures, mortalityies, markings', async () => {
        prismaMock.critter.createMany.mockResolvedValue({ count: 1 });
        prismaMock.capture.createMany.mockResolvedValue({ count: 1 });
        prismaMock.mortality.createMany.mockResolvedValue({ count: 1 });
        prismaMock.location.createMany.mockResolvedValue({ count: 1 });
        prismaMock.marking.createMany.mockResolvedValue({ count: 1 });
        prismaMock.critter_collection_unit.createMany.mockResolvedValue({
          count: 1
        });
        prismaMock.measurement_qualitative.createMany.mockResolvedValue({
          count: 1
        });
        const result = await _bulkCreateData({
          critters: [CRITTER],
          collections: [COLLECTION],
          locations: [LOCATION],
          captures: [CAPTURE],
          mortalities: [MORTALITY],
          markings: [MARKING],
          quantitative_measurements: [],
          qualitative_measurements: [],
          families: [],
          family_parents: [],
          family_children: []
        });
        expect.assertions(6);
        expect(prismaMock.critter.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.capture.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.mortality.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.location.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.marking.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.critter_collection_unit.createMany.mock.calls.length).toBe(1);
      });
    });

    describe('bulkUpdateData()', () => {
      it('should update critters, collections, locations, captures, mortalityies, markings', async () => {
        prismaMock.critter.update.mockResolvedValue(CRITTER);
        prismaMock.marking.update.mockResolvedValue(MARKING);
        prismaMock.location.update.mockResolvedValue(LOCATION);
        prismaMock.critter_collection_unit.update.mockResolvedValue(COLLECTION);
        updateCapture.mockResolvedValue(CAPTURE);
        updateMortality.mockResolvedValue(MORTALITY);

        const result = await _bulkUpdateData(
          {
            critters: [CRITTER],
            collections: [COLLECTION],
            locations: [LOCATION],
            captures: [CAPTURE],
            mortalities: [MORTALITY],
            markings: [MARKING],
            qualitative_measurements: [],
            quantitative_measurements: []
          },
          db
        );

        expect.assertions(6);
        expect(prismaMock.critter.update.mock.calls.length).toBe(1);
        expect(prismaMock.marking.update.mock.calls.length).toBe(1);
        expect(prismaMock.location.update.mock.calls.length).toBe(1);
        expect(prismaMock.critter_collection_unit.update.mock.calls.length).toBe(1);
        expect(updateCapture.mock.calls.length).toBe(1);
        expect(updateMortality.mock.calls.length).toBe(1);
      });
      it('should error out on missing capture id', async () => {
        expect.assertions(1);
        await expect(
          async () =>
            await _bulkUpdateData(
              {
                critters: [],
                collections: [],
                locations: [],
                mortalities: [],
                markings: [],
                captures: [{ capture_comment: 'a' }],
                qualitative_measurements: [],
                quantitative_measurements: []
              },
              db
            )
        ).rejects.toThrow(apiError.requiredProperty('capture_id'));
      });
      it('should error out on missing mortality id', async () => {
        expect.assertions(1);
        await expect(
          async () =>
            await _bulkUpdateData(
              {
                critters: [],
                collections: [],
                locations: [],
                mortalities: [{ mortality_comment: 'a' }],
                markings: [],
                captures: [],
                qualitative_measurements: [],
                quantitative_measurements: []
              },
              db
            )
        ).rejects.toThrow(apiError.requiredProperty('mortality_id'));
      });
      it('should create marking instead of update marking if id is missing', async () => {
        expect.assertions(1);
        prismaMock.marking.create.mockResolvedValue(MARKING);
        await _bulkUpdateData(
          {
            critters: [],
            collections: [],
            locations: [],
            mortalities: [],
            markings: [
              {
                critter_id: '98f9fede-95fc-4321-9444-7c2742e336fe',
                taxon_marking_body_location_id: '98f9fede-95fc-4321-9444-7c2742e336fe'
              }
            ],
            captures: [],
            qualitative_measurements: [],
            quantitative_measurements: []
          },
          db
        );
        expect(prismaMock.marking.create.mock.calls.length).toBe(1);
      });
      it('should delete marking if included in _deleteMarkings', async () => {
        expect.assertions(2);
        prismaMock.marking.delete.mockResolvedValue(MARKING);

        await _bulkDeleteData(
          {
            _deleteMarkings: [
              {
                marking_id: '98f9fede-95fc-4321-9444-7c2742e336fe',
                _delete: true
              }
            ],
            _deleteUnits: [
              {
                critter_collection_unit_id: '98f9fede-95fc-4321-9444-7c2742e336fe',
                _delete: true
              }
            ],
            _deleteCaptures: [],
            _deleteMoralities: [],
            _deleteQuant: [],
            _deleteQual: [],
            _deleteParents: [],
            _deleteChildren: []
          },
          db
        );
        expect(deleteMarking.mock.calls.length).toBe(1);
        expect(deleteCollectionUnit.mock.calls.length).toBe(1);
      });
      it('should create a new collection unit when a critter_id is provided but no primary key', async () => {
        expect.assertions(1);
        await _bulkUpdateData(
          {
            critters: [],
            collections: [
              {
                critter_id: CRITTER_ID,
                collection_unit_id: '98f9fede-95fc-4321-9444-7c2742e336fe'
              }
            ],
            locations: [],
            mortalities: [],
            markings: [],
            captures: [],
            qualitative_measurements: [],
            quantitative_measurements: []
          },
          db
        );
        expect(prismaMock.critter_collection_unit.create.mock.calls.length).toBe(1);
      });
    });

    describe('bulkErrMap()', () => {
      it('should return a formatted error message', () => {
        const msg = bulkErrMap(
          {
            code: 'invalid_type',
            path: ['string'],
            expected: 'string',
            received: 'number'
          },
          {
            defaultError: '',
            data: undefined
          },
          'critters'
        );
        expect.assertions(1);
        expect(typeof msg.message).toBe('string');
      });
    });
  });

  describe('ROUTER', () => {
    describe('POST /api/bulk', () => {
      it('should return status 201', async () => {
        appendEnglishTaxonAsUUID.mockResolvedValue({ ...CRITTER });
        appendEnglishMarkingsAsUUID.mockResolvedValue({ ...MARKING });
        appendDefaultCOD.mockResolvedValue({ ...MORTALITY });
        patchTsnAndScientificName.mockResolvedValue({
          ...CRITTER,
          itis_scientific_name: 'Biggus Moosus'
        });
        const body = {
          critters: [{ critter_id: CRITTER_ID, animal_id: 'steve', sex: 'Male', itis_tsn: 123456 }],
          collections: [COLLECTION],
          locations: [LOCATION],
          captures: [
            {
              capture_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
              critter_id: CRITTER_ID,
              capture_method_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
              capture_date: new Date()
            }
          ],
          mortalities: [MORTALITY],
          markings: [MARKING],
          quantitative_measurements: [],
          qualitative_measurements: [],
          families: { families: [], parents: [], children: [] }
        };
        const res = await request.post('/api/bulk').send(body);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });
      it('should return status 201', async () => {
        const body = {};
        const res = await request.post('/api/bulk').send(body);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });
    });
    describe('PATCH /api/bulk', () => {
      it('should return status 200', async () => {
        const body = {
          critters: [{ critter_id: CRITTER_ID, animal_id: 'steve', sex: 'Male', itis_tsn: 123456 }],
          collections: [COLLECTION],
          locations: [LOCATION],
          captures: [
            {
              capture_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
              critter_id: CRITTER_ID,
              capture_method_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
              capture_date: new Date()
            }
          ],
          mortalities: [MORTALITY],
          markings: [MARKING],
          quantitative_measurements: [],
          qualitative_measurements: [],
          families: { families: [], parents: [], children: [] }
        };
        const res = await request.patch('/api/bulk').send(body);

        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it('should return status 200', async () => {
        const body = {};
        const res = await request.patch('/api/bulk').send(body);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it('should return status 400, trigger errors', async () => {
        expect.assertions(6);
        const body = {
          critters: [{ critter_id: 2 }]
        };
        let res = await request.patch('/api/bulk').send(body);
        expect(res.status).toBe(400);

        const body2 = {
          collections: [{ critter_id: 2 }]
        };
        res = await request.patch('/api/bulk').send(body2);
        expect(res.status).toBe(400);

        const body3 = {
          locations: [{ location_id: 2 }]
        };
        res = await request.patch('/api/bulk').send(body3);
        expect(res.status).toBe(400);

        const body4 = {
          captures: [{ capture_id: 2 }]
        };
        res = await request.patch('/api/bulk').send(body4);
        expect(res.status).toBe(400);

        const body5 = {
          mortalities: [{ mortality_id: 2 }]
        };
        res = await request.patch('/api/bulk').send(body5);
        expect(res.status).toBe(400);

        const body6 = {
          mortalities: [{ mortality_id: 2 }]
        };
        res = await request.patch('/api/bulk').send(body6);
        expect(res.status).toBe(400);
      });
    });
  });
});
