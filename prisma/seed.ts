import { Prisma, PrismaClient } from '@prisma/client'
import { queryRandomUUID } from './prisma_utils';
import { regionStructureList } from './seed_regions'
import { insertDefaultTaxons } from './seed_taxons';
const prisma = new PrismaClient();



async function main() {
    const systemUserUUID = await queryRandomUUID(prisma);

    /**
     * Create system user, which is required for auto filling the create and update user of all subsequent rows.
     */
    await prisma.user.upsert({
        where: {system_user_id: 'SYSTEM'},
        update: {system_user_id: 'SYSTEM'},
        create: {
            system_user_id: 'SYSTEM',
            system_name: 'SYSTEM',
            user_id: systemUserUUID,
            create_user: systemUserUUID,
            update_user: systemUserUUID
        }
    })

    /**
     * Insert all region table values.
     * Need to do this all with raw SQL as the geometry types are not supported by prisma.
     */
    for(const struct of regionStructureList) {
        for(const region of struct.importedJson['features']) {
            let nrRegionQuery = `INSERT INTO ${struct.tableName} (${struct.tableUnitName}, ${struct.tableGeomName}) VALUES `
            const geom = struct.isMultiPolygon && region['geometry']['type'] === 'Polygon' ?  
                {type: 'MultiPolygon', coordinates: [region['geometry']['coordinates']], crs:  {type: 'name', properties: {name: 'EPSG:4326'}}}
            :
                {...region['geometry'], crs:  {type: 'name', properties: {name: 'EPSG:4326'}}};
            const nrRegionValues =  `('${region['properties'][struct.jsonRegionName as keyof typeof region['properties']]}', public.ST_GeomFromGeoJson('${JSON.stringify(geom)}'::jsonb))`;
            nrRegionQuery = nrRegionQuery + nrRegionValues + ` ON CONFLICT (${struct.tableIdName}) DO UPDATE SET ${struct.tableUnitName}=excluded.${struct.tableUnitName}`;
            await prisma.$queryRawUnsafe(nrRegionQuery);
        }
        await prisma.$queryRawUnsafe(`
            INSERT INTO ${struct.tableName} (${struct.tableUnitName}) VALUES ('Unknown')`);
    }

    const causesOfDeath = [
        {cod_category: 'Natural Disaster', cod_reason: 'Avalanche'},
        {cod_category: 'Natural Disaster', cod_reason: 'Unknown'},
        {cod_category: 'Collision', cod_reason: 'Train'},
        {cod_category: 'Collision', cod_reason: 'Motor vehicle'},
        {cod_category: 'Natural', cod_reason: null},
        {cod_category: 'Predation', cod_reason: null},
        {cod_category: 'Illness/Disease', cod_reason: null},
        {cod_category: 'Poison/Toxic Exposure', cod_reason: null},
        {cod_category: 'Harvest', cod_reason: 'Trapping'},
        {cod_category: 'Harvest', cod_reason: 'Licensed'},
        {cod_category: 'Harvest', cod_reason: 'Unlicensed'},
        {cod_category: 'Harvest', cod_reason: 'Aboriginal'},
        {cod_category: 'Purposeful Removal', cod_reason: null},
        {cod_category: 'Property/Life Defence', cod_reason: null},
        {cod_category: 'Unknown', cod_reason: null}
    ]

    for(const cod of causesOfDeath) {
        await prisma.lk_cause_of_death.create({
            data: {
                cod_category: cod.cod_category,
                cod_reason: cod.cod_reason
            }
        })
    }

    const colours = ['Blue', 'Red', 'Yellow', 'Orange', 'Black', 'Green', 'Pink', 'White', ' Purple'];
    for(const c of colours) {
        await prisma.lk_colour.create({
            data: {
                colour: c
            }
        })
    }

    const materials = ['Plastic', 'Metal'];
    for(const m of materials) {
        await prisma.lk_marking_material.create({
            data: {
                material: m
            }
        })
    }

    await prisma.lk_marking_type.create({
        data: {
            name: 'Ear Tag'
        }
    })


    await insertDefaultTaxons(prisma);
    
    const popUnitCategoryID = await queryRandomUUID(prisma);
    await prisma.lk_collection_category.create({
        data: {
            collection_category_id: popUnitCategoryID,
            category_name: 'Population Unit'
        }
    })

   /* await prisma.xref_taxon_collection_category.create({
        data: {
            collection_category_id: popUnitCategoryID,
            
        }
    })*/
}

main()
.then(async () => {
    console.log('Successfully seeded the database.')
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})