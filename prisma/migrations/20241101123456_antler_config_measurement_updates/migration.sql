-- Insert new column for the 3 tables
ALTER TABLE xref_taxon_measurement_qualitative_option ADD COLUMN valid_till Date;
ALTER TABLE xref_taxon_measurement_qualitative ADD COLUMN valid_till Date;
ALTER TABLE xref_taxon_measurement_quantitative ADD COLUMN valid_till Date;

-- Deprecate values we longer use

UPDATE "xref_taxon_measurement_qualitative_option"
SET valid_till = CURRENT_DATE
WHERE taxon_measurement_id IN (
    SELECT taxon_measurement_id
    FROM "xref_taxon_measurement_qualitative"
    WHERE measurement_name = 'antler configuration'
);

UPDATE "xref_taxon_measurement_qualitative"
SET valid_till = CURRENT_DATE
WHERE measurement_name = 'antler configuration';

UPDATE "xref_taxon_measurement_quantitative"
SET valid_till = CURRENT_DATE
WHERE measurement_name = 'antler point count';

-----------ARTIODACTYLA----------------

-- Insert new quantitative measurements related to antler points
INSERT INTO "xref_taxon_measurement_quantitative" (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    (180692, 'antler point count - total', 0, 10000, NULL, 'Total number of antler points, an indicator of age and genetic quality in ecological studies'),
    (180692, 'antler point count - left', 0, 10000, NULL, 'Number of antler points on the left side, used to assess asymmetry and overall antler development'),
    (180692, 'antler point count - right', 0, 10000, NULL, 'Number of antler points on the right side, used to assess asymmetry and overall antler development');




-----------CERVUS----------------

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


WITH cervusAgeSexIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180694, 'age-sex classification')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT c.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Cows', 'Adult female elk, typically distinguished by the absence of antlers.', 0),
        ('Calves', 'Young elk born in the current year, generally small in size and dependent on their mothers.', 1),
        ('Adult Unclassified Sex', 'Mature elk whose sex could not be determined during observation', 2),
        ('Unlcassified Age/Sex', 'Elk observed but with neither age nor sex identified.', 3)
) AS o (option_label, option_desc, option_value)
JOIN cervusAgeSexIDs c ON c.measurement_name = 'age-sex classification';


WITH cervusRISCIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180694, 'antler configuration - RISC standards')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT c.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('BC RISC Yearling Bulls', 'Spike antlers or with light 1 to 2 point antlers', 0),
        ('BC RISC Class I Bulls', 'Small antlers with 3 or 4 points (raghorn)', 1),
        ('BC RISC Class II Bulls', 'Large 4 pt antler, small 5 pt antler, spindly (raghorn)', 2),
        ('BC RISC Class III Bulls', 'Large 5 pt antler, small 6 pt antler, heavy antlers', 3),
        ('BC RISC Class IV Bulls', 'large antlers with 6 or 7 pts/antler, massive antlers', 4)
) AS o (option_label, option_desc, option_value)
JOIN cervusRISCIDs c ON c.measurement_name = 'antler configuration - RISC standards';



WITH cervusCompIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180694, 'male composition')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT c.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Spike Bulls', 'spike antlers or with light 1 to 2 point antlers', 1),
        ('Raghorn Bulls', 'small antlers with 3 or 4 points', 2),
        ('<=3 Point Bulls', 'antlers with 3 or fewer points', 3),
        ('3 - 4 Point Bulls', 'antlers with 3 or 4 points', 4),
        ('<4 Point Bulls', 'antlers with 4 or fewer points', 5),
        ('>=4 Point Bulls', 'antlers with 4 or more points', 6),
        ('5 Point Bulls', 'antlers with 5 points', 7),
        ('>=5 Point Bulls', 'antlers with 5 or more points', 8),
        ('>= 6 Point Bulls', 'antlers with 6 or more points', 9),
        ('Adult Bulls - Unclassified', 'adult bulls with unclassified antlers', 10),
        ('Bulls - Unclassified', 'bulls with unclassified antlers', 11)
) AS o (option_label, option_desc, option_value)
JOIN cervusCompIDs c ON c.measurement_name = 'male composition';


-----------ODOCOILEUS----------------

-- Insert new qualitative measurement for 'antler configuration' for Odocoileus (itis_tsn: 180697)

