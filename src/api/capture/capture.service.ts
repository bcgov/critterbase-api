import { capture } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { CaptureCreate, captureInclude, CaptureUpdate } from "./capture.utils";
import { randomUUID } from "crypto";

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
): Promise<capture[] | null> => {
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
  capture_data: CaptureUpdate
): Promise<capture | null> => {
  return await prisma.capture.update({
    data: capture_data,
    where: {
      capture_id: capture_id,
    },
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
