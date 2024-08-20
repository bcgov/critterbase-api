import { z } from 'zod';

export const CaptureMortalityGeometrySchema = z.object({
  captures: z.array(z.object({ capture_id: z.string(), coordinates: z.array(z.number(), z.number()) })),
  mortalities: z.array(z.object({ mortality_id: z.string(), coordinates: z.array(z.number(), z.number()) }))
});

export type CaptureMortalityGeometry = z.infer<typeof CaptureMortalityGeometrySchema>;
