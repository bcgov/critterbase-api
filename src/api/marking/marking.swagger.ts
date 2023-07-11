import { z } from "zod";
import { markingIncludesSchema } from "./marking.utils";

export const SwaggerMarkingResponseValidation = markingIncludesSchema.omit({
    lk_colour_marking_primary_colour_idTolk_colour: true,
    lk_colour_marking_secondary_colour_idTolk_colour: true,
    lk_colour_marking_text_colour_idTolk_colour: true,
    lk_marking_type: true,
    lk_marking_material: true,
    xref_taxon_marking_body_location: true
  }).extend({
    body_location: z.string().nullable(),
    marking_type: z.string().nullable(),
    marking_material:  z.string().nullable(),
    primary_colour:z.string().nullable(),
    secondary_colour: z.string().nullable(),
    text_colour:  z.string().nullable(),
  })