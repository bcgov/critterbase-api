import { lk_colour, lk_marking_type, xref_taxon_marking_body_location } from "@prisma/client"
import { prisma } from "../../utils/constants"

const getColourByName = async (name: string): Promise<lk_colour | null> => {
    return prisma.lk_colour.findFirst({
        where: { colour: {equals: name, mode: 'insensitive' } }
    })
}

const getBodyLocationByNameAndTaxonUUID = async (body_name: string, taxon_uuid: string): Promise<xref_taxon_marking_body_location | null> => {
    return prisma.xref_taxon_marking_body_location.findFirst({
        where: {
            body_location: { equals: body_name, mode: 'insensitive' },
            taxon_id: taxon_uuid
        }
    })
}

const getMarkingTypeByName = async (marking_name: string): Promise<lk_marking_type | null> => {
    return prisma.lk_marking_type.findFirst({
        where: {
            name: { equals: marking_name, mode: 'insensitive'}
        }
    })
}

export {
    getColourByName,
    getMarkingTypeByName,
    getBodyLocationByNameAndTaxonUUID
}