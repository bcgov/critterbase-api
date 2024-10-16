import { Prisma } from '@prisma/client';
import { Repository } from './base-repository';

interface IBulkCreate {
  critters: Prisma.critterCreateManyInput[];
  collections: Prisma.critter_collection_unitCreateManyInput[];
  markings: Prisma.markingCreateManyInput[];
  quantitative_measurements: Prisma.measurement_quantitativeCreateManyInput[];
  qualitative_measurements: Prisma.measurement_qualitativeCreateManyInput[];
  locations: Prisma.locationCreateManyInput[];
  captures: Prisma.captureCreateManyInput[];
  mortalities: Prisma.mortalityCreateManyInput[];
  families: Prisma.familyCreateManyInput[];
  family_parents: Prisma.family_parentCreateManyInput[];
  family_children: Prisma.family_childCreateManyInput[];
}

/**
 * Bulk Repository
 * Handles multiple create / update / get actions for related Critter entities.
 *
 * @export
 * @class BulkRepository
 * @extends Repository
 */
export class BulkRepository extends Repository {
  /**
   * Create Critters with related attributes.
   *
   * @async
   * @param {IBulkCreate} payload - Bulk create payload
   * @returns {*}
   */
  async createEntities(payload: IBulkCreate) {
    /**
     * Create critters, locations, captures and mortalities first as other entities are dependant on these ids.
     */
    const critters = await this.prisma.critter.createMany({ data: payload.critters });
    const locations = await this.prisma.location.createMany({ data: payload.locations });
    const captures = await this.prisma.capture.createMany({ data: payload.captures });
    const mortalities = await this.prisma.mortality.createMany({ data: payload.mortalities });

    /**
     * Create related entities.
     */
    const bulkResponse = await Promise.all([
      this.prisma.critter_collection_unit.createMany({ data: payload.collections }),
      this.prisma.marking.createMany({ data: payload.markings }),
      this.prisma.measurement_qualitative.createMany({ data: payload.qualitative_measurements }),
      this.prisma.measurement_quantitative.createMany({ data: payload.quantitative_measurements }),
      this.prisma.family.createMany({ data: payload.families }),
      this.prisma.family_parent.createMany({ data: payload.family_parents }),
      this.prisma.family_child.createMany({ data: payload.family_children })
    ]);

    /**
     * Return a count of each attribute that was created.
     */
    return {
      created: {
        critters: critters.count,
        locations: locations.count,
        captures: captures.count,
        mortalities: mortalities.count,
        collections: bulkResponse[0].count,
        markings: bulkResponse[1].count,
        qualitative_measurements: bulkResponse[2].count,
        quantitative_measurements: bulkResponse[3].count,
        families: bulkResponse[4].count,
        family_parents: bulkResponse[5].count,
        family_children: bulkResponse[6].count
      }
    };
  }
}
