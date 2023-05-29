import { prisma } from "../../utils/constants";
import type { mortality, Prisma, PrismaClient } from "@prisma/client";
import {
  MortalityCreate,
  mortalityInclude,
  MortalityUpdate,
} from "./mortality.utils";
import { PrismaTransactionClient } from "../../utils/types";

const getAllMortalities = async (): Promise<mortality[]> => {
  return await prisma.mortality.findMany();
};

const getMortalityById = async (
  mortality_id: string
): Promise<mortality | null> => {
  const mort = await prisma.mortality.findUniqueOrThrow({
    ...mortalityInclude,
    where: {
      mortality_id: mortality_id,
    },
  });

  return mort;
};

const appendDefaultCOD = async (body: {proximate_cause_of_death_id?: string}) => {
  const cod_res = await prisma.lk_cause_of_death.findFirstOrThrow({
    where: { cod_category: "Unknown" },
  });
  if (!body.proximate_cause_of_death_id) {
    body.proximate_cause_of_death_id = cod_res.cod_id; //This is just a temp solution, ideally they should be forced to provide this.
  }
  return body;
};

const getMortalityByCritter = async (
  critter_id: string
): Promise<mortality[]> => {
  const mortalities = await prisma.mortality.findMany({
    ...mortalityInclude,
    where: {
      critter_id: critter_id,
    },
  });
  return mortalities;
};

const createMortality = async (
  mortality_data: MortalityCreate
): Promise<mortality> => {
  const {
    critter_id,
    location_id,
    location,
    proximate_cause_of_death_id,
    proximate_predated_by_taxon_id,
    ultimate_cause_of_death_id,
    ultimate_predated_by_taxon_id,
    ...rest
  } = mortality_data;

  return await prisma.mortality.create({
    data: {
      critter: { connect: { critter_id } },
      location: location_id 
      ? {
          connect : { location_id: location_id }
        }
      : location 
      ? { create: location }
      : undefined,
      lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: 
        { connect: { cod_id: proximate_cause_of_death_id }},
      lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: proximate_predated_by_taxon_id ?
        { connect: { taxon_id: proximate_predated_by_taxon_id}} : undefined,
      lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: ultimate_cause_of_death_id ? 
        { connect: { cod_id: ultimate_cause_of_death_id }} : undefined,
      lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: ultimate_predated_by_taxon_id ? 
        { connect: { taxon_id: ultimate_predated_by_taxon_id }} : undefined,
      ...rest
    },
  });
};

const updateMortality = async (
  mortality_id: string,
  mortality_data: MortalityUpdate,
  prismaOverride?: PrismaTransactionClient
) => {
    const client = prismaOverride ?? prisma;
    const { 
      location, 
      location_id, 
      critter_id, 
      proximate_cause_of_death_id, 
      ultimate_cause_of_death_id,
      proximate_predated_by_taxon_id,
      ultimate_predated_by_taxon_id, 
      ...rest } = mortality_data;
  const upsertBody = {create:{}, update:{}};
  if(location) {
      const { location_id, ...others } = location;
      upsertBody.create = { ...others};
      upsertBody.update = { location_id, ...others};
  }
  return await client.mortality.update({
      where: { mortality_id: mortality_id },
      data: {
          location: {
              upsert: upsertBody
          },
          lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: {
              connect: proximate_cause_of_death_id ? { cod_id: proximate_cause_of_death_id } : undefined,
          },
          lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: {
              connect: ultimate_cause_of_death_id ? { cod_id: ultimate_cause_of_death_id } : undefined,
          },
          lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: {
              connect: proximate_predated_by_taxon_id ? { taxon_id: proximate_predated_by_taxon_id } : undefined
          },
          lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: {
              connect: ultimate_predated_by_taxon_id ? { taxon_id: ultimate_predated_by_taxon_id } : undefined
          },
          ...rest
      }
  });
};

const deleteMortality = async (mortality_id: string) => {
  return await prisma.mortality.delete({
    where: {
      mortality_id: mortality_id,
    },
  });
};

export {
  getAllMortalities,
  getMortalityById,
  getMortalityByCritter,
  createMortality,
  updateMortality,
  deleteMortality,
  appendDefaultCOD,
};
