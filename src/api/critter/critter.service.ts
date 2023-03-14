import { prisma } from "../../utils/constants";
import { critter, Prisma } from "@prisma/client";
import { apiError } from "../../utils/types";
import { isValidObject } from "../../utils/helper_functions";
import { CaptureSubsetType, CritterIncludeResult, FormattedCritter, formattedCritterInclude, MarkingSubsetType, MeasurementQualitatitveSubsetType, MeasurementQuantiativeSubsetType, MortalitySubsetType } from "./critter.types";

const formatCritterCapture = (events: CaptureSubsetType[]) => {
  return events.map(e => {
    const obj = {
      ...e,
      ...e.location_capture_capture_location_idTolocation,
      ...e.location_capture_capture_location_idTolocation?.lk_region_env,
      ...e.location_capture_capture_location_idTolocation?.lk_region_nr,
      ...e.location_capture_capture_location_idTolocation?.lk_wildlife_management_unit
    };
    delete (obj as any).location_capture_capture_location_idTolocation;
    delete (obj as any).lk_region_env;
    delete (obj as any).lk_region_nr;
    delete (obj as any).lk_wildlife_management_unit;
    return obj;
  })
}
// Could probably merge these two functions to one if generated type had same names for location field
const formatCritterMortality = (events: MortalitySubsetType[]) => {
  return events.map(e => {
    const obj = {
      ...e,
      ...e.location,
      ...e.location?.lk_region_env,
      ...e.location?.lk_region_nr,
      ...e.location?.lk_wildlife_management_unit
    };
    delete (obj as any).location;
    delete (obj as any).lk_region_env;
    delete (obj as any).lk_region_nr;
    delete (obj as any).lk_wildlife_management_unit;
    return obj;
  })
}

const formatCritterMeasurementQuantitative = (measure: MeasurementQuantiativeSubsetType[]) => {
  return measure.map(a => {
    return {[a.xref_taxon_measurement_quantitative.measurement_name]: a.value}
  });
}

const formatCritterMeasurementQualitative = (measure: MeasurementQualitatitveSubsetType[]) => {
  return measure.map(a => {
    const m = a.xref_taxon_measurement_qualitative_option;
    return {[m.xref_taxon_measurement_qualitative.measurement_name]:m.option_label}
  })
}

const formatCritterMarkings = (marking: MarkingSubsetType[]) => {
  return marking.map(a => {
    return {
      primary_colour: a.lk_colour_marking_primary_colour_idTolk_colour?.colour,
      secondary_colour: a.lk_colour_marking_secondary_colour_idTolk_colour?.colour,
      marking_type: a.lk_marking_type?.name ,
      marking_material: a.lk_marking_material?.material,
      body_location: a.xref_taxon_marking_body_location?.body_location,
      identifier: a.identifier,
      frequency: a.frequency,
      frequency_unit: a.frequency_unit,
      order: a.order
    }
  })
}

const formatCritterInput = (critter: CritterIncludeResult) => {
  if(critter?.measurement_quantitative == undefined || 
    critter?.measurement_qualitative == undefined || 
    critter?.marking == undefined) {
  throw apiError.serverIssue();
  }

  const formattedCritter: FormattedCritter = {
    ...critter,
    taxon_name_latin: critter?.lk_taxon.taxon_name_latin,
    responsible_region_nr_name: critter?.lk_region_nr?.region_nr_name,
    measurement_qualitative: formatCritterMeasurementQualitative(critter?.measurement_qualitative),
    measurement_quantitative: formatCritterMeasurementQuantitative(critter?.measurement_quantitative),
    marking: formatCritterMarkings(critter?.marking),
    capture: formatCritterCapture(critter?.capture),
    mortality: formatCritterMortality(critter?.mortality)
  };

  delete formattedCritter.lk_taxon;
  delete formattedCritter.lk_region_nr;

  return formattedCritter;
}

const isValidCreateCritter = (data: any): boolean => {
  return isValidObject(data, ['sex', 'taxon_id']);
}

const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

const getCritterById = async (critter_id: string): Promise<critter | null> => {

  return await prisma.critter.findUnique({
    where: { critter_id: critter_id}
  });

}

const getCritterByIdWithDetails = async (critter_id: string): Promise<FormattedCritter | null> => {
  const result = await prisma.critter.findUnique({
    ...formattedCritterInclude,
    where: {
      critter_id: critter_id
    }
  });

  if(result == undefined || 
    result?.measurement_quantitative == undefined || 
    result?.measurement_qualitative == undefined || 
    result?.marking == undefined) {
    throw apiError.serverIssue();
  }

  const formatted = formatCritterInput(result);
  return formatted;
}

const getCritterByWlhId = async (wlh_id: string): Promise<FormattedCritter[] | null> => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  const results =  await prisma.critter.findMany({
   ...formattedCritterInclude,
   where: {
    wlh_id: wlh_id
   }
  })

  if(!results || results.some(result => {
    result == undefined || 
    result?.measurement_quantitative == undefined || 
    result?.measurement_qualitative == undefined || 
    result?.marking == undefined
  })) {
    throw apiError.serverIssue();
  }

  const formattedResults = results.map(r => formatCritterInput(r));
  return formattedResults;
}

const updateCritter = async (critter_id: string, critter_data: Prisma.critterUpdateInput): Promise<critter> => {

  //Don't think you should be allowed to overwrite an existing critter_id with a different one. 
  delete critter_data.critter_id;

  return prisma.critter.update({
    where: {
      critter_id: critter_id
    },
    data: critter_data
  })
}

const createCritter = async (critter_data: Prisma.critterUncheckedCreateInput): Promise<critter> => {
  if(critter_data.critter_id) {
    const existing = await prisma.critter.findUnique({
      where: { critter_id: critter_data.critter_id}
    });
    if(existing) {
      throw apiError.conflictIssue('Creation of duplicate critter ID is not allowed');
    }
  }

  if(!isValidCreateCritter(critter_data)) {
    throw apiError.serverIssue();
  }
  
  const critter = await prisma.critter.create({
    data: critter_data
  })
  return critter;
}

const deleteCritter = async (critter_id: string): Promise<critter> => {
  const critter = await prisma.critter.delete({
    where: {
      critter_id: critter_id
    }
  })
  return critter;
}

export { 
  getAllCritters, 
  getCritterById, 
  getCritterByWlhId, 
  updateCritter, 
  createCritter, 
  deleteCritter, 
  getCritterByIdWithDetails,
  formatCritterInput
 };
