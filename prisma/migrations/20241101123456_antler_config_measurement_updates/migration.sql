-- Delete existing quantitative measurements for 'antler point count'
DELETE FROM "xref_taxon_measurement_quantitative"
WHERE measurement_name = 'antler point count';

-- Insert new quantitative measurements related to antler points
INSERT INTO "xref_taxon_measurement_quantitative" (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    (180692, 'antler point count - total', 0, 10000, NULL, 'Total number of antler points, an indicator of age and genetic quality in ecological studies'),
    (180692, 'antler point count - left', 0, 10000, NULL, 'Number of antler points on the left side, used to assess asymmetry and overall antler development'),
    (180692, 'antler point count - right', 0, 10000, NULL, 'Number of antler points on the right side, used to assess asymmetry and overall antler development');

-- Delete existing qualitative options for antler configuration
DELETE FROM "xref_taxon_measurement_qualitative_option"
WHERE taxon_measurement_id IN (
    SELECT taxon_measurement_id
    FROM "xref_taxon_measurement_qualitative"
    WHERE measurement_name = 'antler configuration'
);
DELETE FROM "xref_taxon_measurement_qualitative"
WHERE measurement_name = 'antler configuration';

-- Insert new qualitative measurement for 'antler configuration' for Cervus (itis_tsn: 180694)

WITH cervusMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180694, 'antler configuration')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT c.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Spike - 2 point', 'Antlers with one or two single, unbranched points, often characteristic of younger males.', 0),
        ('3-5 point', 'Antlers with three to five total points, indicating a mid-development stage, typical of maturing cervids.', 1),
        ('6 point', 'Antlers with six total points, suggesting a well-developed set, often found in mature adults.', 2),
        ('Raghorn', 'Antlers with less consistent branching, generally used to describe young males with developing antlers that are larger than spikes but not fully mature.', 3)
) AS o (option_label, option_desc, option_value)
JOIN cervusMeasurementIDs c ON c.measurement_name = 'antler configuration';


-- Insert new qualitative measurement for 'antler configuration' for Odocoileus (itis_tsn: 180697)

WITH odocoileusMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180697, 'antler configuration')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)

-- Insert qualitative options for the new 'antler configuration' measurement
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT n.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Forked Antlers', 'Branching, forked pattern where each main beam splits into two tines', 0),
        ('Typical', 'Symmetrical antlers with uniform tines, usually with 4 points on each side, not counting the brow tine', 1),
        ('Non-typical', 'Irregular growth with extra tines or abnormal branching', 2)
) AS o (option_label, option_desc, option_value)
JOIN odocoileusMeasurementIDs n ON n.measurement_name = 'antler configuration';

-- Insert new qualitative measurement for 'antler configuration' for Rangifer (itis_tsn: 180702)

WITH rangiferMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180700, 'antler configuration')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)

-- Insert qualitative options for the new 'antler configuration' measurement
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT r.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Spike', 'Single, unbranched antler typical of young caribou', 0),
        ('Forked', 'Antlers with a simple forked pattern, indicating early development', 1),
        ('Palmate', 'Broad, flattened antlers with multiple points, characteristic of mature caribou', 2),
        ('Asymmetrical', 'Irregular antlers with uneven growth, often due to injury or genetic factors', 3)
) AS o (option_label, option_desc, option_value)
JOIN rangiferMeasurementIDs r ON r.measurement_name = 'antler configuration';

-- Insert new qualitative measurement for 'antler configuration - Oswald 1997 standards' for Alces (itis_tsn: 180702)
WITH oswaldMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180702, 'antler configuration - Oswald 1997 standards')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
-- Insert qualitative options for the new 'antler configuration - Oswald 1997 standards' measurement
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT o.taxon_measurement_id, v.option_label, v.option_desc, v.option_value
FROM (
    VALUES
        ('Oswald (1997) Class I Bulls', 'Young bulls with small antlers, often with minimal branching and less than four points.', 0),
        ('Oswald (1997) Class II Bulls', 'Intermediate bulls with moderate antler growth, typically with 4-8 points and some branching.', 1),
        ('Oswald (1997) Class III Bulls', 'Mature bulls with large, well-developed antlers, usually with extensive branching and more than eight points.', 2)
) AS v (option_label, option_desc, option_value)
JOIN oswaldMeasurementIDs o ON o.measurement_name = 'antler configuration - Oswald 1997 standards';

-- Insert new qualitative measurement for 'antler configuration - RISC standards' for Alces (itis_tsn: 180702)

WITH riscMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180702, 'antler configuration - RISC standards')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT r.taxon_measurement_id, v.option_label, v.option_desc, v.option_value
FROM (
    VALUES
        ('BC RISC Yearling Bulls', 'Yearling bulls with minimal antler development, typically with a single or forked spike.', 0),
        ('BC RISC Class I Bulls', 'Young bulls with small, developing antlers, usually with 1-4 points.', 1),
        ('BC RISC Class II Bulls', 'Maturing bulls with moderately developed antlers, generally with 5-8 points.', 2),
        ('BC RISC Class III Bulls', 'Mature bulls with large, complex antlers, often with more than eight points and extensive branching.', 3)
) AS v (option_label, option_desc, option_value)
JOIN riscMeasurementIDs r ON r.measurement_name = 'antler configuration - RISC standards';

-- Insert new qualitative measurement for 'antler configuration - male composition' for Alces (itis_tsn: 180702)
WITH maleCompositionIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180702, 'antler configuration - male composition')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
-- Insert qualitative options for the new 'antler configuration - male composition' measurement
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT m.taxon_measurement_id, v.option_label, v.option_desc, v.option_value
FROM (
    VALUES
        ('Spike/Fork Bulls', 'Young bulls with minimal antler development, typically with simple spike or forked antlers, indicating early age or lower rank.', 0),
        ('Sub-Prime Bulls', 'Bulls with developing antlers, usually showing moderate growth but not yet at full size, indicating a sub-adult or younger adult stage.', 1),
        ('Prime Bulls', 'Mature bulls with well-developed, complex antlers, indicating peak age and fitness.', 2)
) AS v (option_label, option_desc, option_value)
JOIN maleCompositionIDs m ON m.measurement_name = 'antler configuration - male composition';


-- Hunting and Trapping classification standards for Alces

WITH maleCompositionIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180702, 'Hunting & trapping classifications')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
-- Insert qualitative options for the new 'antler configuration - male composition' measurement
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT m.taxon_measurement_id, v.option_label, v.option_desc, v.option_value
FROM (
    VALUES
    ('Cow', 'Adult female moose that is easily distinguishable from bulls, often with no antlers.', 0),
    ('Calves', 'Young moose typically under one year old, born during the previous spring or summer.', 1),
    ('Bulls - Unclassified', 'Male moose that have not been classified by specific characteristics such as antler size or configuration.', 2),
    ('Adult Unclassified Sex', 'Adult moose for which sex (bull or cow) has not been determined or recorded.', 3),
    ('Unclassified Age/Sex', 'Moose for which both age (calf/adult) and sex (bull/cow) are not classified or determined.', 4)
) AS v (option_label, option_desc, option_value)
JOIN maleCompositionIDs m ON m.measurement_name = 'Hunting & trapping classifications';

