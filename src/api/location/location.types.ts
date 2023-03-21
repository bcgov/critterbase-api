import { Prisma } from "@prisma/client";
import { type } from "os";

const commonLocationSelect = Prisma.validator<Prisma.locationArgs>()({
    select: {
        latitude: true,
        longitude: true,
        lk_region_env: {
            select: {
            region_env_name: true
            }
        },
        lk_region_nr: {
            select: {
            region_nr_name: true
            }
        },
        lk_wildlife_management_unit: {
            select: {
            wmu_name: true
            }
        }
    }
})

type LocationSubsetType = Prisma.locationGetPayload<typeof commonLocationSelect>;
type FormattedLocation = Omit<LocationSubsetType, 'lk_region_env' | 'lk_region_nr' | 'lk_wildlife_management_unit'>
& {region_env_name: string, lk_region_nr: string, lk_wildlife_management_unit: string}

export {commonLocationSelect}
export type {LocationSubsetType, FormattedLocation}