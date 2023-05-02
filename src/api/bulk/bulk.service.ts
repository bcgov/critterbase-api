import { Prisma } from "@prisma/client";
import { prisma } from "../../utils/constants";

interface IBulkCreate {
    critters: Prisma.critterCreateManyInput[], 
    collections: Prisma.critter_collection_unitCreateManyInput[], 
    markings: Prisma.markingCreateManyInput[], 
    locations: Prisma.locationCreateManyInput[], 
    captures: Prisma.captureCreateManyInput[], 
    mortalities: Prisma.mortalityCreateManyInput[]
}

const bulkCreateData = async (
        bulkParams: IBulkCreate
    ) => {
        const { critters, collections, markings, locations, captures, mortalities } = bulkParams;
        const result = await prisma.$transaction(async (prisma) => {
            const critterRes = await prisma.critter.createMany({
                data: critters
            });

            await prisma.critter_collection_unit.createMany({
                data: collections
            });

            await prisma.location.createMany({
                data: locations
            });

            await  prisma.capture.createMany({
                data: captures
            });

            await prisma.mortality.createMany({
                data: mortalities
            });

            await prisma.marking.createMany({ 
                data: markings
            });

            return critterRes;
        });

        return result;
}

export { bulkCreateData, IBulkCreate }