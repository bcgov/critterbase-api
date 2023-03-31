import { prisma } from "../../utils/constants";
import { critter, Prisma } from "@prisma/client";
import { apiError } from "../../utils/types";
import { CaptureSubsetType, CritterCreate, CritterIncludeResult, CritterUpdate, FormattedCapture, FormattedCritter, formattedCritterInclude, FormattedMarking, FormattedMortality, FormattedQualitativeMeasurement, FormattedQuantitativeMeasurement, MarkingSubsetType, MeasurementQualitatitveSubsetType, MeasurementQuantiativeSubsetType, MortalitySubsetType } from "./critter.types";
import { formatLocation } from "../location/location.service";

const formatCritterCapture = (events: CaptureSubsetType[]): FormattedCapture[] => {
  return events.map(e => {
    const obj: FormattedCapture = {...e};
    if(e.location_capture_capture_location_idTolocation){
      obj.capture_location = formatLocation(e.location_capture_capture_location_idTolocation);
    }
    if(e.location_capture_release_location_idTolocation) {
      obj.release_location = formatLocation(e.location_capture_release_location_idTolocation);
    }
    delete (obj as any).location_capture_capture_location_idTolocation;
    delete (obj as any).location_capture_release_location_idTolocation;

    return obj;
  })
}
// Could probably merge these two functions to one if generated type had same names for location field
const formatCritterMortality = (events: MortalitySubsetType[]): FormattedMortality[] => {
  return events.map(e => {
    const obj: FormattedMortality = {...e};
    if(e.location) {
      obj.mortality_location = formatLocation(e.location);
    }
    delete (obj as any).location;
    return obj;
  })
}

const formatCritterMeasurementQuantitative = (measure: MeasurementQuantiativeSubsetType[]): FormattedQuantitativeMeasurement[] => {
  return measure.map(a => {
    return {
      measurement_name: a.xref_taxon_measurement_quantitative.measurement_name,
      value: a.value,
      unit: a.xref_taxon_measurement_quantitative.unit,
      measured_timestamp: a.measured_timestamp
    }
  });
}

const formatCritterMeasurementQualitative = (measure: MeasurementQualitatitveSubsetType[]): FormattedQualitativeMeasurement[] => {
  return measure.map(a => {
    const m = a.xref_taxon_measurement_qualitative_option;
    return {
      measurement_name: m.xref_taxon_measurement_qualitative.measurement_name,
      value: m.option_label,
      measured_timestamp: a.measured_timestamp
    }
  })
}

const formatCritterMarkings = (marking: MarkingSubsetType[]): FormattedMarking[] => {
  return marking.map(a => {
    return {
      primary_colour: a.lk_colour_marking_primary_colour_idTolk_colour?.colour ?? null,
      secondary_colour: a.lk_colour_marking_secondary_colour_idTolk_colour?.colour ?? null,
      marking_type: a.lk_marking_type?.name ?? null,
      marking_material: a.lk_marking_material?.material ?? null,
      body_location: a.xref_taxon_marking_body_location?.body_location ?? null,
      identifier: a.identifier ?? null,
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
    measurements: {
      qualitative: formatCritterMeasurementQualitative(critter?.measurement_qualitative),
      quantitative: formatCritterMeasurementQuantitative(critter?.measurement_quantitative),
    },
    marking: formatCritterMarkings(critter?.marking),
    capture: formatCritterCapture(critter?.capture),
    mortality: formatCritterMortality(critter?.mortality)
  };

  delete (formattedCritter as any).measurement_qualitative;
  delete (formattedCritter as any).measurement_quantitative;
  delete formattedCritter.lk_taxon;
  delete formattedCritter.lk_region_nr;
  console.log(JSON.stringify(formattedCritter, null, 2));
  return formattedCritter;
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
  
  if(!result) {
    return null;
  }

  const formatted = formatCritterInput(result);
  return formatted;
}

const getCritterByWlhId = async (wlh_id: string): Promise<FormattedCritter[]> => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  const results =  await prisma.critter.findMany({
   ...formattedCritterInclude,
   where: {
    wlh_id: wlh_id
   }
  })

  const formattedResults = results.map(r => formatCritterInput(r));
  return formattedResults;
}

const updateCritter = async (critter_id: string, critter_data: CritterUpdate): Promise<critter> => {
  return prisma.critter.update({
    where: {
      critter_id: critter_id
    },
    data: critter_data
  })
}

const createCritter = async (critter_data: CritterCreate): Promise<critter> => {
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
