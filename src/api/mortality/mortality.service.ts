import { prisma } from "../../utils/constants";
import type { mortality } from "@prisma/client";
import { FormattedMortality, MortalityCreate, mortalityInclude, MortalityIncludeType, MortalityUpdate } from "./mortality.types";
import { apiError } from "../../utils/types";
import { exclude } from "../../utils/helper_functions";
import { FormattedLocation } from "../location/location.types";

const formatCauseOfDeath = (cod_category: string, cod_reason: string | null) => {
  return cod_reason ? cod_category + ' - ' + cod_reason : cod_category;
}

const formatMortality = (mortality: MortalityIncludeType): FormattedMortality => {
  const pcod = mortality.lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death;
  const ucod = mortality.lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death;
  const pcod_t = mortality.lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon;
  const ucod_t = mortality.lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon;
  const location = {...exclude(mortality.location, ['lk_region_env', 'lk_region_nr', 'lk_wildlife_management_unit'])} as FormattedLocation;
  let obj: FormattedMortality = { 
    ...mortality,
    mortality_location: location,
    pcod_reason: formatCauseOfDeath(pcod.cod_category, pcod.cod_reason),
    pcod_taxon_name_latin: pcod_t?.taxon_name_latin,
    ucod_reason: ucod ? formatCauseOfDeath(ucod.cod_category, ucod?.cod_reason) : undefined,
    ucod_taxon_name_latin: ucod_t?.taxon_name_latin
  }
  delete (obj as any).lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death;
  delete (obj as any).lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death;
  delete (obj as any).lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon;
  delete (obj as any).lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon;
  console.log(obj);
  return obj;
}

const getAllMortalities = async (): Promise<mortality[]> => {
  return await prisma.mortality.findMany();
};

const getMortalityById = async (mortality_id: string): Promise<mortality | null> => {
  const mort = await prisma.mortality.findUnique({
    ...mortalityInclude,
    where: {
      mortality_id: mortality_id
    }
  });
  if(mort == null) {
    return null;
  }
  return formatMortality(mort);
}

const getMortalityByCritter = async (critter_id: string): Promise<mortality[]> => {
  const mortalities = await prisma.mortality.findMany({
    ...mortalityInclude,
    where: {
      critter_id: critter_id
    }
  });
  return mortalities.map(m => formatMortality(m));
}

const createMortality = async (mortality_data: MortalityCreate): Promise<mortality> => {
  return await prisma.mortality.create({
    data: mortality_data
  })
}

const updateMortality = async (mortality_id: string, mortality_data: MortalityUpdate) => {
  return await prisma.mortality.update({
    data: mortality_data,
    where: {
      mortality_id: mortality_id
    }
  })
}

const deleteMortality = async (mortality_id: string) => {
  return await prisma.mortality.delete({
    where: {
      mortality_id: mortality_id
    }
  })
}

export { getAllMortalities, getMortalityById, getMortalityByCritter, createMortality, updateMortality, deleteMortality };
