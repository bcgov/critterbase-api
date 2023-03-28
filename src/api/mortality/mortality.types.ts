import { cod_confidence, mortality, Prisma } from "@prisma/client";
import { z } from "zod";
import { implement, zodID } from "../../utils/zod_helpers";
import { CommonLocationSchema, commonLocationSelect, FormattedLocation } from "../location/location.types";

const mortalityInclude = Prisma.validator<Prisma.mortalityArgs>()({
    include: {
        location: {
            ...commonLocationSelect
        },
        lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: {
            select: {
                cod_category: true,
                cod_reason: true,
            }
        },
        lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: {
            select: {
                taxon_id: true,
                taxon_name_latin: true
            }
        },
        lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: {
            select: {
                cod_category: true,
                cod_reason: true,
            }
        },
        lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: {
            select: {
                taxon_id: true,
                taxon_name_latin: true
            }
        }
    }
})

const MortalityBodySchema = implement<mortality>().with({
    mortality_id: zodID,
    critter_id: zodID,
    location_id: zodID.nullable(),
    mortality_timestamp: z.coerce.date(),
    proximate_cause_of_death_id: zodID,
    proximate_cause_of_death_confidence: z.nativeEnum(cod_confidence).nullable(),
    proximate_predated_by_taxon_id: zodID.nullable(),
    ultimate_cause_of_death_id: zodID.nullable(),
    ultimate_cause_of_death_confidence:  z.nativeEnum(cod_confidence).nullable(),
    ultimate_predated_by_taxon_id: zodID.nullable(),
    mortality_comment: zodID.nullable(),
    create_user: zodID,
    update_user: zodID,
    create_timestamp: z.coerce.date(),
    update_timestamp: z.coerce.date()
});

const MortalityCreateSchema = MortalityBodySchema.extend({
    mortality_id: z.string().uuid().optional(),
    critter_id: z.string().uuid(),
    mortality_timestamp: z.coerce.date(),
    proximate_cause_of_death_id: z.string().uuid()
});

type MortalityCreate = z.infer<typeof MortalityCreateSchema>;

type MortalityIncludeType = Prisma.mortalityGetPayload<typeof mortalityInclude>;

const MortalityResponseSchema = implement<MortalityIncludeType>().with({
    mortality_id: zodID,
    critter_id: zodID,
    location_id: zodID.nullable(),
    mortality_timestamp: z.coerce.date(),
    proximate_cause_of_death_id: zodID,
    proximate_cause_of_death_confidence: z.nativeEnum(cod_confidence).nullable(),
    proximate_predated_by_taxon_id: zodID.nullable(),
    ultimate_cause_of_death_id: zodID.nullable(),
    ultimate_cause_of_death_confidence:  z.nativeEnum(cod_confidence).nullable(),
    ultimate_predated_by_taxon_id: zodID.nullable(),
    mortality_comment: zodID.nullable(),
    create_user: zodID,
    update_user: zodID,
    create_timestamp: z.coerce.date(),
    update_timestamp: z.coerce.date(),
    location: CommonLocationSchema.nullable(),
    lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: z.object({
        cod_category: z.string(),
        cod_reason: z.string().nullable()
    }),
    lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: z.object({
        cod_category: z.string(),
        cod_reason: z.string().nullable()
    }).nullable(),
    lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: z.object({
        taxon_id: zodID,
        taxon_name_latin: z.string()
    }).nullable(),
    lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: z.object({
        taxon_id: zodID,
        taxon_name_latin: z.string()
    }).nullable()
}).transform(val => {
    const {
        lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death,
        lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death,
        lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon,
        lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon,
        ...rest
    } = val;
    return {
        ...rest,
        proximate_cause_of_death: lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death,
        ultimate_cause_of_death: lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death,
        proximate_cause_of_death_taxon: lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon,
        ultimate_cause_of_death_taxon: lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon
    }
})

type FormattedMortality = z.infer<typeof MortalityResponseSchema>;

export { mortalityInclude, MortalityCreateSchema, MortalityResponseSchema }
export type { MortalityIncludeType, FormattedMortality, MortalityCreate }