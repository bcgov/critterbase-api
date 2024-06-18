import { artifact } from '@prisma/client';
import { Buffer } from 'buffer';
import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { prisma } from '../../utils/constants';
import { ICbDatabase } from '../../utils/database';
import { apiError } from '../../utils/types';
import {
  createArtifact as _createArtifact,
  deleteArtifact as _deleteArtifact,
  getAllArtifacts as _getAllArtifacts,
  getArtifactById as _getArtifactById,
  getArtifactsByCritterId as _getArtifactsByCritterId,
  updateArtifact as _updateArtifact
} from './artifact.service';
import { ArtifactCreate, ArtifactResponse, ArtifactUpdate, artifactSchema } from './artifact.utils';

// Mock Artifact
const ID = randomUUID();
const CRITTER_ID = randomUUID();
const URL = 'https://example.com/artifact';

const NEW_ARTIFACT: ArtifactCreate = {
  critter_id: CRITTER_ID
};

const PRISMA_ARTIFACT: artifact = {
  ...NEW_ARTIFACT,
  artifact_id: ID,
  artifact_url: URL,
  artifact_comment: null,
  capture_id: null,
  mortality_id: null,
  measurement_qualitative: null,
  measurement_quantitative: null,
  create_user: ID,
  update_user: ID,
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const RETURN_ARTIFACT: ArtifactResponse = {
  ...PRISMA_ARTIFACT,
  signed_url: URL
};

const MOCK_FILE = Buffer.from('This is a mock file');

// Mocked Prisma Calls
const create = jest.spyOn(prisma.artifact, 'create').mockImplementation();
const findMany = jest.spyOn(prisma.artifact, 'findMany').mockImplementation();
const findUniqueOrThrow = jest.spyOn(prisma.artifact, 'findUniqueOrThrow').mockImplementation();
const update = jest.spyOn(prisma.artifact, 'update').mockImplementation();
const pDelete = jest.spyOn(prisma.artifact, 'delete').mockImplementation();
const object_store = require('../../utils/object_store');
const uploadFileToS3 = jest.spyOn(object_store, 'uploadFileToS3').mockImplementation();
const getFileDownloadUrl = jest.spyOn(object_store, 'getFileDownloadUrl').mockImplementation();

// Mocked Services
const getArtifactById = jest.fn();
const getArtifactsByCritterId = jest.fn();
const getAllArtifacts = jest.fn();
const updateArtifact = jest.fn();
const createArtifact = jest.fn();
const deleteArtifact = jest.fn();
const getCritterById = jest.fn();

const request = supertest(
  makeApp({
    getArtifactById,
    getArtifactsByCritterId,
    getAllArtifacts,
    updateArtifact,
    createArtifact,
    deleteArtifact,
    getCritterById,
    critterService: { getCritterById }
  } as unknown as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  // Reset mocked services
  getArtifactById.mockReset();
  getArtifactsByCritterId.mockReset();
  getAllArtifacts.mockReset();
  updateArtifact.mockReset();
  createArtifact.mockReset();
  deleteArtifact.mockReset();
  getCritterById.mockReset();

  // Set default returns
  getAllArtifacts.mockResolvedValue([RETURN_ARTIFACT]);
  createArtifact.mockResolvedValue(RETURN_ARTIFACT);
  getArtifactById.mockResolvedValue(RETURN_ARTIFACT);
  getArtifactsByCritterId.mockResolvedValue([RETURN_ARTIFACT]);
  uploadFileToS3.mockResolvedValue(`${ID}.png`);
  getFileDownloadUrl.mockResolvedValue(URL);
});
describe('API: Artifact', () => {
  describe('SERVICES', () => {
    describe('createArtifact()', () => {
      it('returns an artifact', async () => {
        create.mockResolvedValue(PRISMA_ARTIFACT);
        const returnedArtifact = await _createArtifact(NEW_ARTIFACT, MOCK_FILE as unknown as Express.Multer.File);
        expect.assertions(4);
        expect(uploadFileToS3).toHaveBeenCalledTimes(1);
        expect(getFileDownloadUrl).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.create).toHaveBeenCalledTimes(1);
        expect(artifactSchema.safeParse(returnedArtifact).success).toBe(true);
      });
    });

    describe('getArtifactsByCritterId()', () => {
      it('returns a list of artifacts', async () => {
        findMany.mockResolvedValue([PRISMA_ARTIFACT]);
        const returnedArtifacts = await _getArtifactsByCritterId(CRITTER_ID);
        expect.assertions(4);
        expect(getFileDownloadUrl).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.findMany).toHaveBeenCalledTimes(1);
        expect(returnedArtifacts).toBeInstanceOf(Array);
        expect(returnedArtifacts.length).toBe(1);
      });
    });

    describe('getAllArtifacts()', () => {
      it('returns a list of all artifacts', async () => {
        findMany.mockResolvedValue([PRISMA_ARTIFACT]);
        const returnedArtifacts = await _getAllArtifacts();
        expect.assertions(4);
        expect(getFileDownloadUrl).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.findMany).toHaveBeenCalledTimes(1);
        expect(returnedArtifacts).toBeInstanceOf(Array);
        expect(returnedArtifacts.length).toBe(1);
      });
    });

    describe('getArtifactById()', () => {
      it('returns an artifact by ID', async () => {
        findUniqueOrThrow.mockResolvedValue(PRISMA_ARTIFACT);
        const returnedArtifact = await _getArtifactById(ID);
        expect.assertions(3);
        expect(getFileDownloadUrl).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.findUniqueOrThrow).toHaveBeenCalledTimes(1);
        expect(artifactSchema.safeParse(returnedArtifact).success).toBe(true);
      });
    });

    describe('updateArtifact()', () => {
      it('returns an updated artifact', async () => {
        const UPDATED_ARTIFACT: ArtifactUpdate = {
          critter_id: ID
        };
        update.mockResolvedValue({ ...PRISMA_ARTIFACT, ...UPDATED_ARTIFACT });
        const returnedArtifact = await _updateArtifact(ID, UPDATED_ARTIFACT);
        expect.assertions(4);
        expect(getFileDownloadUrl).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.update).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.update).toHaveBeenCalledWith({
          where: { artifact_id: ID },
          data: UPDATED_ARTIFACT
        });
        expect(artifactSchema.safeParse(returnedArtifact).success).toBe(true);
      });
    });

    describe('deleteArtifact()', () => {
      it('returns deleted artifact and removes artifact from database', async () => {
        pDelete.mockResolvedValue(PRISMA_ARTIFACT);
        const deletedArtifact = await _deleteArtifact(ID);
        expect.assertions(3);
        expect(prisma.artifact.delete).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.delete).toHaveBeenCalledWith({
          where: { artifact_id: ID }
        });
        expect(artifactSchema.safeParse(deletedArtifact).success).toBe(true);
      });
    });
  });

  describe('ROUTERS', () => {
    describe('GET /api/artifacts', () => {
      it('returns status 200', async () => {
        const res = await request.get('/api/artifacts');
        expect.assertions(2);
        expect(getAllArtifacts.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns an array', async () => {
        const res = await request.get('/api/artifacts');
        expect.assertions(2);
        expect(getAllArtifacts.mock.calls.length).toBe(1);
        expect(res.body).toBeInstanceOf(Array);
      });

      it('returns artifacts with correct properties', async () => {
        const res = await request.get('/api/artifacts');
        const artifacts = res.body;
        expect.assertions(2);
        expect(getAllArtifacts.mock.calls.length).toBe(1);
        for (const artifact of artifacts) {
          expect(artifactSchema.safeParse(artifact).success).toBe(true);
        }
      });
    });

    describe('POST /api/artifacts/create', () => {
      it('returns and artifact record with status 201', async () => {
        const res = await request
          .post('/api/artifacts/create')
          .attach('artifact', MOCK_FILE, 'test.png')
          .field('critter_id', CRITTER_ID);
        expect.assertions(3);
        expect(createArtifact.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
        expect(artifactSchema.safeParse(res.body).success).toBe(true);
      });

      it('strips invalid fields from data', async () => {
        const res = await request
          .post('/api/artifacts/create')
          .attach('artifact', MOCK_FILE, 'test.png')
          .field('critter_id', CRITTER_ID)
          .field('invalidField', 'qwerty123');
        expect.assertions(3);
        expect(createArtifact.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty('invalidField');
      });

      it('returns status 400 when data is missing attached file', async () => {
        const res = await request.post('/api/artifacts/create').send({
          CRITTER_ID: ID
        });
        expect.assertions(3);
        expect(createArtifact.mock.calls.length).toBe(0);
        expect(uploadFileToS3).toBeCalledTimes(0);
        expect(res.status).toBe(400);
      });

      it('returns status 400 when data is missing required fields', async () => {
        const res = await request.post('/api/artifacts/create').field('artifact_id', ID);
        expect.assertions(2);
        expect(createArtifact.mock.calls.length).toBe(0);
        expect(res.status).toBe(400);
      });
    });

    describe('GET /api/artifacts/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        getArtifactById.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.get(`/api/artifacts/${ID}`);
        expect.assertions(2);
        expect(getArtifactById.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 200', async () => {
        const res = await request.get(`/api/artifacts/${ID}`);
        expect.assertions(2);
        expect(getArtifactById.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns an artifact', async () => {
        const res = await request.get(`/api/artifacts/${ID}`);
        expect.assertions(2);
        expect(getArtifactById.mock.calls.length).toBe(1);
        expect(artifactSchema.safeParse(res.body).success).toBe(true);
      });
    });

    describe('PATCH /api/artifacts/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        updateArtifact.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.patch(`/api/artifacts/${ID}`).send(NEW_ARTIFACT);
        expect.assertions(2);
        expect(updateArtifact.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 400 when paramaters are invalid', async () => {
        updateArtifact.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.patch(`/api/artifacts/${ID}`);
        expect.assertions(2);
        expect(updateArtifact.mock.calls.length).toBe(0);
        expect(res.status).toBe(400);
      });

      it('returns status 200', async () => {
        updateArtifact.mockResolvedValue(RETURN_ARTIFACT);
        const res = await request.patch(`/api/artifacts/${ID}`).send(NEW_ARTIFACT);
        expect.assertions(2);
        expect(updateArtifact.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns an artifact', async () => {
        updateArtifact.mockResolvedValue(RETURN_ARTIFACT);
        const res = await request.patch(`/api/artifacts/${ID}`).send(NEW_ARTIFACT);
        expect.assertions(2);
        expect(updateArtifact.mock.calls.length).toBe(1);
        expect(artifactSchema.safeParse(res.body).success).toBe(true);
      });
    });

    describe('DELETE /api/artifacts/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        deleteArtifact.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.delete(`/api/artifacts/${ID}`);
        expect.assertions(2);
        expect(deleteArtifact.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 200', async () => {
        deleteArtifact.mockResolvedValue(RETURN_ARTIFACT);
        const res = await request.delete(`/api/artifacts/${ID}`);
        expect.assertions(2);
        expect(deleteArtifact.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });
    });

    describe('GET /api/artifacts/critter/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        getCritterById.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.get(`/api/artifacts/critter/${ID}`);
        expect.assertions(3);
        expect(getCritterById.mock.calls.length).toBe(1);
        expect(getArtifactsByCritterId.mock.calls.length).toBe(0);
        expect(res.status).toBe(404);
      });

      it('returns status 200', async () => {
        const res = await request.get(`/api/artifacts/critter/${ID}`);
        expect.assertions(2);
        expect(getArtifactsByCritterId.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns an array of artifacts', async () => {
        const res = await request.get(`/api/artifacts/critter/${ID}`);
        expect.assertions(2);
        expect(getArtifactsByCritterId.mock.calls.length).toBe(1);
        expect(res.body).toBeInstanceOf(Array);
      });

      it('returns artifacts with correct properties', async () => {
        const res = await request.get(`/api/artifacts/critter/${ID}`);
        const artifacts = res.body;
        expect.assertions(2);
        expect(getArtifactsByCritterId.mock.calls.length).toBe(1);
        for (const artifact of artifacts) {
          expect(artifactSchema.safeParse(artifact).success).toBe(true);
        }
      });
    });
  });
});
