import { prisma } from "../../utils/constants";
import { capture } from "@prisma/client";
import { CaptureCreate, captureInclude, CaptureUpdate, FormattedCapture } from "./capture.utils";

const getAllCaptures = async (): Promise<capture[]> => {
  return await prisma.capture.findMany({
    ...captureInclude,
  });
};

const getCaptureById = async (capture_id: string): Promise<capture | null> => {
  const capture =  await prisma.capture.findUniqueOrThrow({
    ...captureInclude,
    where: {
      capture_id: capture_id,
    },
  });
  return capture;
}

const getCaptureByCritter = async (critter_id: string): Promise<capture[] | null> => {
  await prisma.critter.findUniqueOrThrow({
    where: {
      critter_id: critter_id
    }
  })

  const captures = await prisma.capture.findMany({
    ...captureInclude,
    where: {
      critter_id: critter_id,
    },
  });

  return captures;
}

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
