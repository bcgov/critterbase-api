import {
  measurement_qualitative,
  measurement_quantitative,
} from "@prisma/client";
import { prisma } from "../../utils/constants";
import {
  measurementQualitativeInclude,
  measurementQuantitativeInclude,
  Measurements,
  QualitativeBody,
  QualitativeUpdateBody,
  QuantitativeBody,
  QuantitativeUpdateBody,
} from "./measurement.utils";

const getAllQuantMeasurements = async (): Promise<
  measurement_quantitative[]
> => {
  const quantMeasurement = await prisma.measurement_quantitative.findMany();
  return quantMeasurement;
};

const getAllQualMeasurements = async (): Promise<measurement_qualitative[]> => {
  const qualMeasurements = await prisma.measurement_qualitative.findMany();
  return qualMeasurements;
};

const getQuantMeasurementOrThrow = async (id: string) => {
  const quantMeasurement =
    await prisma.measurement_quantitative.findUniqueOrThrow({
      where: {
        measurement_quantitative_id: id,
      },
      ...measurementQuantitativeInclude,
    });
  return quantMeasurement;
};

const getQualMeasurementOrThrow = async (id: string) => {
  const qualMeasurement =
    await prisma.measurement_qualitative.findUniqueOrThrow({
      where: {
        measurement_qualitative_id: id,
      },
      ...measurementQualitativeInclude,
    });
  return qualMeasurement;
};

const createQuantMeasurement = async (
  data: QuantitativeBody
): Promise<measurement_quantitative> => {
  return await prisma.measurement_quantitative.create({ data });
};

const createQualMeasurement = async (
  data: QualitativeBody
): Promise<measurement_qualitative> => {
  return await prisma.measurement_qualitative.create({ data });
};

const getQuantMeasurementsByCritterId = async (critter_id: string) => {
  await prisma.critter.findUniqueOrThrow({ where: { critter_id } });
  return await prisma.measurement_quantitative.findMany({
    where: {
      critter_id,
    },
  });
};

const getQualMeasurementsByCritterId = async (critter_id: string) => {
  await prisma.critter.findUniqueOrThrow({ where: { critter_id } });
  return await prisma.measurement_qualitative.findMany({
    where: {
      critter_id,
    },
  });
};

const getMeasurementsByCritterId = async (
  critter_id: string
): Promise<Measurements> => {
  const [quantitative, qualitative] = await Promise.all([
    getQuantMeasurementsByCritterId(critter_id),
    getQualMeasurementsByCritterId(critter_id),
  ]);
  return { quantitative, qualitative };
};

const updateQualMeasurement = async (
  id: string,
  data: QualitativeUpdateBody
) => {
  return await prisma.measurement_qualitative.update({
    where: {
      measurement_qualitative_id: id,
    },
    data,
  });
};

const updateQuantMeasurement = async (
  id: string,
  data: QuantitativeUpdateBody
) => {
  return await prisma.measurement_quantitative.update({
    where: {
      measurement_quantitative_id: id,
    },
    data,
  });
};

const deleteQualMeasurement = async (
  id: string
): Promise<measurement_qualitative> => {
  return await prisma.measurement_qualitative.delete({
    where: {
      measurement_qualitative_id: id,
    },
  });
};

const deleteQuantMeasurement = async (
  id: string
): Promise<measurement_quantitative> => {
  return await prisma.measurement_quantitative.delete({
    where: {
      measurement_quantitative_id: id,
    },
  });
};

export {
  getAllQualMeasurements,
  getQualMeasurementOrThrow,
  getQuantMeasurementOrThrow,
  createQualMeasurement,
  createQuantMeasurement,
  getQualMeasurementsByCritterId,
  getQuantMeasurementsByCritterId,
  deleteQualMeasurement,
  deleteQuantMeasurement,
  getAllQuantMeasurements,
  getMeasurementsByCritterId,
  updateQuantMeasurement,
  updateQualMeasurement,
};
