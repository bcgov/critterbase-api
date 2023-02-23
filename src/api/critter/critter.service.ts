type Critter = {
  critter_id: number;
  species: string;
  location: string;
  //blah blah blah
};

const getCritter = (): Critter => {
  //Place holder for prisma code
  return { critter_id: 1, species: "caribou", location: "bc" };
};

export { getCritter };
