import * as z from "zod"
import { coordinate_uncertainty_unit } from "@prisma/client"
import { Completecapture, RelatedcaptureSchema, Completeuser, RelateduserSchema, Completelk_wildlife_management_unit, Relatedlk_wildlife_management_unitSchema, Completelk_region_env, Relatedlk_region_envSchema, Completelk_region_nr, Relatedlk_region_nrSchema, Completemortality, RelatedmortalitySchema } from "./index"

export const locationSchema = z.object({
  location_id: z.string().uuid(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  coordinate_uncertainty: z.number().nullish(),
  coordinate_uncertainty_unit: z.nativeEnum(coordinate_uncertainty_unit).nullish(),
  wmu_id: z.string().uuid().nullish(),
  region_nr_id: z.string().uuid().nullish(),
  region_env_id: z.string().uuid().nullish(),
  elevation: z.number().nullish(),
  temperature: z.number().nullish(),
  location_comment: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelocation extends z.infer<typeof locationSchema> {
  capture_capture_capture_location_idTolocation: Completecapture[]
  capture_capture_release_location_idTolocation: Completecapture[]
  user_location_create_userTouser: Completeuser
  user_location_update_userTouser: Completeuser
  lk_wildlife_management_unit?: Completelk_wildlife_management_unit | null
  lk_region_env?: Completelk_region_env | null
  lk_region_nr?: Completelk_region_nr | null
  mortality: Completemortality[]
}

/**
 * RelatedlocationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedlocationSchema: z.ZodSchema<Completelocation> = z.lazy(() => locationSchema.extend({
  capture_capture_capture_location_idTolocation: RelatedcaptureSchema.array(),
  capture_capture_release_location_idTolocation: RelatedcaptureSchema.array(),
  user_location_create_userTouser: RelateduserSchema,
  user_location_update_userTouser: RelateduserSchema,
  lk_wildlife_management_unit: Relatedlk_wildlife_management_unitSchema.nullish(),
  lk_region_env: Relatedlk_region_envSchema.nullish(),
  lk_region_nr: Relatedlk_region_nrSchema.nullish(),
  mortality: RelatedmortalitySchema.array(),
}))
