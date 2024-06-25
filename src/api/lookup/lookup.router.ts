/* eslint-disable @typescript-eslint/require-await */
import { sex } from '.prisma/client';
import { cod_confidence, coordinate_uncertainty_unit, frequency_unit, measurement_unit } from '@prisma/client';
import express, { Request, Response } from 'express';
import { eCritterStatus } from '../../schemas/critter-schema';
import { prisma } from '../../utils/constants';
import { ICbDatabase } from '../../utils/database';
import { ServiceReturn, formatParse, getFormat } from '../../utils/helper_functions';
import { catchErrors } from '../../utils/middleware';
import {
  captureMethodsFormats,
  codFormats,
  collectionUnitCategoriesFormats,
  colourFormats,
  markingMaterialsFormats,
  markingTypesFormats,
  regionEnvFormats,
  regionNrFormats,
  wmuFormats
} from './lookup.utils';

export const LookupRouter = (_db: ICbDatabase) => {
  const lookupRouter = express.Router();
  const order = 'asc';

  /**
   * Critter sex
   * @example 'Male' or 'Female'
   */
  lookupRouter.get(
    '/enum/sex',
    catchErrors(async (_req: Request, res: Response) => res.status(200).json(Object.keys(sex)))
  );

  /**
   * Critter life status
   * @example 'alive' or 'mortality'
   */
  lookupRouter.get(
    '/enum/critter-status',
    catchErrors(async (_req: Request, res: Response) =>
      res.status(200).json([eCritterStatus.alive, eCritterStatus.mortality])
    )
  );

  /**
   * Cause of death confidence
   * @example 'Probable' or 'Definite'
   */
  lookupRouter.get(
    '/enum/cod-confidence',
    catchErrors(async (_req: Request, res: Response) => res.status(200).json(Object.keys(cod_confidence)))
  );

  /**
   * Coordinate uncertainty units
   * @example 'm' ie: meters
   */
  lookupRouter.get(
    '/enum/coordinate-uncertainty-unit',
    catchErrors(async (_req: Request, res: Response) => res.status(200).json(Object.keys(coordinate_uncertainty_unit)))
  );

  /**
   * Frequency units
   * @example 'Hz' or 'KHz'
   */
  lookupRouter.get(
    '/enum/frequency-units',
    catchErrors(async (_req: Request, res: Response) => res.status(200).json(Object.keys(frequency_unit)))
  );

  /**
   * Measurement units
   * @example 'millimeter' or 'killogram'
   */
  lookupRouter.get(
    '/enum/measurement-units',
    catchErrors(async (_req: Request, res: Response) => res.status(200).json(Object.keys(measurement_unit)))
  );

  /**
   * Colours
   */
  lookupRouter.get(
    '/colours',
    catchErrors(async (req: Request, res: Response) => {
      const colours = await formatParse(getFormat(req), prisma.lk_colour.findMany(), colourFormats);
      res.status(200).json(colours);
    })
  );

  /**
   * ENV Regions
   */
  lookupRouter.get(
    '/region-envs',
    catchErrors(async (req: Request, res: Response) => {
      const envs = await formatParse(getFormat(req), prisma.lk_region_env.findMany(), regionEnvFormats);
      res.status(200).json(envs);
    })
  );

  /**
   * NR Regions
   */
  lookupRouter.get(
    '/region-nrs',
    catchErrors(async (req: Request, res: Response) => {
      const nr = await formatParse(
        getFormat(req),
        prisma.lk_region_nr.findMany({ orderBy: { region_nr_name: order } }),
        regionNrFormats
      );
      res.status(200).json(nr);
    })
  );

  /**
   * Wildlife Management Units
   */
  lookupRouter.get(
    '/wmus',
    catchErrors(async (req: Request, res: Response) => {
      const rgx = '(\\d)-(\\d+)';
      const wmu = await formatParse(
        getFormat(req),
        prisma.$queryRaw`SELECT wmu_id, wmu_name, description, create_user, update_user, create_timestamp, update_timestamp FROM "critterbase"."lk_wildlife_management_unit" lwmu
        ORDER BY (regexp_matches(lwmu.wmu_name, ${rgx}))[1]::int,
          (regexp_matches(lwmu.wmu_name, ${rgx}))[2]::int;` as Promise<ServiceReturn>,
        wmuFormats
      );
      res.status(200).json(wmu);
    })
  );

  /**
   * Cause of deaths
   */
  lookupRouter.get(
    '/cods',
    catchErrors(async (req: Request, res: Response) => {
      const cod = await formatParse(
        getFormat(req),
        prisma.lk_cause_of_death.findMany({ orderBy: { cod_reason: order } }),
        codFormats
      );
      res.status(200).json(cod);
    })
  );

  /**
   * Marking Materials
   *
   */
  lookupRouter.get(
    '/marking-materials',
    catchErrors(async (req: Request, res: Response) => {
      const materials = await formatParse(
        getFormat(req),
        prisma.lk_marking_material.findMany({ orderBy: { material: order } }),
        markingMaterialsFormats
      );
      res.status(200).json(materials);
    })
  );

  /**
   * Marking types
   */
  lookupRouter.get(
    '/marking-types',
    catchErrors(async (req: Request, res: Response) => {
      const materials = await formatParse(
        getFormat(req),
        prisma.lk_marking_type.findMany({ orderBy: { name: order } }),
        markingTypesFormats
      );
      res.status(200).json(materials);
    })
  );

  /**
   * Collection Unit Categories
   */
  lookupRouter.get(
    '/collection-unit-categories',
    catchErrors(async (req: Request, res: Response) => {
      const materials = await formatParse(
        getFormat(req),
        prisma.lk_collection_category.findMany({
          orderBy: { category_name: order }
        }),
        collectionUnitCategoriesFormats
      );
      res.status(200).json(materials);
    })
  );

  /**
   * Capture Methods
   */
  lookupRouter.get(
    '/capture-methods',
    catchErrors(async (req: Request, res: Response) => {
      const materials = await formatParse(
        getFormat(req),
        prisma.lk_capture_method.findMany({
          orderBy: { method_name: order }
        }),
        captureMethodsFormats
      );
      res.status(200).json(materials);
    })
  );

  return lookupRouter;
};
