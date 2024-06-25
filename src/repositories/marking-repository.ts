import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DetailedCritterMarkingSchema, IDetailedCritterMarking } from '../schemas/critter-schema';
import { zodID } from '../utils/zod_helpers';
import { Repository } from './base-repository';

export class MarkingRepository extends Repository {
  async findInvalidMarkingIdsFromTsnHierarchy(markingIds: string[], tsnHierarchy: number[]) {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT m.marking_id
        FROM marking m
        JOIN xref_taxon_marking_body_location x
          ON m.taxon_marking_body_location_id = x.taxon_marking_body_location_id
        WHERE m.marking_id = ANY(${markingIds}::uuid[])
        AND x.itis_tsn != ALL (${tsnHierarchy});`,
      z.object({ marking_id: zodID }).array()
    );

    return result;
  }

  /**
   * Find a critter's markings.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterMarking[]>} markings.
   */
  async findCritterMarkings(critterId: string): Promise<IDetailedCritterMarking[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.marking_id,
          m.capture_id,
          m.mortality_id,
          b.taxon_marking_body_location_id,
          b.body_location,
          m.marking_type_id,
          t.name as marking_type,
          mt.material,
          mt.marking_material_id,
          c1.colour as primary_colour,
          m.primary_colour_id,
          c2.colour as secondary_colour,
          m.secondary_colour_id,
          c3.colour as text_colour,
          m.text_colour_id,
          m.identifier,
          m.frequency,
          m.frequency_unit,
          m.order,
          m.attached_timestamp,
          m.removed_timestamp,
          m.comment
        FROM marking m
        LEFT JOIN xref_taxon_marking_body_location b
          ON m.taxon_marking_body_location_id = b.taxon_marking_body_location_id
        LEFT JOIN lk_marking_type t
          ON t.marking_type_id = m.marking_type_id
        LEFT JOIN lk_marking_material mt
          ON mt.marking_material_id = m.marking_material_id
        LEFT JOIN lk_colour c1
          ON c1.colour_id = m.primary_colour_id
        LEFT JOIN lk_colour c2
          ON c2.colour_id = m.secondary_colour_id
        LEFT JOIN lk_colour c3
          ON c3.colour_id = m.text_colour_id
        WHERE m.critter_id = ${critterId}::uuid
        `,
      z.array(DetailedCritterMarkingSchema)
    );

    return result;
  }
}
