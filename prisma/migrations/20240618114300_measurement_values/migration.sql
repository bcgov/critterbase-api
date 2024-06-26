--Update measurement measurement_descs
-- Surely there has to be a way to refine this code to make it less repetitive, I keep trying different things and I just get errors.


UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the anterior (front) to the posterior (back) end of the skull.' 
WHERE itis_tsn = 331030 AND measurement_name = 'skull length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The maximum width of the skull, typically measured at the widest part of the cranium.' 
WHERE itis_tsn = 331030 AND measurement_name = 'skull width';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The circumference around the neck at its thickest point.' 
WHERE itis_tsn = 914181 AND measurement_name = 'neck girth';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the base of the skull to the base of the neck.' 
WHERE itis_tsn = 914181 AND measurement_name = 'neck length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The vertical distance from the ground to the top of the nest.' 
WHERE itis_tsn = 180135 AND measurement_name = 'nest height';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the tip of the snout to the opening of the vent (cloaca) in reptiles and amphibians.' 
WHERE itis_tsn = 173747 AND measurement_name = 'snout-vent length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the tip of the snout (or beak) to the base of the tail (excluding the tail).' 
WHERE itis_tsn = 173747 AND measurement_name = 'body length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The total weight of the animal.' 
WHERE itis_tsn = 173747 AND measurement_name = 'body mass';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The diameter of a tree trunk measured at 1.3 meters (4.5 feet) above the ground.' 
WHERE itis_tsn = 202422 AND measurement_name = 'Diameter at breast height (DBH)';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the baculum (penis bone) in mammals.' 
WHERE itis_tsn = 179913 AND measurement_name = 'baculum length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The circumference around the chest, usually measured just behind the forelimbs.' 
WHERE itis_tsn = 179913 AND measurement_name = 'chest girth';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The circumference around the abdomen at its widest point.' 
WHERE itis_tsn = 179913 AND measurement_name = 'abdomen girth';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the canine teeth from the base to the tip.' 
WHERE itis_tsn = 179913 AND measurement_name = 'canine length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The width of the canine teeth at their base.' 
WHERE itis_tsn = 179913 AND measurement_name = 'canine width';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the base to the tip of the ear.' 
WHERE itis_tsn = 179913 AND measurement_name = 'ear length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the elbow to the wrist.' 
WHERE itis_tsn = 179913 AND measurement_name = 'forearm length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the hip to the ankle.' 
WHERE itis_tsn = 179913 AND measurement_name = 'hind leg length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the heel to the tip of the longest toe.' 
WHERE itis_tsn = 179913 AND measurement_name = 'foot length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the paw from the heel pad to the tip of the longest toe.' 
WHERE itis_tsn = 179913 AND measurement_name = 'paw length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The width of the paw at its widest point.' 
WHERE itis_tsn = 179913 AND measurement_name = 'paw width';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The width of the foot at its widest point.' 
WHERE itis_tsn = 179913 AND measurement_name = 'foot width';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the first digit (big toe) in birds or reptiles.' 
WHERE itis_tsn = 179913 AND measurement_name = 'hallux length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the nipple from its base to the tip.' 
WHERE itis_tsn = 179913 AND measurement_name = 'nipple length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The vertical distance from the ground to the top of the shoulder.' 
WHERE itis_tsn = 179913 AND measurement_name = 'shoulder height';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance between the outer edges of the shoulders.' 
WHERE itis_tsn = 179913 AND measurement_name = 'shoulder width';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the tip of the snout (or beak) to the base of the tail (excluding the tail).' 
WHERE itis_tsn = 179913 AND measurement_name = 'body length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The total weight of the animal.' 
WHERE itis_tsn = 179913 AND measurement_name = 'body mass';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The depth of the cere (the fleshy, typically colored area at the base of the upper beak in birds).' 
WHERE itis_tsn = 174371 AND measurement_name = 'cere depth';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the upper beak from the tip to where it meets the forehead.' 
WHERE itis_tsn = 174371 AND measurement_name = 'culmen length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The width of the upper beak at its base.' 
WHERE itis_tsn = 174371 AND measurement_name = 'culmen width';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The diameter of the inner part of the nest.' 
WHERE itis_tsn = 174371 AND measurement_name = 'nest diameter (inner)';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The diameter of the outer part of the nest.' 
WHERE itis_tsn = 174371 AND measurement_name = 'nest diameter (outer)';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The diameter of the entrance to a nest cavity.' 
WHERE itis_tsn = 174371 AND measurement_name = 'cavity opening diameter';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The vertical distance from the ground to the top of the nest.' 
WHERE itis_tsn = 174371 AND measurement_name = 'nest height';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The total weight of the animal.' 
WHERE itis_tsn = 174371 AND measurement_name = 'body mass';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the tarsus (the part of a birds leg between the knee and the ankle).' 
WHERE itis_tsn = 174371 AND measurement_name = 'tarsus length';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The width of the tarsus at its widest point.' 
WHERE itis_tsn = 174371 AND measurement_name = 'tarsus width';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The length of the wing from the shoulder to the tip of the longest primary feather.' 
WHERE itis_tsn = 174371 AND measurement_name = 'wing chord';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The number of points on an antler.' 
WHERE itis_tsn = 180692 AND measurement_name = 'antler point count';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The number of years that the animal has been alive for.' 
WHERE itis_tsn = 202423 AND measurement_name = 'age';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The number of offspring produced by an animal.' 
WHERE itis_tsn = 202423 AND measurement_name = 'offspring count';

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = 'The distance from the base to the tip of the tail.' 
WHERE itis_tsn = 202423 AND measurement_name = 'tail length';




    /*

WITH MeasurementIDs AS (
    INSERT INTO xref_taxon_measurement_qualitative (itis_tsn, measurement_measurement_name)
    VALUES
        (179913, 'fur colour (primary)'),
        (179913, 'fur colour (secondary)'),
        (174371, 'life stage'),
        (180692, 'antler configuration'),
        (202423, 'sex')
    RETURNING itis_tsn, taxon_itis_tsn, measurement_measurement_name
)
INSERT INTO xref_taxon_measurement_qualitative_option (taxon_itis_tsn, option_label, option_value)
SELECT m.taxon_itis_tsn, o.option_label, o.option_value
FROM (
    SELECT * FROM (
        VALUES
            (179913, 'fur colour (primary)', 'black', 0),
            (179913, 'fur colour (primary)', 'brown', 1),
            (179913, 'fur colour (primary)', 'grey', 2),
            (179913, 'fur colour (primary)', 'white', 3),
            (179913, 'fur colour (primary)', 'orange', 4),
            (179913, 'fur colour (secondary)', 'black', 5),
            (179913, 'fur colour (secondary)', 'brown', 6),
            (179913, 'fur colour (secondary)', 'grey', 7),
            (179913, 'fur colour (secondary)', 'white', 8),
            (179913, 'fur colour (secondary)', 'orange', 9),
            (174371, 'life stage', 'nestling', 0),
            (174371, 'life stage', 'fledgling', 1),
            (174371, 'life stage', 'hatch year (HY)', 2),
            (174371, 'life stage', 'after hatch year (AHY)', 3),
            (180692, 'antler configuration', 'less than 3 points', 0),
            (180692, 'antler configuration', 'more than 3 points', 1),
            (202423, 'sex', 'male', 0),
            (202423, 'sex', 'female', 1)
    ) AS option_data (itis_tsn, measurement_measurement_name, option_label, option_value)
) AS o
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_measurement_name = m.measurement_measurement_name;
*/