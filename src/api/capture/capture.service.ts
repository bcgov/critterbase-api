import { prisma } from "../../utils/constants";
import { capture, Prisma } from "@prisma/client";
import { apiError } from "../../utils/types";
import { CaptureCreate, captureInclude, CaptureIncludeType, CaptureResponseSchema, FormattedCapture } from "./capture.types";
import { exclude } from "../../utils/helper_functions";
import { FormattedLocation } from "../location/location.types";
import { formatLocation } from "../location/location.service";

/*const formatCapture = (capture: CaptureIncludeType) => {
  let obj: FormattedCapture = {...capture};
  if(capture.location_capture_capture_location_idTolocation) {
    obj = {
      ...capture, 
      capture_location: formatLocation(capture.location_capture_capture_location_idTolocation)
    }
  }
  if(capture.location_capture_release_location_idTolocation) {
    obj = {
      ...obj,
      release_location: formatLocation(capture.location_capture_release_location_idTolocation)
    }
  }
  delete (obj as any).location_capture_capture_location_idTolocation;
  delete (obj as any).location_capture_release_location_idTolocation;

  return obj;
}*/

const getAllCaptures = async (): Promise<capture[]> => {
  return await prisma.capture.findMany({
    ...captureInclude
  });
};

const getCaptureById = async (capture_id: string): Promise<FormattedCapture | null> => {
  const capture =  await prisma.capture.findUnique({
    ...captureInclude,
    where: {
      capture_id: capture_id
    }
  });
  if(capture == null) {
    return null;
  }
  return CaptureResponseSchema.parse(capture);
}

const getCaptureByCritter = async (critter_id: string): Promise<FormattedCapture[] | null> => {
  const exists = await prisma.critter.findUnique({
    where: {
      critter_id: critter_id
    }
  })
  if(!exists) {
    throw apiError.notFound('No critter matching this ID was found.')
  }
  const captures = await prisma.capture.findMany({
    ...captureInclude,
    where: {
      critter_id: critter_id
    }
  });
  if(captures == null) {
    return null;
  }
  return captures.map(c => CaptureResponseSchema.parse(c));
}

const createCapture = async (capture_data: CaptureCreate): Promise<capture | null> => {
  return await prisma.capture.create({
    data: capture_data
  })
}

const updateCapture = async (capture_id: string, capture_data: CaptureCreate): Promise<capture | null> => {
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

export { getAllCaptures, getCaptureById, getCaptureByCritter, updateCapture, createCapture, deleteCapture };
