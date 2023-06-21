import { prisma } from "../../utils/constants";
import type {
  critter,
  family,
  family_child,
  family_parent,
} from "@prisma/client";
import {
  FamilyUpdate,
  ImmediateFamily,
} from "./family.utils";

const getAllFamilies = async (): Promise<family[]> => {
  return await prisma.family.findMany();
};

const getAllParents = async (): Promise<family_parent[]> => {
  return await prisma.family_parent.findMany();
};

const getAllChildren = async (): Promise<family_child[]> => {
  return await prisma.family_child.findMany();
};

const getFamilyById = async (family_id: string): Promise<family> => {
  return await prisma.family.findFirstOrThrow({
    where: {
      family_id: family_id,
    },
  });
};

const updateFamily = async (
  family_id: string,
  family_data: FamilyUpdate
): Promise<family> => {
  return await prisma.family.update({
    data: family_data,
    where: {
      family_id: family_id,
    },
  });
};

const deleteFamily = async (family_id: string): Promise<family> => {
  return await prisma.family.delete({
    where: {
      family_id: family_id,
    },
  });
};

const getFamilyByLabel = async (
  family_label: string
): Promise<family | null> => {
  return await prisma.family.findFirst({
    where: {
      family_label: family_label,
    },
  });
};

const getParentsOfCritterId = async (
  critter_id: string
): Promise<critter[]> => {
  const child = await prisma.family_child.findFirstOrThrow({
    where: {
      child_critter_id: critter_id,
    },
  });

  const family = child.family_id;
  const parents = await prisma.family_parent.findMany({
    where: {
      family_id: family,
    },
  });
  const parent_critter_ids = parents.map((p) => p.parent_critter_id);
  return await prisma.critter.findMany({
    where: {
      critter_id: { in: parent_critter_ids },
    },
  });
};

const getSiblingsOfCritterId = async (
  critter_id: string
): Promise<critter[]> => {
  const family = await prisma.family_child.findFirstOrThrow({
    where: {
      child_critter_id: critter_id,
    },
  });

  const siblings = await prisma.family_child.findMany({
    where: {
      family_id: family.family_id,
    },
  });
  const sibling_ids = siblings
    .filter((a) => a.child_critter_id !== critter_id)
    .map((c) => c.child_critter_id);
  return await prisma.critter.findMany({
    where: {
      critter_id: { in: sibling_ids },
    },
  });
};

const getChildrenOfCritterId = async (
  critter_id: string
): Promise<critter[]> => {
  const parent = await prisma.family_parent.findFirstOrThrow({
    where: {
      parent_critter_id: critter_id,
    },
  });

  const family = parent.family_id;
  const children = await prisma.family_child.findMany({
    where: {
      family_id: family,
    },
  });
  const children_critter_ids = children.map((p) => p.child_critter_id);
  return await prisma.critter.findMany({
    where: {
      critter_id: { in: children_critter_ids },
    },
  });
};

const createNewFamily = async (family_label: string): Promise<family> => {
  const family = await prisma.family.create({
    data: {
      family_label: family_label,
    },
  });
  return family;
};

const makeChildOfFamily = async (
  family_id: string,
  child_critter_id: string
): Promise<family_child> => {
  const result = await prisma.family_child.create({
    data: {
      child_critter_id: child_critter_id,
      family_id: family_id,
    },
  });
  return result;
};

const makeParentOfFamily = async (
  family_id: string,
  parent_critter_id: string
): Promise<family_parent> => {
  const result = await prisma.family_parent.create({
    data: {
      parent_critter_id: parent_critter_id,
      family_id: family_id,
    },
  });
  return result;
};

const removeChildOfFamily = async (
  family_id: string,
  child_critter_id: string
): Promise<family_child> => {
  const result = await prisma.family_child.delete({
    where: {
      family_id_child_critter_id: {
        family_id: family_id,
        child_critter_id: child_critter_id,
      },
    },
  });
  return result;
};

const removeParentOfFamily = async (
  family_id: string,
  parent_critter_id: string
): Promise<family_parent> => {
  const result = await prisma.family_parent.delete({
    where: {
      family_id_parent_critter_id: {
        family_id: family_id,
        parent_critter_id: parent_critter_id,
      },
    },
  });
  return result;
};

const getImmediateFamily = async (
  family_id: string
): Promise<ImmediateFamily> => {
  const parents = await prisma.family_parent.findMany({
    where: { family_id: family_id },
  });
  const children = await prisma.family_child.findMany({
    where: { family_id: family_id },
  });
  const parent_ids = parents.map((p) => p.parent_critter_id);
  const children_ids = children.map((c) => c.child_critter_id);
  const parent_critters = await prisma.critter.findMany({
    where: {
      critter_id: { in: parent_ids },
    },
  });
  const child_critters = await prisma.critter.findMany({
    where: {
      critter_id: { in: children_ids },
    },
  });

  return {
    parents: parent_critters,
    children: child_critters,
  };
};

export {
  getAllFamilies,
  getAllChildren,
  getAllParents,
  getParentsOfCritterId,
  getChildrenOfCritterId,
  getSiblingsOfCritterId,
  getImmediateFamily,
  getFamilyById,
  getFamilyByLabel,
  makeChildOfFamily,
  makeParentOfFamily,
  createNewFamily,
  deleteFamily,
  updateFamily,
  removeChildOfFamily,
  removeParentOfFamily,
};
