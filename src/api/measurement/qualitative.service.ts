import { measurement_qualitative } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../utils/constants";
import { exclude } from "../../utils/helper_functions";
import { QualitativeBody } from "./measurement.types";

const getAllQualMeasurements = async (): Promise<measurement_qualitative[]> => {
  const qualMeasurements = await prisma.measurement_qualitative.findMany();
  return qualMeasurements;
};

const getQualMeasurementOrThrow = async (
  id: string
): Promise<measurement_qualitative> => {
  const qualMeasurement =
    await prisma.measurement_qualitative.findUniqueOrThrow({
      where: {
        measurement_qualitative_id: id,
      },
    });
  return qualMeasurement;
};

const createQualMeasurement = async (
  data: QualitativeBody
): Promise<measurement_qualitative> => {
  return await prisma.measurement_qualitative.create({ data });
};

const getQualMeasurementsByCritterId = async (critter_id: string) => {
  await prisma.critter.findUniqueOrThrow({ where: { critter_id } });
  return await prisma.measurement_qualitative.findMany({
    where: {
      critter_id,
    },
  });
};
// const updateQualMeasurement = () => {};
const deleteQualMeasurement = async (id: string) => {
  await prisma.measurement_qualitative.delete({
    where: {
      measurement_qualitative_id: id,
    },
  });
};

export {
  getAllQualMeasurements,
  getQualMeasurementOrThrow,
  createQualMeasurement,
  getQualMeasurementsByCritterId,
};
