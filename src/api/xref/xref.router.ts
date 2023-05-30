import express, { Request, Response } from "express";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { taxonIdSchema } from "../../utils/zod_helpers";
import {
  getCollectionUnitsFromCategory,
  getCollectionUnitsFromCategoryId,
  getTaxonCollectionCategories,
  getTaxonMarkingBodyLocations,
} from "./xref.service";
import {
  CollectionUnitCategoryIdSchema,
  CollectionUnitCategorySchema,
  xrefCollectionUnitFormats,
  xrefTaxonCollectionCategoryFormats,
  xrefTaxonMarkingBodyLocationSchema,
} from "./xref.utils";

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

xrefRouter.get(
  "/taxon-collection-categories",
  catchErrors(async (req: Request, res: Response) => {
    const { taxon_id } = taxonIdSchema.parse(req.query);
    const response = await formatParse(
      getFormat(req),
      getTaxonCollectionCategories(taxon_id),
      xrefTaxonCollectionCategoryFormats
    );
    res.status(200).json(response);
  })
);

xrefRouter.get(
  "/taxon-marking-body-locations",
  catchErrors(async (req: Request, res: Response) => {
    const { taxon_id } = taxonIdSchema.parse(req.query);
    console.log(taxon_id);
    const response = await formatParse(
      getFormat(req),
      getTaxonMarkingBodyLocations(taxon_id),
      xrefTaxonMarkingBodyLocationSchema
    );
    res.status(200).json(response);
  })
);
