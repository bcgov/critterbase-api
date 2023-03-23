import { location } from "@prisma/client";
import { z } from "zod";
// Zod Schemas
const LocationBodySchema = z.object({
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  coordinate_uncertainty: z.number().nullable().optional(),
  coordinate_uncertainty_unit: z.enum(["m"]).default("m").nullable().optional(),
  wmu_id: z.string().uuid().nullable().optional(),
  region_nr_id: z.string().uuid().nullable().optional(),
  region_env_id: z.string().uuid().nullable().optional(),
  elevation: z.number().min(0).nullable().optional(),
  temperature: z.number().min(-100).max(100).nullable().optional(),
  location_comment: z.string().max(100).nullable().optional(),
});

type LocationBody = z.infer<typeof LocationBodySchema>;

type LocationExcludes =
  | "lk_wildlife_management_unit"
  | "lk_region_nr"
  | "lk_region_env"
  | keyof Pick<location, "wmu_id" | "region_nr_id" | "region_env_id">;

type FormattedLocation = Omit<
  location & {
    lk_wildlife_management_unit: {
      wmu_name: string;
    } | null;
    lk_region_nr: {
      region_nr_name: string;
    } | null;
    lk_region_env: {
      region_env_name: string;
    } | null;
  },
  LocationExcludes
> | null;

export {
  LocationBody,
  LocationBodySchema,
  LocationExcludes,
  FormattedLocation,
};
