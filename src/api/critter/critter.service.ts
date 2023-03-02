import { prisma } from "../../utils/constants";

type Critter = {
  critter_id: number;
  species: string;
  location: string;
  //blah blah blah
};

const getCritters = async (): Promise<Critter> => {
  const allCritters = await prisma.critter.findMany({
    where: { sex: "Male" },
  });
  console.log(allCritters);

  return { critter_id: 1, species: "caribou", location: "bc" };
};

export { getCritters };
