import express, { Request, Response } from "express";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import {
  taxonIdSchema,
  taxonMeasurementIdSchema,
  tsnQuerySchema,
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
      const xrefService = new db.XrefService(getFormat(req));

      const { category_id } = CollectionUnitCategoryIdSchema.parse(req.query);

      if (category_id) {
        const response =
          await xrefService.getCollectionUnitsFromCategoryId(category_id);

        return res.status(200).json(response);
      }

      return res.status(404).json({ error: "missing endpoint branch TODO" });
      // TODO: Need a solution for this part
      // const { category_name, taxon_name_common, taxon_name_latin } =
      //   CollectionUnitCategorySchema.parse(req.query);
      // const response = await formatParse(
      //   getFormat(req),
      //   db.getCollectionUnitsFromCategory(
      //     category_name,
      //     taxon_name_common,
      //     taxon_name_latin,
      //   ),
      //   xrefCollectionUnitFormats,
      // );
      // return res.status(200).json(response);
    }),
  );

  xrefRouter.get(
    "/taxon-collection-categories",
    catchErrors(async (req: Request, res: Response) => {
      const xrefService = new db.XrefService(getFormat(req));

      const { tsn } = tsnQuerySchema.parse(req.query);

      const response = await xrefService.getTsnCollectionCategories(tsn);

      res.status(200).json(response);
    }),
  );

  xrefRouter.get(
    "/taxon-marking-body-locations",
    catchErrors(async (req: Request, res: Response) => {
      const xrefService = new db.XrefService(getFormat(req));

      const { tsn } = tsnQuerySchema.parse(req.query);

      const response = await xrefService.getTsnMarkingBodyLocations(tsn);

      res.status(200).json(response);
    }),
  );

  xrefRouter.get(
    "/taxon-qualitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const xrefService = new db.XrefService(getFormat(req));

      const { tsn } = tsnQuerySchema.parse(req.query);

      const response = await xrefService.getTsnQualitativeMeasurements(tsn);

      res.status(200).json(response);
    }),
  );

  xrefRouter.get(
    "/taxon-qualitative-measurement-options",
    catchErrors(async (req: Request, res: Response) => {
      const xrefService = new db.XrefService(getFormat(req));

      const { tsn } = tsnQuerySchema.parse(req.query);

      const response =
        await xrefService.getTsnQualitativeMeasurementOptions(tsn);

      res.status(200).json(response);
    }),
  );

  xrefRouter.get(
    "/taxon-quantitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const xrefService = new db.XrefService(getFormat(req));

      const { tsn } = tsnQuerySchema.parse(req.query);

      const response = await xrefService.getTsnQuantitativeMeasurements(tsn);

      res.status(200).json(response);
    }),
  );

  xrefRouter.get(
    "/taxon-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const xrefService = new db.XrefService(getFormat(req));

      const { tsn } = tsnQuerySchema.parse(req.query);

      const response = await xrefService.getTsnMeasurements(tsn);

      res.status(200).json(response);
    }),
  );

  return xrefRouter;
};
