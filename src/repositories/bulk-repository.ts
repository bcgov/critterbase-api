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

export class BulkRepository extends Repository {
  async createEntities(payload: IBulkCreate) {
    return this.transactionHandler(async () => {
      /**
       * Create critters, captures and mortalities first as other entities are dependant on these ids.
       */
      const critter = await this.prisma.critter.createMany({ data: payload.critters });
      const capture = await this.prisma.capture.createMany({ data: payload.captures });
      const mortality = await this.prisma.mortality.createMany({ data: payload.mortalities });

      /**
       * Create related entities
       */
      const bulkResponse = await Promise.all([
        this.prisma.critter_collection_unit.createMany({ data: payload.collections }),
        this.prisma.location.createMany({ data: payload.locations }),
        this.prisma.marking.createMany({ data: payload.markings }),
        this.prisma.measurement_qualitative.createMany({ data: payload.qualitative_measurements }),
        this.prisma.measurement_quantitative.createMany({ data: payload.quantitative_measurements }),
        this.prisma.family.createMany({ data: payload.families }),
        this.prisma.family_parent.createMany({ data: payload.family_parents }),
        this.prisma.family_child.createMany({ data: payload.family_children })
      ]);

      return {
        created: {
          critters: critter.count,
          captures: capture.count,
          mortalities: mortality.count,
          collections: bulkResponse[0].count,
          locations: bulkResponse[1].count,
          markings: bulkResponse[2].count,
          qualitative_measurements: bulkResponse[3].count,
          quantitative_measurements: bulkResponse[4].count,
          families: bulkResponse[5].count,
          family_parents: bulkResponse[6].count,
          family_children: bulkResponse[7].count
        }
      };
    });
  }
}
