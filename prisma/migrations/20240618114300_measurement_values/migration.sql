--Update measurement measurement_descs
-- Surely there has to be a way to refine this code to make it less repetitive, I keep trying different things and I just get errors.


UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = CASE 
    WHEN itis_tsn = 331030 AND measurement_name = 'skull length' THEN 'The distance from the anterior (front) to the posterior (back) end of the skull.'
    WHEN itis_tsn = 331030 AND measurement_name = 'skull width' THEN 'The maximum width of the skull, typically measured at the widest part of the cranium.'
    WHEN itis_tsn = 914181 AND measurement_name = 'neck girth' THEN 'The circumference around the neck at its thickest point.'
    WHEN itis_tsn = 914181 AND measurement_name = 'neck length' THEN 'The distance from the base of the skull to the base of the neck.'
    WHEN itis_tsn = 180135 AND measurement_name = 'nest height' THEN 'The vertical distance from the ground to the top of the nest.'
    WHEN itis_tsn = 173747 AND measurement_name = 'snout-vent length' THEN 'The distance from the tip of the snout to the opening of the vent (cloaca) in reptiles and amphibians.'
    WHEN itis_tsn = 173747 AND measurement_name = 'body length' THEN 'The distance from the tip of the snout (or beak) to the base of the tail (excluding the tail).'
    WHEN itis_tsn = 173747 AND measurement_name = 'body mass' THEN 'The total weight of the animal.'
    WHEN itis_tsn = 202422 AND measurement_name = 'Diameter at breast height (DBH)' THEN 'The diameter of a tree trunk measured at 1.3 meters (4.5 feet) above the ground.'
    WHEN itis_tsn = 179913 AND measurement_name = 'baculum length' THEN 'The length of the baculum (penis bone) in mammals.'
    WHEN itis_tsn = 179913 AND measurement_name = 'chest girth' THEN 'The circumference around the chest, usually measured just behind the forelimbs.'
    WHEN itis_tsn = 179913 AND measurement_name = 'abdomen girth' THEN 'The circumference around the abdomen at its widest point.'
    WHEN itis_tsn = 179913 AND measurement_name = 'canine length' THEN 'The length of the canine teeth from the base to the tip.'
    WHEN itis_tsn = 179913 AND measurement_name = 'canine width' THEN 'The width of the canine teeth at their base.'
    WHEN itis_tsn = 179913 AND measurement_name = 'ear length' THEN 'The distance from the base to the tip of the ear.'
    WHEN itis_tsn = 179913 AND measurement_name = 'forearm length' THEN 'The distance from the elbow to the wrist.'
    WHEN itis_tsn = 179913 AND measurement_name = 'hind leg length' THEN 'The distance from the hip to the ankle.'
    WHEN itis_tsn = 179913 AND measurement_name = 'foot length' THEN 'The distance from the heel to the tip of the longest toe.'
    WHEN itis_tsn = 179913 AND measurement_name = 'paw length' THEN 'The length of the paw from the heel pad to the tip of the longest toe.'
    WHEN itis_tsn = 179913 AND measurement_name = 'paw width' THEN 'The width of the paw at its widest point.'
    WHEN itis_tsn = 179913 AND measurement_name = 'foot width' THEN 'The width of the foot at its widest point.'
    WHEN itis_tsn = 179913 AND measurement_name = 'hallux length' THEN 'The length of the first digit (big toe) in birds or reptiles.'
    WHEN itis_tsn = 179913 AND measurement_name = 'nipple length' THEN 'The length of the nipple from its base to the tip.'
    WHEN itis_tsn = 179913 AND measurement_name = 'shoulder height' THEN 'The vertical distance from the ground to the top of the shoulder.'
    WHEN itis_tsn = 179913 AND measurement_name = 'shoulder width' THEN 'The distance between the outer edges of the shoulders.'
    WHEN itis_tsn = 179913 AND measurement_name = 'body length' THEN 'The distance from the tip of the snout (or beak) to the base of the tail (excluding the tail).'
    WHEN itis_tsn = 179913 AND measurement_name = 'body mass' THEN 'The total weight of the animal.'
    WHEN itis_tsn = 174371 AND measurement_name = 'cere depth' THEN 'The depth of the cere (the fleshy, typically colored area at the base of the upper beak in birds).'
    WHEN itis_tsn = 174371 AND measurement_name = 'culmen length' THEN 'The length of the upper beak from the tip to where it meets the forehead.'
    WHEN itis_tsn = 174371 AND measurement_name = 'culmen width' THEN 'The width of the upper beak at its base.'
    WHEN itis_tsn = 174371 AND measurement_name = 'nest diameter (inner)' THEN 'The diameter of the inner part of the nest.'
    WHEN itis_tsn = 174371 AND measurement_name = 'nest diameter (outer)' THEN 'The diameter of the outer part of the nest.'
    WHEN itis_tsn = 174371 AND measurement_name = 'cavity opening diameter' THEN 'The diameter of the entrance to a nest cavity.'
    WHEN itis_tsn = 174371 AND measurement_name = 'nest height' THEN 'The vertical distance from the ground to the top of the nest.'
    WHEN itis_tsn = 174371 AND measurement_name = 'body mass' THEN 'The total weight of the animal.'
    WHEN itis_tsn = 174371 AND measurement_name = 'tarsus length' THEN 'The length of the tarsus (the part of a birds leg between the knee and the ankle).'
    WHEN itis_tsn = 174371 AND measurement_name = 'tarsus width' THEN 'The width of the tarsus at its widest point.'
    WHEN itis_tsn = 174371 AND measurement_name = 'wing chord' THEN 'The length of the wing from the shoulder to the tip of the longest primary feather.'
    WHEN itis_tsn = 180692 AND measurement_name = 'antler point count' THEN 'The number of points on an antler.'
    WHEN itis_tsn = 202423 AND measurement_name = 'age' THEN 'The number of years that the animal has been alive for.'
    WHEN itis_tsn = 202423 AND measurement_name = 'offspring count' THEN 'The number of offspring produced by an animal.'
    WHEN itis_tsn = 202423 AND measurement_name = 'tail length' THEN 'The distance from the base to the tip of the tail.'
    ELSE measurement_desc
END;



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