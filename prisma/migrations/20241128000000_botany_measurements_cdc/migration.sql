----------------------------------------------------------------------------------------
-- Adding percent ENUM if not exists
----------------------------------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'measurement_unit' AND e.enumlabel = 'percent' AND n.nspname = 'critterbase'
    ) THEN
        ALTER TYPE critterbase.measurement_unit ADD VALUE 'percent';
    END IF;
END $$;
COMMIT;

----------------------------------------------------------------------------------------
-- INSERTING QUANTITATIVE BOTANY MEASUREMENTS 
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    (202422, 'circumference at breast height (CBH)', 0, 100000, 'centimeter', 'The circumference of a tree measured at 1.3 meters (4.5 feet) above the ground.'),
    (202422, 'height to live crown', 0, 1000, 'meter', 'The height to effective portion of the live crown for growth.'),
    (202422, 'height', 0, 1000, 'meter', 'The measured or estimated height.'), 
    (202422, 'percent cover', 0, 100, 'percent', 'The percent area covered.');

----------------------------------------------------------------------------------------
-- INSERTING QUALITATIVE BOTANY MEASUREMENTS 
----------------------------------------------------------------------------------------
WITH MeasurementIDs AS (
    INSERT INTO xref_taxon_measurement_qualitative (itis_tsn, measurement_name)
    VALUES
        (202422, 'life stage'),
        (202422, 'bark retention'),
        (202422, 'crown classification'),
        (202422, 'crown condition'),
        (202422, 'epiphyte extent'),
        (202422, 'epiphyte thickness'),
        (202422, 'lichen abundance'),
        (202422, 'mistletoe infection: lower third'),
        (202422, 'mistletoe infection: middle third'),
        (202422, 'mistletoe infection: upper third'),
        (202422, 'deciduous tree decay'),
        (202422, 'evergreen tree decay'),
        (202422, 'count range'), 
        (202422, 'standing tree')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)

