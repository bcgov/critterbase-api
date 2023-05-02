import express, { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { bulkCreateData } from "./bulk.service";
import { appendEnglishTaxonAsUUID } from "../critter/critter.service";
import { appendEnglishMarkingsAsUUID } from "../marking/marking.service";
import { CritterCreate, CritterCreateSchema } from "../critter/critter.utils";
import { MarkingCreateBodySchema, MarkingCreateInput } from "../marking/marking.utils";
import { CaptureCreate, CaptureCreateSchema } from "../capture/capture.utils";
import { MortalityCreate, MortalityCreateSchema } from "../mortality/mortality.utils";
import { appendDefaultCOD } from "../mortality/mortality.service";
import { BulkCreationSchema } from "./bulk.utils";

export const bulkRouter = express.Router();

bulkRouter.post('/',
    catchErrors(async (req: Request, res: Response) => {
        const { critters, collections, markings, locations, captures, mortalities } = BulkCreationSchema.parse(req.body);

        const crittersAppend = critters ? await Promise.all(critters.map(async (c: CritterCreate) => {
            await appendEnglishTaxonAsUUID(c)
            return CritterCreateSchema.parse(c);
        })) :  [];
        const taxonLookup: Record<string, string> = {};
        if(critters) {
            for(const c of critters) {
                if(c.critter_id) {
                    taxonLookup[c.critter_id] = c.taxon_id;
                }
            }
        }
        
        const markingsAppend = markings ? await Promise.all(markings.map(async (m: MarkingCreateInput) => { 
            if(m.critter_id) {
                await appendEnglishMarkingsAsUUID(m, taxonLookup[m.critter_id]);
            }
            return MarkingCreateBodySchema.parse(m); 
        })) : [];

        const parsedCaptures = captures ? captures.map((c: CaptureCreate) => CaptureCreateSchema.parse(c)) : [];

        const parsedMortalities = mortalities ? await Promise.all(mortalities.map( async (m: MortalityCreate) => {
            await appendDefaultCOD(m);
            return MortalityCreateSchema.parse(m)
        })) : [];

        const results = await bulkCreateData({ 
            critters: crittersAppend, 
            collections: collections ?? [], 
            markings: markingsAppend, 
            locations: locations ?? [], 
            captures: parsedCaptures, 
            mortalities: parsedMortalities
        });
        return res.status(201).json(results);
    })
)