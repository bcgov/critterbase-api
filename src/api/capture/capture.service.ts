import { capture } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { CaptureCreate, captureInclude, CaptureUpdate } from "./capture.utils";

const getAllCaptures = async (): Promise<capture[]> => {
  return await prisma.capture.findMany({
    include: captureInclude,
  });
};

const getCaptureById = async (capture_id: string) => {
  const capture = await prisma.capture.findUniqueOrThrow({
    where: {
      capture_id: capture_id,
    },
    include: captureInclude,
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
    where: {
      critter_id: critter_id,
    },
    include: captureInclude,
  });

  return captures;
};

const createCapture = async (
  capture_data: CaptureCreate
): Promise<capture | null> => {
  return await prisma.capture.create({
    data: capture_data,
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
