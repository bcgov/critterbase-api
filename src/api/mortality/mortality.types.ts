import { cod_confidence, mortality, Prisma } from "@prisma/client";
import { z } from "zod";
import { commonLocationSelect, FormattedLocation } from "../location/location.types";

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

const MortalityUpdateBodySchema = z.object({
    critter_id: z.string().uuid().optional(),
    location_id: z.string().uuid().optional().nullable(),
    mortality_timestamp: z.coerce.date().optional(),
    proximate_cause_of_death_id: z.string().uuid().optional(),
    proximate_cause_of_death_confidence: z.nativeEnum(cod_confidence).optional().nullable(),
    proximate_predated_by_taxon_id: z.string().uuid().optional().nullable(),
    ultimate_cause_of_death_id: z.string().uuid().optional().nullable(),
    ultimate_cause_of_death_confidence:  z.nativeEnum(cod_confidence).optional().nullable(),
    ultimate_predated_by_taxon_id: z.string().uuid().optional().nullable(),
    mortality_comment: z.string().optional().nullable()
});

const MortalityCreateBodySchema = MortalityUpdateBodySchema.extend({
    mortality_id: z.string().uuid().optional(),
    critter_id: z.string().uuid(),
    mortality_timestamp: z.coerce.date(),
    proximate_cause_of_death_id: z.string().uuid()
});

type MortalityCreate = z.infer<typeof MortalityCreateBodySchema>;
type MortalityUpdate = z.infer<typeof MortalityUpdateBodySchema>;

type MortalityIncludeType = Prisma.mortalityGetPayload<typeof mortalityInclude>
type FormattedMortality = mortality & {
    mortality_location?: FormattedLocation,
    pcod_reason: string,
    pcod_taxon_name_latin?: string,
    ucod_reason?: string,
    ucod_taxon_name_latin?: string
}

export { mortalityInclude, MortalityCreateBodySchema, MortalityUpdateBodySchema }
export type { MortalityIncludeType, FormattedMortality, MortalityCreate, MortalityUpdate}