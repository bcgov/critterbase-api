import { ItisService } from "../../itis/itis-service";
import { CritterbasePrisma } from "../../utils/base_classes";

export class XrefRepository extends CritterbasePrisma {
  async getCollectionUnitsFromCategoryId(category_id: string) {
    return await this.prisma.xref_collection_unit.findMany({
      where: {
        collection_category_id: category_id,
      },
    });
  }

  async asSelect_getCollectionUnitsFromCategoryId(category_id: string) {
    return await this.prisma.$queryRaw`
      SELECT collection_unit_id as id, 'collection_unit_id' as key, unit_name as value
      FROM xref_collection_unit
      WHERE category_id = ${category_id};`;
  }

  async getTsnCollectionCategories(tsn: number) {
    return await this.prisma.xref_taxon_collection_category.findMany({
      where: { itis_tsn: tsn },
      include: {
        lk_collection_category: { select: { category_name: true } },
      },
    });
  }

  // TODO: Add as select request
  async asSelect_getTsnCollectionCategories(tsn: number) {
    return await this.prisma.$queryRaw``;
  }

  /**
   * HIERARCHAL
   *
   * Get 'marking body locations' for a TSN.
   * Includes all 'marking body locations' for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnMarkingBodyLocations(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return await this.prisma.xref_taxon_marking_body_location.findMany({
      where: { itis_tsn: { in: tsns } },
    });
  }

  /**
   * HIERARCHAL
   *
   * Get 'collection unit categories' for a TSN.
   * Includes all 'collection unit categories' for hierarchies above.
   *
   * Responds as 'select' format useful for frontend components.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async asSelect_getTsnMarkingBodyLocations(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return this.prisma.$queryRaw`
      SELECT
      taxon_marking_body_location_id as id,
      'taxon_marking_body_location_id' as key,
      body_location as value
      FROM xref_taxon_marking_body_location
      WHERE itis_tsn = ANY(${tsns});`;
  }

  /**
   * HIERARCHAL REPOSITORY METHOD
   *
   * Get 'qualitative measurements' for a TSN.
   * Includes all 'qualitative measurements' for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnQualitativeMeasurements(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return await this.prisma.xref_taxon_measurement_qualitative.findMany({
      where: { itis_tsn: { in: tsns } },
    });
  }

  /**
   * HIERARCHAL
   *
   * Get 'qualitative measurements' for a TSN.
   * Includes all 'qualitative measurements' for hierarchies above.
   *
   * Responds as 'select' format useful for frontend components.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async asSelect_getTsnQualitativeMeasurements(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return await this.prisma.$queryRaw`
      SELECT taxon_measurement_id as id,
      'taxon_measurement_id' as key,
      measurement_name as value
      FROM xref_taxon_measurement_qualitative
      WHERE itis_tsn = ANY(${tsns});`;
  }

  async getTsnQualitativeMeasurementOptions(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return await this.prisma.xref_taxon_measurement_qualitative_option.findMany(
      {
        where: { itis_tsn: { in: tsns } },
      },
    );
  }

  async asSelect_getTsnQualitativeMeasurementOptions(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return await this.prisma.$queryRaw`
      SELECT taxon_measurement_id as id,
      'taxon_measurement_id' as key,
      measurement_name as value
      FROM xref_taxon_measurement_qualitative
      WHERE itis_tsn = ANY(${tsns});`;
  }

  /**
   * HIERARCHAL
   *
   * Get 'quantitative measurements' for a TSN.
   * Includes all 'quantitative measurements' for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnQuantitativeMeasurements(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return await this.prisma.xref_taxon_measurement_quantitative.findMany({
      where: { itis_tsn: { in: tsns } },
    });
  }

  /**
   * HIERARCHAL
   *
   * Get 'qualitative measurements' for a TSN.
   * Includes all 'qualitative measurements' for hierarchies above.
   *
   * Responds as 'select' format useful for frontend components.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async asSelect_getTsnQuantitativeMeasurements(tsn: number) {
    const itisService = new ItisService();
    const tsns = await itisService.getTsnHierarchy(tsn);

    return await this.prisma.$queryRaw`
      SELECT taxon_measurement_id as id,
      'taxon_measurement_id' as key,
      measurement_name as value
      FROM xref_taxon_measurement_quantitative
      WHERE itis_tsn = ANY(${tsns});`;
  }
}
