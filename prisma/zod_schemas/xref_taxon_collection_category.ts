import * as z from "zod"
import { Completelk_collection_category, Relatedlk_collection_categorySchema, Completelk_taxon, Relatedlk_taxonSchema } from "./index"

export const xref_taxon_collection_categorySchema = z.object({
  collection_category_id: z.string().uuid(),
  taxon_id: z.string().uuid(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.string(),
})

export interface Completexref_taxon_collection_category extends z.infer<typeof xref_taxon_collection_categorySchema> {
  lk_collection_category: Completelk_collection_category
  lk_taxon: Completelk_taxon
}

/**
 * Relatedxref_taxon_collection_categorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedxref_taxon_collection_categorySchema: z.ZodSchema<Completexref_taxon_collection_category> = z.lazy(() => xref_taxon_collection_categorySchema.extend({
  lk_collection_category: Relatedlk_collection_categorySchema,
  lk_taxon: Relatedlk_taxonSchema,
}))
