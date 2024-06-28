-- Update existing tables with new taxa-based variables


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

--Insert data related to Fish specific variables
--Need to watch out for duplications and for previous tsn's that would show up at other species levels.
--Years and unitys as a type will likely need to be created
-- The concept of Age structure and age sample is probably bad. This represents how it was in the old system but this needs to be broken down into its smaller subparts and their specific units i.e otolths need to be counted in ringsvs fin ray units - whatever that is. -- changed to millimeters for testing purposes from age sample. Make sure this is changed back

--161051 coelocanth and 161039 lungfish cannot be condensed into the higher order of sarcopteryggi as this includes tetrapods etc 

-- Chondrichthyes - 159785 - Also need to be added to all of the aspects.

INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    (161061, 'fish total length', 0, 10000, 'centimeter', 'total length is measured from the tip of the snout (or mouth) to the end of the longest lobe of the caudal (tail) fin, when the lobes are compressed along the midline.'),
    (161061, 'fish standard length', 0, 10000, 'millimeter', 'standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (161051, 'fish total length', 0, 10000, 'centimeter', 'total length is measured from the tip of the snout (or mouth) to the end of the longest lobe of the caudal (tail) fin, when the lobes are compressed along the midline.'),
    (161051, 'fish standard length', 0, 10000, 'millimeter', 'standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (161039, 'fish total length', 0, 10000, 'centimeter', 'total length is measured from the tip of the snout (or mouth) to the end of the longest lobe of the caudal (tail) fin, when the lobes are compressed along the midline.'),
    (161039, 'fish standard length', 0, 10000, 'millimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),

    (161061, 'age sample', 0, 1000, 'millimeter', 'A unique identification assigned to each genetic sample.'),
    (161051, 'age sample', 0, 1000, 'millimeter', 'A unique identification assigned to each genetic sample.'),
    (161039, 'age sample', 0, 1000, 'millimeter', 'A unique identification assigned to each genetic sample.'),
    (161061, 'genetic sample', 0, 1000, 'millimeter', 'A unique identification assigned to each body structure used to determine genetic.'),
    (161051, 'genetic sample', 0, 1000, 'millimeter', 'A unique identification assigned to each body structure used to determine age.'),
    (161039, 'age sample', 0, 1000, 'millimeter', 'A unique identification assigned to each body structure used to determine age.'),
    (161061, 'age', 0, 1000, 'millimeter', 'Age in years.'),
    (161051, 'age', 0, 1000, 'millimeter', 'Age in years.'),
    (161039, 'age', 0, 1000, 'millimeter', 'Age in years.');

-- First, insert and capture the results
WITH MeasurementIDs AS (
    INSERT INTO xref_taxon_measurement_qualitative (itis_tsn, measurement_name)
    VALUES
        (161061, 'sex'),
        (161051, 'sex'),
        (161039, 'sex'),
        (161061, 'maturity'),
        (161051, 'maturity'),
        (161039, 'maturity'),
        (161061, 'Age structure'),
        (161051, 'Age structure'),
        (161039, 'Age structure'),
        (161061, 'Genetic structure'),
        (161051, 'Genetic structure'),
        (161039, 'Genetic structure')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)

INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_value)
SELECT m.taxon_measurement_id, o.option_label, o.option_value
FROM (
    SELECT * FROM (
        VALUES
            (161061, 'sex', 'male', 0),
            (161061, 'sex', 'female', 1),
            (161051, 'sex', 'male', 0),
            (161051, 'sex', 'female', 1),
            (161039, 'sex', 'male', 0),
            (161039, 'sex', 'female', 1),
            (161061, 'maturity', 'immature', 0),
            (161061, 'maturity', 'maturing', 1),
            (161061, 'maturity', 'mature', 2),
            (161061, 'maturity', 'spawnbound', 3),
            (161061, 'maturity', 'spawning', 4),
            (161061, 'maturity', 'spent', 5),
            (161061, 'maturity', 'undetermined', 6),
            (161051, 'maturity', 'immature', 0),
            (161051, 'maturity', 'maturing', 1),
            (161051, 'maturity', 'mature', 2),
            (161051, 'maturity', 'spawnbound', 3),
            (161051, 'maturity', 'spawning', 4),
            (161051, 'maturity', 'spent', 5),
            (161051, 'maturity', 'undetermined', 6),
            (161039, 'maturity', 'immature', 0),
            (161039, 'maturity', 'maturing', 1),
            (161039, 'maturity', 'mature', 2),
            (161039, 'maturity', 'spawnbound', 3),
            (161039, 'maturity', 'spawning', 4),
            (161039, 'maturity', 'spent', 5),
            (161039, 'maturity', 'undetermined', 6),
            (161061, 'age structure', 'cleithum', 0),
            (161061, 'age structure', 'fin ray', 1),
            (161061, 'age structure', 'operculum', 2),
            (161061, 'age structure', 'otolith', 3),
            (161061, 'age structure', 'scale', 4),
            (161051, 'age structure', 'cleithum', 0),
            (161051, 'age structure', 'fin ray', 1),
            (161051, 'age structure', 'operculum', 2),
            (161051, 'age structure', 'otolith', 3),
            (161051, 'age structure', 'scale', 4),
            (161039, 'age structure', 'cleithum', 0),
            (161039, 'age structure', 'fin ray', 1),
            (161039, 'age structure', 'operculum', 2),
            (161039, 'age structure', 'otolith', 3),
            (161039, 'age structure', 'scale', 4),
            (161061, 'genetic structure', 'fin ray', 0),
            (161061, 'genetic structure', 'tissue plug', 1),
            (161051, 'genetic structure', 'fin ray', 0),
            (161051, 'genetic structure', 'tissue plug', 1),
            (161039, 'genetic structure', 'fin ray', 0),
            (161039, 'genetic structure', 'tissue plug', 1)
    ) AS option_data (itis_tsn, measurement_name, option_label, option_value)
) AS o
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_name = m.measurement_name;
