----------------------------------------------------------------------------------------
-- Migration to update existing tables with new taxa-based variables
----------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------
-- Add some new marking locations for caribou.
----------------------------------------------------------------------------------------
INSERT into lk_marking_type
(name, description)
VALUES
(
    'VHF collar',
    'A collar that emits a radio signal detectable by a receiver, used for tracking the caribou location over shorter distances.'
),
(
    'GPS collar',
    'A collar that uses satellite technology to provide precise location data, which can be accessed remotely or when retrieved.'
),
(
    'Satellite collar',
    'A collar that transmits real-time location data via satellite, enabling continuous tracking of the caribou over large distances.'
),
(
    'Sleeve',
    'A "sleeve" in the context of animal marking is a durable, weather-resistant leg band or collar used to identify and track individual animals, such as caribou, without impeding their natural movement.'
);
INSERT into xref_taxon_marking_body_location
(body_location, description, itis_tsn)
VALUES
(
    'Neck',
    NULL,
    331030
),
(
    'Left Forelimb (Anterior)',
    'The front left limb.',
    914181
),
(
    'Right Forelimb (Anterior)',
    'The front right limb.',
    914181
),
(
    'Left Hindlimb (Posterior)',
    'The rear left limb',
    914181
),
(
    'Right Hindlimb (Posterior)',
    'The rear right limb.',
    914181
);
----------------------------------------------------------------------------------------
-- Edit enum list to include some more units
-- Macgregor and Mac have raised seperately that this doesnt need to be in a transaction block, 
--but I can't get it to work or update the enum list without it being in a block.
----------------------------------------------------------------------------------------
BEGIN;
ALTER TYPE critterbase.measurement_unit ADD VALUE 'years';
COMMIT;

----------------------------------------------------------------------------------------
--Update measurement measurement_descs as a lot of them were NULL before
----------------------------------------------------------------------------------------

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

----------------------------------------------------------------------------------------
--Update year unit in age. Already added to enum
----------------------------------------------------------------------------------------
-- Update ages unit to year
UPDATE xref_taxon_measurement_quantitative 
SET unit = CASE 
    WHEN itis_tsn = 202423 AND measurement_name = 'age' THEN 'years'
    ELSE unit
END;


----------------------------------------------------------------------------------------
--Todo list and needs to be removed
----------------------------------------------------------------------------------------
--Does baculum need to be changed? What is the itis_tsn right now, and what could/should it be?

----------------------------------------------------------------------------------------
--Adding some more options based off fish taxa
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    -- Length
    (161061, 'length from snout to caudal fin', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (161051, 'length from snout to caudal fin', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (161039, 'length from snout to caudal fin', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (159785, 'length from snout to caudal fin', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),

    (161061, 'otolith growth rings (count)', 0, 1000, NULL, 'Otolith rings are concentric growth layers in fish otoliths, used to determine the age and growth history of the fish through annual ring count analysis.'),
    (161051, 'otolith growth rings (count)', 0, 1000, NULL, 'Otolith rings are concentric growth layers in fish otoliths, used to determine the age and growth history of the fish through annual ring count analysis.'),
    (161039, 'otolith growth rings (count)', 0, 1000, NULL, 'Otolith rings are concentric growth layers in fish otoliths, used to determine the age and growth history of the fish through annual ring count analysis.'),

    (161061, 'cleithrum growth rings (count)', 0, 1000, NULL, 'The cleithrum is a bone in the pectoral girdle of fish that is used to determine age by counting its annual growth rings'),
    (161051, 'cleithrum growth rings (count)', 0, 1000, NULL, 'The cleithrum is a bone in the pectoral girdle of fish that is used to determine age by counting its annual growth rings'),
    (161039, 'cleithrum growth rings (count)', 0, 1000, NULL, 'The cleithrum is a bone in the pectoral girdle of fish that is used to determine age by counting its annual growth rings'),

    (161061, 'operculum growth rings (count)', 0, 1000, NULL, 'The operculum is a bony plate covering the gills of fish, used to determine age by counting its annual growth rings.'),
    (161051, 'operculum growth rings (count)', 0, 1000, NULL, 'The operculum is a bony plate covering the gills of fish, used to determine age by counting its annual growth rings.'),
    (161039, 'operculum growth rings (count)', 0, 1000, NULL, 'The operculum is a bony plate covering the gills of fish, used to determine age by counting its annual growth rings.');

WITH MeasurementIDs AS (
    INSERT INTO xref_taxon_measurement_qualitative (itis_tsn, measurement_name)
    VALUES
        (161061, 'maturity'),
        (161051, 'maturity'),
        (161039, 'maturity')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_value)
SELECT m.taxon_measurement_id, o.option_label, o.option_value
FROM (
    SELECT * FROM (
        VALUES
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
            (161039, 'maturity', 'undetermined', 6)
    ) AS option_data (itis_tsn, measurement_name, option_label, option_value)
) AS o
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_name = m.measurement_name;
