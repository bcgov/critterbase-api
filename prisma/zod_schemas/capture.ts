import * as z from "zod"
import { Completelocation, RelatedlocationSchema, Completeuser, RelateduserSchema, Completecritter, RelatedcritterSchema, Completemarking, RelatedmarkingSchema, Completemeasurement_qualitative, Relatedmeasurement_qualitativeSchema, Completemeasurement_quantitative, Relatedmeasurement_quantitativeSchema } from "./index"

export const captureSchema = z.object({
  capture_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  capture_location_id: z.string().uuid().nullish(),
  release_location_id: z.string().uuid().nullish(),
  capture_timestamp: z.date(),
  release_timestamp: z.date().nullish(),
  capture_comment: z.string().nullish(),
  release_comment: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completecapture extends z.infer<typeof captureSchema> {
  location_capture_capture_location_idTolocation?: Completelocation | null
  user_capture_create_userTouser: Completeuser
  critter: Completecritter
  location_capture_release_location_idTolocation?: Completelocation | null
  user_capture_update_userTouser: Completeuser
  marking: Completemarking[]
  measurement_qualitative: Completemeasurement_qualitative[]
  measurement_quantitative: Completemeasurement_quantitative[]
}

/**
 * RelatedcaptureSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedcaptureSchema: z.ZodSchema<Completecapture> = z.lazy(() => captureSchema.extend({
  location_capture_capture_location_idTolocation: RelatedlocationSchema.nullish(),
  user_capture_create_userTouser: RelateduserSchema,
  critter: RelatedcritterSchema,
  location_capture_release_location_idTolocation: RelatedlocationSchema.nullish(),
  user_capture_update_userTouser: RelateduserSchema,
  marking: RelatedmarkingSchema.array(),
  measurement_qualitative: Relatedmeasurement_qualitativeSchema.array(),
  measurement_quantitative: Relatedmeasurement_quantitativeSchema.array(),
}))
