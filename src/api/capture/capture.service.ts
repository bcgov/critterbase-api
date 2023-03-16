import { prisma } from "../../utils/constants";
import type { capture } from "@prisma/client";
import { apiError } from "../../utils/types";

const getAllCaptures = async (): Promise<capture[]> => {
  return await prisma.capture.findMany();
};

const getCaptureById = async (capture_id: string): Promise<capture | null> => {
  return await prisma.capture.findUnique({
    include: {
      location_capture_capture_location_idTolocation: {
        select: {
          latitude: true,
          longitude: true,
        }
      },
      location_capture_release_location_idTolocation: {
        select: {
          latitude: true,
          longitude: true
        }
      }
    },
    where: {
      capture_id: capture_id
    }
  })
}

const getCaptureByCritter = async (critter_id: string): Promise<capture[] | null> => {
  return await prisma.capture.findMany({
    where: {
      critter_id: critter_id
    }
  })
}

const createCapture = async (capture_data: any): Promise<capture | null> => {
  if(capture_data.critter_id) {
    const exists = await prisma.capture.findUnique({
      where: {
        capture_id: capture_data.critter_id
      }
    })
    if(exists) {
      throw apiError.serverIssue();
    }
  }

  return await prisma.capture.create({
    data: capture_data
  })
}

const updateCapture = async (capture_id: string, capture_data: any): Promise<capture | null> => {
  return await prisma.capture.update({
    data: capture_data,
    where: {
      capture_id: capture_id
    }
  })
}

const deleteCapture = async (capture_id: string): Promise<capture | null> => {
  return await prisma.capture.delete({
    where: {
      capture_id: capture_id
    }
  })
}

export { getAllCaptures, getCaptureById, getCaptureByCritter, updateCapture };
