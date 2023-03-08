import nrRegionJson from './region_data/ADM_NR_REGIONS_SP.json'
import envRegionJson from './region_data/EADM_WLAP_REGION_BND_AREA_SVW.json'
import wmuJson from './region_data/WAA_WILDLIFE_MGMT_UNITS_SVW.json'
import popUnitJson from './region_data/GCPB_CARIBOU_POPULATION_SP.json'

interface RegionStructure {
    tableName: string,
    importedJson: any,
    tableUnitName: string,
    tableGeomName: string,
    tableIdName: string,
    jsonRegionName: string,
    isMultiPolygon: boolean
}


const regionStructureList: RegionStructure[] = [
    {
        tableName: 'lk_region_nr',
        tableIdName: 'region_nr_id',
        tableUnitName: 'region_nr_name',
        tableGeomName: 'region_geom',
        importedJson: nrRegionJson,
        jsonRegionName: 'REGION_NAME',
        isMultiPolygon: false
    },
    {
        tableName: 'lk_region_env',
        tableIdName: 'region_env_id',
        tableUnitName: 'region_env_name',
        tableGeomName: 'region_geom',
        importedJson: envRegionJson,
        jsonRegionName: 'REGION_NAME',
        isMultiPolygon: true
    },
    {
        tableName: 'lk_wildlife_management_unit',
        tableIdName: 'wmu_id',
        tableUnitName: 'wmu_name',
        tableGeomName: 'wmu_geom',
        importedJson: wmuJson,
        jsonRegionName: 'WILDLIFE_MGMT_UNIT_ID',
        isMultiPolygon: false
    },
    {
        tableName: 'lk_population_unit_temp',
        tableIdName: 'population_unit_id',
        tableUnitName: 'unit_name',
        tableGeomName: 'unit_geom',
        importedJson: popUnitJson,
        jsonRegionName: 'HERD_NAME',
        isMultiPolygon: true
    }
]

export {regionStructureList}