----------------------------------------------------------------------------------------
-- INSERTING QUALITATIVE MEASUREMENT OPTIONS 
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_desc, option_value )
SELECT m.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
        VALUES
        (202422, 'life stage', 'Dead', 'Organism is or appears dead.', 0),
        (202422, 'life stage', 'Juvenile', 'Developing but not reproducing nor fully mature; seedlings and saplings.', 1),
        (202422, 'life stage', 'Mature: in bud', 'Has flower buds that are recognizable or strongly swollen.', 2),
        (202422, 'life stage', 'Mature: dispersing fruit', 'Has fruit or seed that is dispersing.', 3),
        (202422, 'life stage', 'Mature: flowering', 'Has flowers fading or completely faded.', 4),
        (202422, 'life stage', 'Mature: fading', 'Has flowers within the range of bud-break to mature flowers.', 5),
        (202422, 'life stage', 'Mature: Immature fruit', 'Has immature (green) fruit.', 6),
        (202422, 'life stage', 'Mature: Mature Fruit', 'Has mature (ripe) fruit.', 7),
        (202422, 'life stage', 'Mature: Vegetative Only', 'Lacks flower buds, flowers, and fruit.', 8),
        (202422, 'life stage', 'Senescent', 'Alive but declining in vigour and/or reproductive capacity.', 9),
        (202422, 'bark retention', 'All Bark Present', 'All bark is present.', 0),
        (202422, 'bark retention', 'Bark lost on damaged areas', 'Bark lost only on damaged areas.', 1),
        (202422, 'bark retention', 'Approximately 5% or less bark loss', 'Approximately 5% or less of the bark is lost.', 2),
        (202422, 'bark retention', 'Most Bark Present', 'Bare patches, some bark may be loose (5-25% loss).', 3),
        (202422, 'bark retention', 'Bare Sections', 'Firm and loose bark remains, about 26%-50% bark loss.', 4),
        (202422, 'bark retention', 'Most Bark Gone', 'Firm and loose bark remains (51-75% loss).', 5),
        (202422, 'bark retention', 'Trace Bark Remains', '76-99% bark loss.', 6),
        (202422, 'bark retention', 'No Bark', 'Total (100%) bark loss.', 7),
        (202422, 'crown classification', 'Codominant', 'Trees with crowns forming the general level of the crown canopy; crown is generally smaller than those of the dominant trees and usually more crowded on the sides.', 0),
        (202422, 'crown classification', 'Dominant', 'Trees with crown extending above the general level of the layer; somewhat taller than the codominant trees, and have well developed crowns, which may be somewhat crowded on the sides.', 1),
        (202422, 'crown classification', 'Intermediate', 'Trees with crowns below but extending into the general level of the crown canopy; crowns usually small and quite crowded on the sides.', 2),
        (202422, 'crown classification', 'Suppressed', 'Trees with crowns entirely below the general level of the crown canopy.', 3),
        (202422, 'crown condition', 'Pristine', 'All foliage, twigs, and branches present.', 0),
        (202422, 'crown condition', 'Partial Foliage Loss', 'Some or all foliage lost; possibly some twigs lost; all branches usually present; possible broken top.', 1),
        (202422, 'crown condition', 'Defoliated', 'No foliage present; up to 50% of twigs lost; most branches present; possible broken top.', 2),
        (202422, 'crown condition', 'Severely Damaged', 'No foliage or twigs present; up to 50% of branches lost; top usually broken.', 3),
        (202422, 'crown condition', 'Mostly Denuded', 'Most branches gone; some sound branch stubs remain; top broken.', 4),
        (202422, 'crown condition', 'Bare', 'No branches present; some sound and rotting branch stubs, top broken.', 5),
        (202422, 'epiphyte extent', 'None', 'No epiphytes present.', 0),
        (202422, 'epiphyte extent', 'Trace', 'Trace amounts of epiphytes present.', 1),
        (202422, 'epiphyte extent', 'Coverage: 1-33%', 'Epiphyte coverage is between 1% and 33%.', 2),
        (202422, 'epiphyte extent', 'Coverage: 34-66%', 'Epiphyte coverage is between 34% and 66%.', 3),
        (202422, 'epiphyte extent', 'Coverage: 67-100%', 'Epiphyte coverage is between 67% and 100%.', 4),
        (202422, 'epiphyte thickness', 'Sparse', 'Epiphytes are present in sparse amounts.', 0),
        (202422, 'epiphyte thickness', 'Thick mat', 'Epiphytes form a thick mat.', 1),
        (202422, 'lichen abundance', 'No Lichen', 'Zero grams of lichen within 4.5m of the root collar.', 0),
        (202422, 'lichen abundance', 'Class 1 Abundance', '0-5 grams of lichen within 4.5m of the root collar.', 1),
        (202422, 'lichen abundance', 'Class 2 Abundance', '5-50g of lichen within 4.5m of the root collar.', 2),
        (202422, 'lichen abundance', 'Class 3 Abundance', '50-250g of lichen within 4.5m of the root collar.', 3),
        (202422, 'lichen abundance', 'Class 4 Abundance', '250-650g of lichen within 4.5m of the root collar.', 4),
        (202422, 'lichen abundance', 'Class 5 Abundance', 'Greater than 625g of lichen within 4.5m of the root collar.', 5),
        (202422, 'mistletoe infection: lower third', 'None', 'No mistletoe infection in the lower third.', 0),
        (202422, 'mistletoe infection: lower third', 'Light', 'Light mistletoe infection in the lower third.', 1),
        (202422, 'mistletoe infection: lower third', 'Heavy', 'Heavy mistletoe infection in the lower third.', 2),
        (202422, 'mistletoe infection: middle third', 'None', 'No mistletoe infection in the middle third.', 0),
        (202422, 'mistletoe infection: middle third', 'Light', 'Light mistletoe infection in the middle third.', 1),
        (202422, 'mistletoe infection: middle third', 'Heavy', 'Heavy mistletoe infection in the middle third.', 2),
        (202422, 'mistletoe infection: upper third', 'None', 'No mistletoe infection in the upper third.', 0),
        (202422, 'mistletoe infection: upper third', 'Light', 'Light mistletoe infection in the upper third.', 1),
        (202422, 'mistletoe infection: upper third', 'Heavy', 'Heavy mistletoe infection in the upper third.', 2),
        (202422, 'deciduous tree decay', 'No decay', 'Tree is live/healthy.', 0),
        (202422, 'deciduous tree decay', 'Live with defects', 'Most limbs intact, some internal rot, top usually broken.', 1),
        (202422, 'deciduous tree decay', 'Dead Stage 1 - Limbless', 'Most limbs gone, top broken, extensive heartrot.', 2),
        (202422, 'deciduous tree decay', 'Dead Stage 2 - Snag', 'Top 1/3 or more broken off, no branches, extensive heartrot.', 3),
        (202422, 'deciduous tree decay', 'Dead Stage 3 - Fallen', 'Downed trees, coarse woody debris.', 4),
        (202422, 'evergreen tree decay', 'Healthy', 'Live/healthy.', 0),
        (202422, 'evergreen tree decay', 'Damaged', 'Live/diseased or damaged.', 1),
        (202422, 'evergreen tree decay', 'Dead - Intact', 'Dead/very hard wood with little external deterioration.', 2),
        (202422, 'evergreen tree decay', 'Dead - Slightly Deteriorated', 'Dead/hard wood with some external deterioration.', 3),
        (202422, 'evergreen tree decay', 'Dead - Moderately Deteriorated', 'Dead/spongy wood with extensive external deterioration.', 4),
        (202422, 'evergreen tree decay', 'Dead - Broken Trunk', 'Dead/soft wood, trunk broken-off.', 5),
        (202422, 'evergreen tree decay', 'Dead - Severely Decayed', 'Dead/very soft wood, trunk broken-off.', 6),
        (202422, 'evergreen tree decay', 'Decayed Stump', 'Decayed stump.', 7),
        (202422, 'evergreen tree decay', 'Debris', 'Debris.', 8),
        (202422, 'count range', '1 - 50', 'Count range between 1 and 50.', 0),
        (202422, 'count range', '51 - 250', 'Count range between 51 and 250.', 1),
        (202422, 'count range', '251 - 1,000', 'Count range between 251 and 1,000.', 2),
        (202422, 'count range', '1,001 - 2,500', 'Count range between 1,001 and 2,500.', 3),
        (202422, 'count range', '2,501 - 10,000', 'Count range between 2,501 and 10,000.', 4),
        (202422, 'count range', '10,001 - 100,000', 'Count range between 10,001 and 100,000.', 5),
        (202422, 'count range', '> 100,000', 'Count range greater than 100,000.', 6),
        (202422, 'count range', '1 - 250', 'Count range between 1 and 250.', 7),
        (202422, 'count range', '251 - 2,500', 'Count range between 251 and 2,500.', 8),
        (202422, 'count range', '2,501 - 100,000', 'Count range between 2,501 and 100,000.', 9),
        (202422, 'count range', '51 - 1,000', 'Count range between 51 and 1,000.', 10),
        (202422, 'count range', '1,001 - 10,000', 'Count range between 1,001 and 10,000.', 11),
        (202422, 'standing tree', 'True', 'Tree is standing.', 0),
        (202422, 'standing tree', 'False', 'Tree is not standing.', 1)
    ) AS o (itis_tsn, measurement_name, option_label, option_desc, option_value)
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_name = m.measurement_name;
