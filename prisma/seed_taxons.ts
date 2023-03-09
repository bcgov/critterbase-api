import { Prisma, PrismaClient } from "@prisma/client";
import { queryRandomUUID } from "./prisma_utils";

interface Taxon {
    taxon_uuid: string,
    taxon_name: string,
    common_name?: string
}

type TreeNode<T> = {
    value: T,
    children: TreeNode<T>[]
}

const levels: Array<keyof Prisma.lk_taxonUncheckedCreateInput> = ['kingdom_id', 'phylum_id', 'class_id', 'order_id', 'family_id', 'genus_id', 'species_id']

const recursiveTaxon = async (prisma: PrismaClient, node: TreeNode<Taxon>, toInherit: Taxon[], depth: number) => {
    let toInsert: Prisma.lk_taxonUncheckedCreateInput = {
        taxon_id: node.value.taxon_uuid, 
        taxon_name_latin: node.value.taxon_name,
        taxon_name_common: node.value.common_name
    };
    for(let i = 0; i < toInherit.length; i ++) {
        toInsert = {...toInsert, [levels[i]]: toInherit[i].taxon_uuid}
    }
    await prisma.lk_taxon.create({
        data: toInsert
    });
    
    for(const child of node.children) {
        await recursiveTaxon(prisma, child, [...toInherit, node.value], depth + 1);
    }
}


const insertDefaultTaxons = async (prisma: PrismaClient) => {
    const rTarandusTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Rangifer tarandus', common_name: 'Caribou'},
        children: []
    }
    const cLupisTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Canis lupus', common_name: 'Grey Wolf'},
        children: []
    }
    const aAlcesTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Alces alces', common_name: 'Moose'},
        children: []
    }
    const uArctosTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Usrsus arctos', common_name: 'Grizzly Bear'},
        children: []
    }
    
    const rangiferTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Rangifer'},
        children: [rTarandusTaxon]
    }
    const canisTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Canis'},
        children: [cLupisTaxon]
    }
    const alcesTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Alces'},
        children: [aAlcesTaxon]
    }
    const ursusTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Ursus'},
        children: [uArctosTaxon]
    }
    
    const cervidaeTaxon:  TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Cervidae'},
        children: [alcesTaxon, rangiferTaxon]
    }
    const canidaeTaxon:  TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Canidae'},
        children: [canisTaxon]
    }
    const ursidaeTaxon:  TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Ursidae'},
        children: [ursusTaxon]
    }
    
    const artioTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Artiodactyla'},
        children: [cervidaeTaxon]
    }
    const carnivoraTaxon: TreeNode<Taxon> = { 
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Carnivora'},
        children: [canidaeTaxon, ursidaeTaxon]
    }
    
    const mammaliaTaxon: TreeNode<Taxon> = {
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Mammalia'},
        children: [artioTaxon, carnivoraTaxon]
    }
    
    const chordataTaxon: TreeNode<Taxon> = {
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Chordata'},
        children: [mammaliaTaxon]
    }
    
    const animaliaTaxon: TreeNode<Taxon> = {
        value: {taxon_uuid: await queryRandomUUID(prisma), taxon_name: 'Animalia'}, 
        children: [chordataTaxon]
    }
    await recursiveTaxon(prisma, animaliaTaxon, [], 0);
}

export {insertDefaultTaxons}