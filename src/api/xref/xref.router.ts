import express, { Request, Response } from "express";
import { ICbDatabase } from "../../utils/database";
import { isSelectFormat, toSelectFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import {
  taxonMeasurementIdSchema,
  tsnQuerySchema,
} from "../../utils/zod_helpers";
import { CollectionUnitCategoryIdSchema } from "./xref.utils";

export const XrefRouter = (db: ICbDatabase) => {
  const xrefRouter = express.Router();

  xrefRouter.get(
    "/collection-units",
    catchErrors(async (req: Request, res: Response) => {
      const xrefService = new db.XrefService();

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
      const xrefService = new db.XrefService();

      const { tsn } = tsnQuerySchema.parse(req.query);

      const data = await xrefService.getTsnCollectionCategories(tsn);

      const response = isSelectFormat(req)
        ? toSelectFormat(data, "collection_category_id", "category_name")
        : data;

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
      const xrefService = new db.XrefService();

      const { tsn } = tsnQuerySchema.parse(req.query);

      const data = await xrefService.getTsnMarkingBodyLocations(tsn);

      const response = isSelectFormat(req)
        ? toSelectFormat(
            data,
            "taxon_marking_body_location_id",
            "body_location",
          )
        : data;

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
      const xrefService = new db.XrefService();

      const { tsn } = tsnQuerySchema.parse(req.query);

      const data = await xrefService.getTsnQualitativeMeasurements(tsn);

      const response = isSelectFormat(req)
        ? toSelectFormat(data, "taxon_measurement_id", "measurement_name")
        : data;

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
      const xrefService = new db.XrefService();

      const { taxon_measurement_id } = taxonMeasurementIdSchema.parse(
        req.query,
      );

      const data =
        await xrefService.getQualitativeMeasurementOptions(
          taxon_measurement_id,
        );

      const response = isSelectFormat(req)
        ? toSelectFormat(data, "taxon_measurement_id", "option_value")
        : data;

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
      const xrefService = new db.XrefService();

      const { tsn } = tsnQuerySchema.parse(req.query);

      const data = await xrefService.getTsnQuantitativeMeasurements(tsn);

      const response = isSelectFormat(req)
        ? toSelectFormat(data, "taxon_measurement_id", "measurement_name")
        : data;

      res.status(200).json(response);
    }),
  );

  return xrefRouter;
};
