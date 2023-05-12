import express, { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  getCollectionUnitsFromCategory,
  getCollectionUnitsFromCategoryId,
} from "./xref.service";
import {
  CollectionUnitCategoryIdSchema,
  CollectionUnitCategorySchema,
  xrefCollectionUnitFormats,
} from "./xref.utils";
import { formatParse, getFormat } from "../../utils/helper_functions";

export const xrefRouter = express.Router();

xrefRouter.get(
  "/collection-units",
  catchErrors(async (req: Request, res: Response) => {
    const { category_id } = CollectionUnitCategoryIdSchema.parse(req.query);
    if (category_id) {
      const response = await formatParse(
        getFormat(req),
        getCollectionUnitsFromCategoryId(category_id),
        xrefCollectionUnitFormats
      );
      return res.status(200).json(response);
    }
    const { category_name, taxon_name_common, taxon_name_latin } =
      CollectionUnitCategorySchema.parse(req.query);
    const response = await formatParse(
      getFormat(req),
      getCollectionUnitsFromCategory(
        category_name,
        taxon_name_common,
        taxon_name_latin
      ),
      xrefCollectionUnitFormats
    );
    return res.status(200).json(response);
  })
);