WITH odocoileusMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180697, 'antler configuration')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT n.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Forked Antlers', 'Branching, forked pattern where each main beam splits into two tines', 0),
        ('Typical', 'Symmetrical antlers with uniform tines, usually with 4 points on each side, not counting the brow tine', 1),
        ('Non-typical', 'Irregular growth with extra tines or abnormal branching', 2)
) AS o (option_label, option_desc, option_value)
JOIN odocoileusMeasurementIDs n ON n.measurement_name = 'antler configuration';


WITH odocoileusAgeSexIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180697, 'age-sex classification')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT n.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Doe', 'Adult female deer, typically recognized by the absence of antlers.', 0),
        ('Fawn', 'Young deer born in the current year, often small with spotted coats for camouflage.', 1),
        ('Adult Unclassified Sex', 'Mature deer whose sex could not be determined during observation.', 2),
        ('Unclassified Age/Sex', 'Deer observed but with neither age nor sex identified.', 3)
) AS o (option_label, option_desc, option_value)
JOIN odocoileusAgeSexIDs n ON n.measurement_name = 'age-sex classification';


-- Insert new values for odocoiles virginianus - itis_tsn = 180699

WITH virginianusRISCIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180699, 'antler configuration - RISC standards')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT n.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Yearling Buck', 'Spike or 2-points on one or both antlers', 0),
        ('BC RISC - Class I', 'Large 2 point or small 3 point antlers', 1),
        ('BC RISC - Class II', 'Medium size antlers with 3 points/antler', 2),
        ('BC RISC - Class III', 'Medium size with 3 or 4 points/antler • moderate to large bodied', 3),
        ('BC RISC - Class IV', 'Large antlers with 4 or 5 points/antler', 4)
) AS o (option_label, option_desc, option_value)
JOIN virginianusRISCIDs n ON n.measurement_name = 'antler configuration - RISC standards';

WITH virginianusAntlerConfigIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180697, 'antler configuration')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT n.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Spike', 'A buck with unbranched antlers, typically young and in early antler development.', 5),
        ('Small Buck/Raghorn', 'A younger or smaller-bodied buck with relatively short, thin, or irregularly branched antlers.', 6),
        ('2 Points or Fewer Buck', 'A buck with two or fewer antler points, often a yearling or a less dominant male.', 7),
        ('3 Point Buck', 'A buck with three antler points on at least one side, indicating moderate antler development.', 8),
        ('4 Point Buck', 'A buck with four antler points on at least one side, often representing a more mature animal.', 9),
        ('4 Point or Fewer Buck', 'Any buck with four or fewer antler points, encompassing younger or less dominant individuals.', 10),
        ('> 4 Point Buck', 'A buck with more than four points on at least one side, typically indicating greater maturity and genetic quality.', 11),
        ('5 Point or More Buck', 'A buck with five or more antler points on at least one side, often an older or dominant male.', 12),
        ('Adult Bucks - Unclassified', 'A mature buck whose antler configuration was not fully determined during observation.', 13),
        ('Bucks - Unclassified', 'Any male deer observed but without clear age or antler classification.', 14)
) AS o (option_label, option_desc, option_value)
JOIN virginianusAntlerConfigIDs n ON n.measurement_name = 'antler configuration';

-- Updating values specific to Odocoileus hemionus - itis_tsn = 180698

WITH hemionusRISCIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180698, 'antler configuration - RISC standards')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT n.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('BC RISC - Class I', 'small bucks: All spikes and small 2-points, very small 3-points', 0),
        ('BC RISC - Class II', 'medium bucks; medium 3-points. May include large 2-points', 1),
        ('BC RISC - Class III', 'Large 3-points, small and medium 4-points. Segregate 3-points and 4-points', 2),
        ('BC RISC - Class IV', 'Large bucks with 4 or more points and antlers extending well beyond the ears.', 3)
) AS o (option_label, option_desc, option_value)
JOIN hemionusRISCIDs n ON n.measurement_name = 'antler configuration - RISC standards';




-----------RANGIFER----------------

-- Insert new qualitative measurement for 'antler configuration' for Rangifer (itis_tsn: 180702)

