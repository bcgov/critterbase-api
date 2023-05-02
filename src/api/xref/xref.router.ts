import express, { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { CollectionUnitCategorySchema } from "../collectionUnit/collectionUnit.utils";
import { apiError } from "../../utils/types";
import { getCollectionUnitsFromCategory } from "./xref.service";

export const xrefRouter = express.Router();

xrefRouter.get("/collection-units",
    catchErrors(async (req: Request, res: Response) => {
        const parsed = CollectionUnitCategorySchema.parse(req.query);
        const response = await getCollectionUnitsFromCategory(parsed.category_name, parsed.taxon_name_common, parsed.taxon_name_latin);
        return res.status(200).json(response);
    })    
)