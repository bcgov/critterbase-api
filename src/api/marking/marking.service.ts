import { prisma } from "../../utils/constants";
import { marking, Prisma } from "@prisma/client";
import { isValidObject } from "../../utils/helper_functions";

const getAllMarkings = async (): Promise<marking[]> => {
  return await prisma.marking.findMany();
};

const getMarkingById = async (marking_id: string): Promise<marking | null> => {
  return await prisma.marking.findUnique({
    where: {
      marking_id: marking_id,
    },
  });
};

const updateMarking = async (
  marking_id: string,
  marking_data: Prisma.markingUpdateInput
): Promise<marking> => {
  return await prisma.marking.update({
    where: {
      marking_id: marking_id,
    },
    data: marking_data,
  });
};

const createMarking = async (
  newMarkingData: Prisma.markingUncheckedCreateInput
): Promise<marking> => {
  return await prisma.marking.create({ data: newMarkingData });
};

const deleteMarking = async (marking_id: string): Promise<marking> => {
  return await prisma.marking.delete({
    where: {
      marking_id: marking_id,
    },
  });
};

/**
 * * Ensures that a create marking input has the right fields
 * TODO: Decide which fields should be allowed or required
 * @param {marking} data
 */
const isValidCreateMarkingInput = (data: Prisma.markingUncheckedCreateInput): boolean => {
    const requiredFields: (keyof Prisma.markingUncheckedCreateInput)[] = ["critter_id", "taxon_marking_body_location_id"];
    const allowedFields: (keyof Prisma.markingUncheckedCreateInput)[] = [
        'critter_id',
        'capture_id',
        'mortality_id',
        'taxon_marking_body_location_id',
        'marking_type_id',
        'marking_material_id',
        'primary_colour_id',
        'secondary_colour_id',
        'text_colour_id',
        'identifier',
        'frequency',
        'frequency_unit',
        'order',
        'comment',
        'attached_timestamp',
        'removed_timestamp',
        'create_user',
        'update_user',
      ]
      console.log(data)
    return isValidObject(data, requiredFields, allowedFields);
  };
  
export {
  getAllMarkings,
  getMarkingById,
  updateMarking,
  createMarking,
  deleteMarking,
  isValidCreateMarkingInput,
};
