import { Prisma } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { CritterUpdate } from "../critter/critter.utils";
import { CollectionUnitUpdateInput } from "../collectionUnit/collectionUnit.utils";
import { MarkingUpdateInput } from "../marking/marking.utils";
import { CaptureUpdate } from "../capture/capture.utils";
import { MortalityUpdate } from "../mortality/mortality.utils";
import { updateMortality } from "../mortality/mortality.service";
import { apiError } from "../../utils/types";
import { updateCapture } from "../capture/capture.service";

interface IBulkCreate {
    critters: Prisma.critterCreateManyInput[], 
    collections: Prisma.critter_collection_unitCreateManyInput[], 
    markings: Prisma.markingCreateManyInput[], 
    locations: Prisma.locationCreateManyInput[], 
    captures: Prisma.captureCreateManyInput[], 
    mortalities: Prisma.mortalityCreateManyInput[]
}

interface IBulkUpdate{
    critters: CritterUpdate[],
    collections: CollectionUnitUpdateInput[],
    markings: MarkingUpdateInput[],
    locations: Prisma.locationUpdateInput[],
    captures: CaptureUpdate[], 
    mortalities: MortalityUpdate[],
    
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

const bulkUpdateData = async ( bulkParams: IBulkUpdate ) => {
    const { critters, collections, locations, captures, mortalities } = bulkParams;
    const result = await prisma.$transaction(async (prisma) => {
        for(const c of critters) {
            await prisma.critter.update({
                where: { critter_id: c.critter_id },
                data: c
            })
        }
        for(const c of collections) {
            await prisma.critter_collection_unit.update({
                where: { critter_collection_unit_id: c.critter_collection_unit_id},
                data: c
            });
        }
        for(const l of locations) {
            await prisma.location.update({
                where: { location_id: l.location_id as string},
                data: l
            });
        }
        for(const c of captures) {
            if(!c.capture_id) {
                throw apiError.requiredProperty('capture_id');
            }
            await updateCapture(c.capture_id, c);
        }
        for(const m of mortalities) {
            if(!m.mortality_id) {
                throw apiError.requiredProperty('mortality_id');
            }
            await updateMortality(m.mortality_id, m);
        }
    });
    return result;
}

export { bulkCreateData, bulkUpdateData, IBulkCreate, IBulkUpdate }