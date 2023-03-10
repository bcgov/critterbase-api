import { queryRandomUUID } from './prisma_utils';
import { regionStructureList } from './seed_scripts/seed_regions'
import { insertDefaultTaxons } from './seed_scripts/seed_taxons';
import { prisma } from '../src/utils/constants'
import * as fs from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';



async function main() {
    const systemUserUUID = await queryRandomUUID(prisma);

    await prisma.$executeRaw`ALTER TABLE critterbase."user" DISABLE TRIGGER all`;

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

    await prisma.$executeRaw`ALTER TABLE critterbase."user" ENABLE TRIGGER all`;

    /**
     * Create mock users to test users endpoint.
     */
    const generateMockUserData = (count: number): Prisma.userCreateManyInput[] => {
        const mockUsers: Prisma.userCreateManyInput[] = [];
      
        for (let i = 0; i < count; i++) {
          mockUsers.push({
            system_user_id: `${i + 1}`,
            system_name: `Mock User ${i + 1}`,
            create_user: systemUserUUID,
            update_user: systemUserUUID
          });
        }
        return mockUsers;
      };

    const mockUsers = generateMockUserData(10);
    await prisma.user.createMany({
        data: mockUsers,
    });
    
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

    const colours = ['Blue', 'Red', 'Yellow', 'Orange', 'Black', 'Green', 'Pink', 'White', 'Purple'];
    await prisma.lk_colour.createMany({
        data: colours.map(c => {return {colour: c}})
    })

    const materials = ['Plastic', 'Metal'];
    await prisma.lk_marking_material.createMany({
        data: materials.map(m => {return {material: m}})
    })

    await prisma.lk_marking_type.create({
        data: { name: 'Ear Tag' }
    })


    await insertDefaultTaxons(prisma);
    
    /*
    * Make the collection category Population Unit
    * All population unit values go under this.
    */
    const popUnitCategoryID = await queryRandomUUID(prisma);
    await prisma.lk_collection_category.create({
        data: {
            collection_category_id: popUnitCategoryID,
            category_name: 'Population Unit'
        }
    })

    const rangiferTarandusUUID = (await prisma.lk_taxon.findFirst({
        where: {
            taxon_name_latin: 'Rangifer tarandus'
        }
    }))?.taxon_id;

    const canisLupusUUID = (await prisma.lk_taxon.findFirst({
        where: {
            taxon_name_latin: 'Canis lupus'
        }
    }))?.taxon_id;

    const mammaliaUUID = (await prisma.lk_taxon.findFirst({
        where: {
            taxon_name_latin: 'Mammalia'
        }
    }))?.taxon_id;

    const artioUUID = (await prisma.lk_taxon.findFirst({
        where: {
            taxon_name_latin: 'Artiodactyla'
        }
    }))?.taxon_id;

    if(!rangiferTarandusUUID || !canisLupusUUID || !mammaliaUUID || !artioUUID) {
        throw Error('Unable to grab the UUID for a required taxon ' + rangiferTarandusUUID + canisLupusUUID + mammaliaUUID + artioUUID);
    }

    /*
    * Link Population Units to Caribou
    */
    await prisma.xref_taxon_collection_category.create({
        data: {
            collection_category_id: popUnitCategoryID,
            taxon_id: rangiferTarandusUUID
        }
    });

    /*
    * Now give the Population Unit category all of its usable values.
    */
    const population_units = (await prisma.lk_population_unit_temp.findMany()).filter(a => a !== null).map(a => a.unit_name) as string[];
    await prisma.xref_collection_unit.createMany({
        data: population_units.map((p) => { return {collection_category_id: popUnitCategoryID, unit_name: p} })
    })

    /*
    * Now configure body locations for markings.
    */
   const bodyLocations = ['Left Ear', 'Right Ear'];
   await prisma.xref_taxon_marking_body_location.createMany({
        data: bodyLocations.map(b => {return {taxon_id: rangiferTarandusUUID, body_location: b}})
   })

   /*
   * Measurements section, note the use of different taxon UUIDs
   */
   const qualitativeMeasures = [
        {name: 'Life Stage', taxon: canisLupusUUID, options: ['Adult', 'Subadult', 'Young of year', 'Juvenile', 'Neonate']},
        {name: 'Life Stage', taxon: artioUUID, options: ['Adult', 'Subadult', 'Young of year', 'Juvenile', 'Pup']},
        {name: 'Juvenile at heel indicator', taxon: mammaliaUUID, options: ['False', 'True']}
    ];

    await prisma.xref_taxon_measurement_qualitative.createMany({
        data: qualitativeMeasures.map(q => {return {taxon_id: q.taxon, measurement_name: q.name}})
    });

    const qualitativeResults = await prisma.xref_taxon_measurement_qualitative.findMany();
    for (const q of qualitativeMeasures) {
        const uuid = qualitativeResults.find(a => a.measurement_name === q.name && a.taxon_id === q.taxon)?.taxon_measurement_id;
        if(!uuid) throw Error('Could not find a required measurement id');
        await prisma.xref_taxon_measurement_qualitative_option.createMany({
            data: q.options.map((o, idx) => {return {taxon_measurement_id: uuid, option_label: o, option_value: idx}})
        })
    }

    const quantitativeMeasures = [
        {name: 'Estimated age', taxon: mammaliaUUID},
        {name: 'Juvenile count', taxon: mammaliaUUID}
    ]
    await prisma.xref_taxon_measurement_quantitative.createMany({
        data: quantitativeMeasures.map(q => {return {measurement_name: q.name, taxon_id: q.taxon }})
    })
    
    //Have to do this mess of string manipulation because prisma execute raw will only allow you to run one statement at a time.
    const sqls = fs
    .readFileSync(path.join(__dirname, './seed_scripts/import_bctw_animal_data.sql'))
    .toString()
    .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
    .split(/\s*;\s*(?=(?:[^']*'[^']*')*[^']*$)/); //this just scans for semicolons that are not enclosed in strings. yes there are semicolons in some of this data...

    for(const sql of sqls) {
        await prisma.$executeRawUnsafe(sql);
    }
    

}

async function test() {
    prisma.$connect();
    const sqls = fs
    .readFileSync(path.join(__dirname, './seed_scripts/import_bctw_animal_data.sql'))
    .toString()
    .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
    .split(/\s*;\s*(?=(?:[^']*'[^']*')*[^']*$)/); //this just scans for semicolons that are not enclosed in strings. yes there are semicolons in some of this data...

    for(const sql of sqls) {
        console.log('~~~~~~~~~~~~~~~')
        console.log(sql);
        console.log('~~~~~~~~~~~~~~~')
    }
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