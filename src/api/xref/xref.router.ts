import express, { Request, Response } from "express";
import { CollectionUnitCategoryIdSchema } from "../../schemas/xref-schema";
import { ICbDatabase } from "../../utils/database";
import { isSelectFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import {
  taxonMeasurementIdSchema,
  tsnQuerySchema,
} from "../../utils/zod_helpers";

export const XrefRouter = (db: ICbDatabase) => {
  const xrefRouter = express.Router();

  xrefRouter.get(
    "/collection-units",
    catchErrors(async (req: Request, res: Response) => {
      const { category_id } = CollectionUnitCategoryIdSchema.parse(req.query);

      const xrefService = new db.XrefService();

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

  /**
   * Endpoint to retrieve 'taxon collection categories'.
   *
   * Optionally can return as 'select' format.
   *
   * @query tsn - ITIS TSN identifier
   *
   */
  xrefRouter.get(
    "/taxon-collection-categories",
    catchErrors(async (req: Request, res: Response) => {
      const { tsn } = tsnQuerySchema.parse(req.query);
      const format = isSelectFormat(req);

      const xrefService = new db.XrefService();

      const response = await xrefService.getTsnCollectionCategories(
        tsn,
        format,
      );

      res.status(200).json(response);
    }),
  );

  /**
   * Endpoint to retrieve 'taxon marking body locations' from TSN query.
   *
   * Optionally can return as 'select' format.
   *
   * @query tsn - ITIS TSN identifier
   */
  xrefRouter.get(
    "/taxon-marking-body-locations",
    catchErrors(async (req: Request, res: Response) => {
      const { tsn } = tsnQuerySchema.parse(req.query);
      const format = isSelectFormat(req);

      const xrefService = new db.XrefService();

      const response = await xrefService.getTsnMarkingBodyLocations(
        tsn,
        format,
      );

      res.status(200).json(response);
    }),
  );

  /**
   * Endpoint to retrieve 'taxon qualitative measurements'
   *
   * Optionally can return as 'select' format.
   *
   * @query tsn - ITIS TSN identifier
   *
   */
  xrefRouter.get(
    "/taxon-qualitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { tsn } = tsnQuerySchema.parse(req.query);
      const format = isSelectFormat(req);

      const xrefService = new db.XrefService();

      const response = await xrefService.getTsnQualitativeMeasurements(
        tsn,
        format,
      );

      res.status(200).json(response);
    }),
  );

  /**
   * Endpoint to retrieve 'taxon qualitative measurement options'.
   *
   * Optionally can return as 'select' format.
   *
   * @query taxon_measurement_id - xref_qualitative_measurement_options primary key.
   */
  xrefRouter.get(
    "/taxon-qualitative-measurement-options",
    catchErrors(async (req: Request, res: Response) => {
      const query = taxonMeasurementIdSchema.parse(req.query);
      const format = isSelectFormat(req);

      const xrefService = new db.XrefService();

      const response = await xrefService.getQualitativeMeasurementOptions(
        query.taxon_measurement_id,
        format,
      );

      res.status(200).json(response);
    }),
  );

  /**
   * Endpoint to retrieve 'taxon quantitative measurements'.
   *
   * Optionally can return as 'select' format.
   *
   * @query tsn - ITIS TSN identifier
   */
  xrefRouter.get(
    "/taxon-quantitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { tsn } = tsnQuerySchema.parse(req.query);
      const format = isSelectFormat(req);

      const xrefService = new db.XrefService();

      const response = await xrefService.getTsnQuantitativeMeasurements(
        tsn,
        format,
      );

      res.status(200).json(response);
    }),
  );

  /**
   * Endpoint to retrieve 'measurements' both qualitative and quantitative.
   *
   * Optionally can return as 'select' format.
   *
   * @query tsn - ITIS TSN identifier
   */
  xrefRouter.get(
    "/taxon-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { tsn } = tsnQuerySchema.parse(req.query);
      const format = isSelectFormat(req);

      const xrefService = new db.XrefService();

      const response = await xrefService.getTsnMeasurements(tsn, format);

      res.status(200).json(response);
    }),
  );

  return xrefRouter;
};
