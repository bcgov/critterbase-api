import express, { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { bulkCreateData } from "./bulk.service";
import { appendEnglishTaxonAsUUID } from "../critter/critter.service";
import { prisma } from "../../utils/constants";
import { appendEnglishMarkingsAsUUID } from "../marking/marking.service";
import { CritterCreateSchema } from "../critter/critter.utils";
import { MarkingCreateBodySchema } from "../marking/marking.utils";
import { CaptureCreateSchema } from "../capture/capture.utils";
import { MortalityCreateSchema } from "../mortality/mortality.utils";
import { appendDefaultCOD } from "../mortality/mortality.service";

export const bulkRouter = express.Router();

bulkRouter.post('/',
    catchErrors(async (req: Request, res: Response) => {
        console.log(JSON.stringify(req.body, null, 2));
        const { critters, collections, markings, locations, captures, mortalities } = req.body;

        const crittersAppend = await Promise.all(critters.map(async (c: any) => {
            await appendEnglishTaxonAsUUID(c)
            return CritterCreateSchema.parse(c);
        }));
        const taxonLookup: Record<string, string> = {};
        for(const c of critters) {
            taxonLookup[c.critter_id] = c.taxon_id;
        }
        const markingsAppend = await Promise.all(markings.map(async (m: any) => { 
            await appendEnglishMarkingsAsUUID(m, taxonLookup[m.critter_id]);
            return MarkingCreateBodySchema.parse(m); 
        }));

        const parsedCaptures = captures.map((c: any) => CaptureCreateSchema.parse(c));
        const parsedMortalities = await Promise.all(mortalities.map( async(m: any) => {
            await appendDefaultCOD(m);
            return MortalityCreateSchema.parse(m)
        }));

        const results = await bulkCreateData(crittersAppend, collections, markingsAppend, locations, parsedCaptures, parsedMortalities);
        return res.status(201).json(results);
    })
)