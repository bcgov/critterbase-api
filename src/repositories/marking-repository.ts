import { Prisma } from '@prisma/client';
import { z } from 'zod';
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
}
