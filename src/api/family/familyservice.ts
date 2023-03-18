import { prisma } from "../../utils/constants";
import type { critter, family, family_child, family_parent } from "@prisma/client";

const getAllFamilies = async (): Promise<family[]> => {
  return await prisma.family.findMany();
};

const getAllParents = async (): Promise<family_parent[]> => {
  return await prisma.family_parent.findMany();
}

const getAllChildren = async (): Promise<family_child[]> => {
  return await prisma.family_child.findMany();
}

const getFamilyById = async (family_id: string): Promise<family | null> => {
  return await prisma.family.findFirst({
    where: {
      family_id: family_id
    }
  })
}

const getParentsOfCritterId = async (critter_id: string): Promise<critter[]> => {
  const child = await prisma.family_child.findFirst({
    where: {
      child_critter_id: critter_id
    }
  });
  if(!child) {
    return [];
  }
  const family = child.family_id;
  const parents = await prisma.family_parent.findMany({
    where: {
      family_id: family
    }
  });
  const parent_critter_ids = parents.map(p => p.parent_critter_id);
  return await prisma.critter.findMany({
    where: {
      critter_id: {in: parent_critter_ids}
    }
  });
}

const getChildrenOfCritterId = async (critter_id: string): Promise<critter[]> => {
  const parent = await prisma.family_parent.findFirst({
    where: {
      parent_critter_id: critter_id
    }
  });
  if(!parent) {
    return [];
  }
  const family = parent.family_id;
  const children = await prisma.family_child.findMany({
    where: {
      family_id: family
    }
  });
  const children_critter_ids = children.map(p => p.child_critter_id);
  return await prisma.critter.findMany({
    where: {
      critter_id: {in: children_critter_ids}
    }
  });
}

export { getAllFamilies, getAllChildren, getAllParents, getParentsOfCritterId, getChildrenOfCritterId };
