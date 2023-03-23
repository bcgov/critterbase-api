import { measurement_qualitative } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../utils/constants";
import { exclude } from "../../utils/helper_functions";
import { QualitativeBody } from "./measurement.types";

const getAllQualMeasurements = async (): Promise<measurement_qualitative[]> => {
  const qualMeasurements = await prisma.measurement_qualitative.findMany();
  return qualMeasurements;
};

const getQualMeasurement = async (
  id: string
): Promise<measurement_qualitative | null> => {
  const qualMeasurement = await prisma.measurement_qualitative.findUnique({
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

// const getQualMeasurementByCritterId = () => {};
// const updateQualMeasurement = () => {};
// const deleteQualMeasurement = () => {};

export { getAllQualMeasurements, getQualMeasurement, createQualMeasurement };
