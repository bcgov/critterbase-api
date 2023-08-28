import express, { Request, Response } from "express";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import {
  taxonIdSchema,
  taxonMeasurementIdSchema,
} from "../../utils/zod_helpers";
import {
  CollectionUnitCategoryIdSchema,
  CollectionUnitCategorySchema,
  xrefCollectionUnitFormats,
  xrefTaxonCollectionCategoryFormats,
  xrefTaxonMarkingBodyLocationFormats,
  xrefTaxonMeasurementOptionSchema,
  xrefTaxonMeasurementSchema,
} from "./xref.utils";

export const XrefRouter = (db: ICbDatabase) => {
  const xrefRouter = express.Router();

  xrefRouter.get(
    "/collection-units",
    catchErrors(async (req: Request, res: Response) => {
      const { category_id } = CollectionUnitCategoryIdSchema.parse(req.query);
      if (category_id) {
        const response = await formatParse(
          getFormat(req),
          db.getCollectionUnitsFromCategoryId(category_id),
          xrefCollectionUnitFormats
        );
        return res.status(200).json(response);
      }
      const { category_name, taxon_name_common, taxon_name_latin } =
        CollectionUnitCategorySchema.parse(req.query);
      const response = await formatParse(
        getFormat(req),
        db.getCollectionUnitsFromCategory(
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
        db.getTaxonCollectionCategories(taxon_id),
        xrefTaxonCollectionCategoryFormats
      );
      res.status(200).json(response);
    })
  );

  xrefRouter.get(
    "/taxon-marking-body-locations",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_id } = taxonIdSchema.parse(req.query);
      const response = await formatParse(
        getFormat(req),
        db.getTaxonMarkingBodyLocations(taxon_id),
        xrefTaxonMarkingBodyLocationFormats
      );
      res.status(200).json(response);
    })
  );

  xrefRouter.get(
    "/taxon-marking-body-locations",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_id } = taxonIdSchema.parse(req.query);
      const response = await formatParse(
        getFormat(req),
        db.getTaxonMarkingBodyLocations(taxon_id),
        xrefTaxonMarkingBodyLocationFormats
      );
      res.status(200).json(response);
    })
  );

  xrefRouter.get(
    "/taxon-qualitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_id } = taxonIdSchema.parse(req.query);
      const response = await formatParse(
        getFormat(req),
        db.getTaxonQualitativeMeasurements(taxon_id),
        xrefTaxonMeasurementSchema
      );
      res.status(200).json(response);
    })
  );

  xrefRouter.get(
    "/taxon-qualitative-measurement-options",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_measurement_id } = taxonMeasurementIdSchema.parse(
        req.query
      );
      const response = await formatParse(
        getFormat(req),
        prisma.xref_taxon_measurement_qualitative_option.findMany({
          where: { taxon_measurement_id },
        }),
        xrefTaxonMeasurementOptionSchema
      );
      res.status(200).json(response);
    })
  );

  xrefRouter.get(
    "/taxon-quantitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_id } = taxonIdSchema.parse(req.query);
      const response = await formatParse(
        getFormat(req),
        db.getTaxonQuantitativeMeasurements(taxon_id),
        xrefTaxonMeasurementSchema
      );
      res.status(200).json(response);
    })
  );

  xrefRouter.get(
    "/taxon-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_id } = taxonIdSchema.parse(req.query);
      const response = await formatParse(
        getFormat(req),
        db.getTaxonMeasurements(taxon_id),
        xrefTaxonMeasurementSchema
      );
      res.status(200).json(response);
    })
  );

  return xrefRouter;
};
