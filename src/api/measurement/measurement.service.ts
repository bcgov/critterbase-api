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
import { PrismaTransactionClient } from "../../utils/types";

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
  data: QuantitativeBody,
): Promise<measurement_quantitative> => {
  return await prisma.measurement_quantitative.create({ data });
};

const createQualMeasurement = async (
  data: QualitativeBody,
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
  critter_id: string,
): Promise<Measurements> => {
  const [quantitative, qualitative] = await Promise.all([
    getQuantMeasurementsByCritterId(critter_id),
    getQualMeasurementsByCritterId(critter_id),
  ]);
  return { quantitative, qualitative };
};

const updateQualMeasurement = async (
  id: string,
  data: QualitativeUpdateBody,
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
  data: QuantitativeUpdateBody,
) => {
  return await prisma.measurement_quantitative.update({
    where: {
      measurement_quantitative_id: id,
    },
    data,
  });
};

const deleteQualMeasurement = async (
  id: string,
  prismaOverride?: PrismaTransactionClient,
): Promise<measurement_qualitative> => {
  const client = prismaOverride ?? prisma;
  return await client.measurement_qualitative.delete({
    where: {
      measurement_qualitative_id: id,
    },
  });
};

const deleteQuantMeasurement = async (
  id: string,
  prismaOverride?: PrismaTransactionClient,
): Promise<measurement_quantitative> => {
  const client = prismaOverride ?? prisma;
  return await client.measurement_quantitative.delete({
    where: {
      measurement_quantitative_id: id,
    },
  });
};

const verifyQuantitativeMeasurementsAgainstTaxon = async (
  taxon_id: string,
  body: Partial<measurement_quantitative> &
    Pick<
      measurement_quantitative,
      "measurement_quantitative_id" | "taxon_measurement_id"
    >[],
): Promise<string[]> => {
  const hier = await getParentTaxonIds(taxon_id);
  const measurement_ids: string[] = body.map(
    (m) => m.measurement_quantitative_id,
  );
  const measurements = await prisma.measurement_quantitative.findMany({
    include: {
      xref_taxon_measurement_quantitative: {
        select: {
          taxon_id: true,
        },
      },
    },
    where: { measurement_quantitative_id: { in: measurement_ids } },
  });
  const problemIds = [];
  for (const m of measurements) {
    const curr_id = m.xref_taxon_measurement_quantitative.taxon_id;
    if (!hier.includes(curr_id) && taxon_id != curr_id) {
      problemIds.push(m.measurement_quantitative_id);
    }
  }
  return problemIds;
};

const verifyQualitativeMeasurementsAgainstTaxon = async (
  taxon_id: string,
  body: Partial<measurement_qualitative> &
    Pick<
      measurement_qualitative,
      "measurement_qualitative_id" | "taxon_measurement_id"
    >[],
): Promise<string[]> => {
  const hier = await getParentTaxonIds(taxon_id);
  const measurement_ids: string[] = body.map(
    (m) => m.measurement_qualitative_id,
  );
  const measurements = await prisma.measurement_qualitative.findMany({
    include: {
      xref_taxon_measurement_qualitative: {
        select: {
          taxon_id: true,
        },
      },
    },
    where: { measurement_qualitative_id: { in: measurement_ids } },
  });
  const problemIds = [];
  for (const m of measurements) {
    const curr_id = m.xref_taxon_measurement_qualitative.taxon_id;
    if (!hier.includes(curr_id) && taxon_id != curr_id) {
      problemIds.push(m.measurement_qualitative_id);
    }
  }
  return problemIds;
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
  verifyQualitativeMeasurementsAgainstTaxon,
  verifyQuantitativeMeasurementsAgainstTaxon,
};
