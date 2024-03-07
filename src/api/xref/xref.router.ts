import express, { Request, Response } from "express";
import {
  CollectionUnitCategoryIdSchema,
  CollectionUnitCategoryQuerySchema,
  MeasurementIdsQuerySchema,
  MeasurementSearchQuery,
} from "../../schemas/xref-schema";
import { ICbDatabase } from "../../utils/database";
import { isSelectFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { tsnQuerySchema } from "../../utils/zod_helpers";

export const XrefRouter = (db: ICbDatabase) => {
  const xrefRouter = express.Router();

  /**
   * Endpoint to retrieve 'taxon collection units'.
   *
   * Optionally can return as 'select' format.
   *
   * @query category_name - Name of the collection cateogory.
   * @query itis_scientific_name - ITIS scientific name.
   *
   */
  xrefRouter.get(
    "/collection-units",
    catchErrors(async (req: Request, res: Response) => {
      const { category_name, itis_scientific_name } =
        CollectionUnitCategoryQuerySchema.parse(req.query);

      const response =
        await db.xrefService.getCollectionUnitsFromCategoryOrScientificName(
          category_name,
          itis_scientific_name
        );

      return res.status(200).json(response);
    })
  );

  /**
   * Endpoint to retrieve 'taxon collection units' from category_id.
   *
   * Optionally can return as 'select' format.
   *
   * @param category_id - Primary identifier of xref_collection_unit.
   *
   */
  xrefRouter.get(
    "/collection-units/:category_id",
    catchErrors(async (req: Request, res: Response) => {
      const { category_id } = CollectionUnitCategoryIdSchema.parse(req.params);

      const response =
        await db.xrefService.getCollectionUnitsFromCategoryId(category_id);

      return res.status(200).json(response);
    })
  );

  /**
   * Endpoint to retrieve 'taxon collection categories' by tsn.
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

      const response = await db.xrefService.getTsnCollectionCategories(
        tsn,
        format
      );

      res.status(200).json(response);
    })
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

      const response = await db.xrefService.getTsnMarkingBodyLocations(
        tsn,
        format
      );

      res.status(200).json(response);
    })
  );

  /**
   * Endpoint to retrieve 'taxon qualitative measurements' by tsn.
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

      const response = await db.xrefService.getTsnQualitativeMeasurements(
        tsn,
        format
      );

      res.status(200).json(response);
    })
  );

  /**
   * Endpoint to retrieve 'taxon qualitative measurements' by ids.
   *
   * Optionally can return as 'select' format.
   *
   * @body taxon_measurement_ids - Array of taxon measurement ids.
   *
   */
  xrefRouter.post(
    "/taxon-qualitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_measurement_ids } = MeasurementIdsQuerySchema.parse(
        req.body
      );
      const format = isSelectFormat(req);

      const response = await db.xrefService.getQualitativeMeasurementsByIds(
        taxon_measurement_ids,
        format
      );

      res.status(200).json(response);
    })
  );

  /**
   * Endpoint to retrieve 'taxon quantitative measurements' by tsn.
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

      const response = await db.xrefService.getTsnQuantitativeMeasurements(
        tsn,
        format
      );

      res.status(200).json(response);
    })
  );

  /**
   * Endpoint to retrieve 'taxon quantitative measurements' by ids.
   *
   * Optionally can return as 'select' format.
   *
   * @body taxon_measurement_ids - Array of taxon measurement ids.
   *
   */
  xrefRouter.post(
    "/taxon-quantitative-measurements",
    catchErrors(async (req: Request, res: Response) => {
      const { taxon_measurement_ids } = MeasurementIdsQuerySchema.parse(
        req.body
      );
      const format = isSelectFormat(req);

      const response = await db.xrefService.getQuantitativeMeasurementsByIds(
        taxon_measurement_ids,
        format
      );

      res.status(200).json(response);
    })
  );

  /**
   * Endpoint to retrieve measurements both 'qualitative' and 'quantitative' by tsn.
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

      const response = await db.xrefService.getTsnMeasurements(tsn, format);

      res.status(200).json(response);
    })
  );

  /**
   * Endpoint to search for measurements both 'qualitative' and 'quantitative' by search terms.
   *
   * @query search - Search properties.
   */
  xrefRouter.get(
    "/taxon-measurements/search",
    catchErrors(async (req: Request, res: Response) => {
      const search = MeasurementSearchQuery.parse(req.query);

      const response = await db.xrefService.searchForMeasurements(search);

      res.status(200).json(response);
    })
  );

  return xrefRouter;
};
