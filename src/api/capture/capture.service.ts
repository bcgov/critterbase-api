import { capture } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { CaptureCreate, captureInclude, CaptureUpdate } from "./capture.utils";
import { PrismaTransactionClient } from "../../utils/types";

const getAllCaptures = async (): Promise<capture[]> => {
  return await prisma.capture.findMany({
    ...captureInclude,
  });
};

const getCaptureById = async (capture_id: string): Promise<capture | null> => {
  const capture = await prisma.capture.findUniqueOrThrow({
    ...captureInclude,
    where: {
      capture_id: capture_id,
    },
  });
  return capture;
};

const getCaptureByCritter = async (
  critter_id: string
): Promise<capture[]> => {
  await prisma.critter.findUniqueOrThrow({
    where: {
      critter_id: critter_id,
    },
  });

  const captures = await prisma.capture.findMany({
    ...captureInclude,
    where: {
      critter_id: critter_id,
    },
  });

  return captures;
};

const createCapture = async (capture_data: CaptureCreate) => {
  const {
    critter_id,
    capture_location_id,
    release_location_id,
    capture_location,
    release_location,
    ...rest
  } = capture_data;

  return await prisma.capture.create({
    data: {
      critter: { connect: { critter_id } },
      location_capture_capture_location_idTolocation: capture_location_id
        ? {
            connect: { location_id: capture_location_id },
          }
        : capture_location
        ? { create: capture_location }
        : undefined,
      location_capture_release_location_idTolocation: release_location_id
        ? {
            connect: { location_id: release_location_id },
          }
        : release_location
        ? { create: release_location }
        : undefined,
      ...rest,
    },
  });
};

const updateCapture = async (
  capture_id: string,
  capture_data: CaptureUpdate,
  prismaOverride?: PrismaTransactionClient
): Promise<capture | null> => {
  const { capture_location, release_location, critter_id, capture_location_id, release_location_id, force_create_release, ...rest } = capture_data;
  const c_upsertBody = {create: {}, update: {}};
  const r_upsertBody = {create: {}, update: {}};
  if(capture_location) {
      const {location_id, ...others} = capture_location;
      c_upsertBody.create = {...others};
      c_upsertBody.update = {location_id, ...others};
  }
  if(release_location) {
      const {location_id, ...others} = release_location;
      r_upsertBody.create = {...others};
      r_upsertBody.update = {location_id, ...others};
  }

  const client = prismaOverride ?? prisma;

  return await client.capture.update({
      where: { capture_id: capture_id },
      data: {
          location_capture_capture_location_idTolocation: capture_location ? {
              upsert: c_upsertBody
          } : undefined,
          location_capture_release_location_idTolocation: release_location ? 
          (force_create_release 
          ? 
          {
              create: r_upsertBody.create
          } : {
              upsert: r_upsertBody
          }) : undefined,
          ...rest
      }
  });
};

const deleteCapture = async (capture_id: string): Promise<capture | null> => {
  return await prisma.capture.delete({
    where: {
      capture_id: capture_id,
    },
  });
};

export {
  getAllCaptures,
  getCaptureById,
  getCaptureByCritter,
  updateCapture,
  createCapture,
  deleteCapture,
};
