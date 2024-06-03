import { prisma } from '../../src/utils/constants';
import { CRITTER_ONE, ITIS_TSN } from './seed_constants';

export const seedCritters = async () => {
  console.log('Seeding (1) critter + attributes...');

  const caribouNrRegion = await prisma.lk_region_nr.findMany();
  const colour = await prisma.lk_colour.findMany();
  const markingType = await prisma.lk_marking_type.findMany();
  const markingMaterial = await prisma.lk_marking_material.findMany();
  const cod = await prisma.lk_cause_of_death.findMany();
  const collectionUnits = await prisma.xref_collection_unit.findMany();
  const captureMethods = await prisma.lk_capture_method.findMany();

  const markingBodyLocation = await prisma.xref_taxon_marking_body_location.findFirst({
    where: { body_location: 'Left Ear' }
  });

  const quantitative = await prisma.xref_taxon_measurement_quantitative.findFirst();

  const qualitative = await prisma.xref_taxon_measurement_qualitative.findFirst({
    where: { measurement_name: 'Life Stage' },
    select: {
      taxon_measurement_id: true,
      xref_taxon_measurement_qualitative_option: {
        select: {
          qualitative_option_id: true
        }
      }
    }
  });

  if (!markingBodyLocation || !quantitative || !qualitative) {
    console.error('failed to find value for seed lookup');
    return;
  }

  /**
   * Seed critter and related data
   *
   */
  const critter = await prisma.critter.create({
    data: {
      critter_id: CRITTER_ONE,
      wlh_id: '123-45',
      animal_id: 'Carl',
      sex: 'Male',
      critter_comment: 'Carl the critter.',
      itis_tsn: ITIS_TSN.CARIBOU,
      itis_scientific_name: 'Alces alces',
      responsible_region_nr_id: caribouNrRegion[0].region_nr_id
    }
  });

  const location = await prisma.location.create({
    data: {
      latitude: 1,
      longitude: 1,
      coordinate_uncertainty: 10,
      coordinate_uncertainty_unit: 'm',
      region_nr_id: caribouNrRegion[0].region_nr_id,
      elevation: 100,
      temperature: 20,
      location_comment: 'Capture and Release Location'
    }
  });

  const capture = await prisma.capture.create({
    data: {
      critter_id: critter.critter_id,
      capture_location_id: location.location_id,
      release_location_id: location.location_id,
      capture_method_id: captureMethods[0].capture_method_id,
      capture_date: new Date(),
      capture_time: new Date(),
      capture_comment: 'Critter was captured',
      release_comment: 'Critter was released'
    }
  });

  const mortality = await prisma.mortality.create({
    data: {
      critter_id: critter.critter_id,
      location_id: location.location_id,
      mortality_timestamp: new Date(),
      proximate_cause_of_death_id: cod[0].cod_id,
      proximate_cause_of_death_confidence: 'Probable',
      ultimate_cause_of_death_id: cod[0].cod_id,
      ultimate_cause_of_death_confidence: 'Probable',
      proximate_predated_by_itis_tsn: ITIS_TSN.CANIS_LUPUS,
      ultimate_predated_by_itis_tsn: ITIS_TSN.CANIS_LUPUS,
      mortality_comment: 'Critter died.'
    }
  });

  await prisma.marking.create({
    data: {
      critter_id: critter.critter_id,
      taxon_marking_body_location_id: markingBodyLocation.taxon_marking_body_location_id,
      marking_type_id: markingType[0].marking_type_id,
      marking_material_id: markingMaterial[0].marking_material_id,
      primary_colour_id: colour[0].colour_id,
      secondary_colour_id: colour[1].colour_id,
      text_colour_id: colour[2].colour_id,
      identifier: 'abc',
      frequency: 100,
      frequency_unit: 'Hz',
      order: 1,
      comment: 'Marking comment.'
    }
  });

  await prisma.measurement_qualitative.create({
    data: {
      critter_id: critter.critter_id,
      taxon_measurement_id: qualitative.taxon_measurement_id,
      capture_id: capture.capture_id,
      mortality_id: mortality.mortality_id,
      qualitative_option_id: qualitative.xref_taxon_measurement_qualitative_option[0].qualitative_option_id,
      measurement_comment: 'added qualitative measurement',
      measured_timestamp: new Date()
    }
  });

  await prisma.measurement_quantitative.create({
    data: {
      critter_id: critter.critter_id,
      taxon_measurement_id: quantitative.taxon_measurement_id,
      capture_id: capture.capture_id,
      mortality_id: mortality.mortality_id,
      value: 1,
      measurement_comment: 'quantitative measurement comment',
      measured_timestamp: new Date()
    }
  });

  await prisma.critter_collection_unit.create({
    data: {
      critter_id: critter.critter_id,
      // This just grabs first colleciton unit. Seed is only Caribou population units.
      collection_unit_id: collectionUnits[0].collection_unit_id
    }
  });
};