WITH rangiferMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180700, 'antler configuration')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT r.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('Adult Males', 'Males that have reached reproductive maturity.', 0),
        ('Adult Females', 'Females that have reached reproductive maturity.', 1),
        ('Adults - Unclassified Sex', 'Adults of unknown or unrecorded sex.', 2),
        ('Immature Males', 'Males that have not yet reached reproductive maturity.', 3),
        ('Juveniles - Unclassified Sex ', 'Young individuals of unknown sex.', 4),
        ('Yearling Males', 'Males in their second year of life, between 1 and 2 years old.', 5),
        ('Yearling Females', 'Females in their second year of life, between 1 and 2 years old', 6),
        ('Yearlings - Unclassified Sex', 'Yearlings of unknown or unrecorded sex.', 7),
        ('Males - Unclassified Life Stage', 'Males of unknown or unrecorded age group.', 8),
        ('Females - Unclassified Life Stage', 'Females of unknown or unrecorded age group.', 9),
        ('Unclassified Life Stage and Sex', 'Individuals of unknown or unrecorded age group.', 10)
) AS o (option_label, option_desc, option_value)
JOIN rangiferMeasurementIDs r ON r.measurement_name = 'antler configuration';

WITH rangiferRISCIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180700, 'antler configuration - RISC standards')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT r.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    VALUES
        ('BC RISC - Yearling/Class I Bulls', 'Small antlers which are 2-3x the ear length (Yearling).', 0),
        ('BC RISC - Class II Bulls', 'Antlers larger than females; antlers are lighter and smaller than Class III bulls; antlers without shovels.', 1),
        ('BC RISC - Class III Bulls', 'Large, heavy-beamed antlered males; antlers with many points and a palmated brow tine; may have shovel with few points, but heavy beams', 2),
        ('BC RISC - Class I or  II Bulls', 'BC RISC Class I or II', 3)
) AS o (option_label, option_desc, option_value)
JOIN rangiferRISCIDs r ON r.measurement_name = 'antler configuration - RISC standards';


-----------ALCES----------------

-- Insert new qualitative measurement for 'antler configuration - Oswald 1997 standards' for Alces (itis_tsn: 180702)

WITH oswaldMeasurementIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180702, 'antler configuration - Oswald 1997 standards')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
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
        ('BC RISC Yearling Bulls', 'Antlers are a spike or fork; if palmated, they do not extend beyond the eartip.', 0),
        ('BC RISC Class I Bulls', 'Palmated antlers extend beyond the eartip; brow tine is a spike or fork.', 1),
        ('BC RISC Class II Bulls', 'Palmated antlers extend beyond the eartip; brow tine is palmated with two or more points, and inner brow palms close over the face.', 2),
        ('BC RISC Class III Bulls','Palmated antlers are smaller than Class II; brow tine is usually a spike or fork, similar to Class I.', 3)
) AS v (option_label, option_desc, option_value)
JOIN riscMeasurementIDs r ON r.measurement_name = 'antler configuration - RISC standards';


-- Insert new qualitative measurement for 'antler configuration - male composition' for Alces (itis_tsn: 180702)

WITH maleCompositionIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180702, 'antler configuration - male composition')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO "xref_taxon_measurement_qualitative_option" (taxon_measurement_id, option_label, option_desc, option_value)
SELECT m.taxon_measurement_id, v.option_label, v.option_desc, v.option_value
FROM (
    VALUES
        ('Spike/Fork Bulls', 'Bulls wilth no more than 2 tines on 1 antler. Young bulls with minimal antler development, typically with simple spike or forked antlers, indicating early age or lower rank.', 0),
        ('Sub-Prime Bulls', 'Bulls with developing antlers, usually showing moderate growth but not yet at full size, indicating a sub-adult or younger adult stage.', 1),
        ('Prime Bulls', 'Mature bulls with well-developed, complex antlers, indicating peak age and fitness.', 2),
        ('Teen Bulls', 'Bulls 2 to 4 years old', 3),
        ('Senior Bulls', 'Bulls with antler palmate but starting to diminish in size', 4),
        ('3 Brow/10 Point Bulls', 'Bulls with Tripalm or 10 point antlers', 5)
) AS v (option_label, option_desc, option_value)
JOIN maleCompositionIDs m ON m.measurement_name = 'antler configuration - male composition';


-- Hunting and Trapping classification standards for Alces

WITH maleCompositionIDs AS (
    INSERT INTO "xref_taxon_measurement_qualitative" (itis_tsn, measurement_name)
    VALUES
        (180702, 'Hunting & trapping classifications')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
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

