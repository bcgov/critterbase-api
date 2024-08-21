----------------------------------------------------------------------------------------
-- Updates existing tables with new taxa-based lookup values
----------------------------------------------------------------------------------------
UPDATE xref_taxon_measurement_quantitative
SET itis_tsn = 158852, measurement_desc = 'Tail length is the measurement from the base of an animals tail, where it connects to the body, to the tip of the tail, used to assess growth, health, and species characteristics in ecological studies.'
WHERE itis_tsn = 202423
  AND measurement_name = 'tail length';
----------------------------------------------------------------------------------------
-- New markings and body locations
----------------------------------------------------------------------------------------
INSERT into lk_marking_type
(name, description)
VALUES
(
    'Sleeve',
    'A durable, weather-resistant band typically placed on a leg.'
);

INSERT into xref_taxon_marking_body_location
(body_location, description, itis_tsn)
VALUES
(
    'Neck',
    NULL,
    331030 -- vertebrates
),
(
    'Left forelimb',
    'The front left limb.',
    914181 -- tetrapoda
),
(
    'Right forelimb',
    'The front right limb.',
    914181
),
(
    'Left hindlimb',
    'The rear left limb.',
    914181 -- tetrapoda
),
(
    'Right hindlimb',
    'The rear right limb.',
    914181
);


----------------------------------------------------------------------------------------
-- Edit enum list to include some more units
-- Wrapping in a transaction block to fix issue where the alter type otherwise fails
----------------------------------------------------------------------------------------
BEGIN;
ALTER TYPE critterbase.measurement_unit ADD VALUE 'years';
COMMIT;

----------------------------------------------------------------------------------------
-- Add descriptions to measurements
----------------------------------------------------------------------------------------

UPDATE xref_taxon_measurement_quantitative 
SET measurement_desc = CASE 
    WHEN itis_tsn = 331030 AND measurement_name = 'skull length' THEN 'The distance between the anterior-most and posterior-most parts of the skull.'
    WHEN itis_tsn = 331030 AND measurement_name = 'skull width' THEN 'The maximum width of the skull, measured at the widest part of the cranium.'
    WHEN itis_tsn = 914181 AND measurement_name = 'neck circumference' THEN 'The circumference of the neck, measured at its thickest point.'
    WHEN itis_tsn = 914181 AND measurement_name = 'neck length' THEN 'The distance from the base of the skull to the base of the neck.'
    WHEN itis_tsn = 180135 AND measurement_name = 'nest height' THEN 'The vertical distance from the ground to the top of the nest.'
    WHEN itis_tsn = 173747 AND measurement_name = 'snout-vent length' THEN 'The distance from the tip of the snout to the opening of the vent or cloaca.'
    WHEN itis_tsn = 173747 AND measurement_name = 'body length' THEN 'The distance between the anterior-most part and posterior-most part of the body, excluding the tail.'
    WHEN itis_tsn = 173747 AND measurement_name = 'body mass' THEN 'The total weight of the animal.'
    WHEN itis_tsn = 202422 AND measurement_name = 'Diameter at breast height (DBH)' THEN 'The diameter of a tree measured at 1.3 meters (4.5 feet) above the ground.'
    WHEN itis_tsn = 179913 AND measurement_name = 'baculum length' THEN 'The length of the baculum (penis bone).'
    WHEN itis_tsn = 179913 AND measurement_name = 'chest circumference' THEN 'The circumference around the chest, usually measured just behind the forelimbs.'
    WHEN itis_tsn = 179913 AND measurement_name = 'abdomen circumference' THEN 'The circumference around the abdomen at its widest point.'
    WHEN itis_tsn = 179913 AND measurement_name = 'canine length' THEN 'The length of the canine teeth from the base to the tip.'
    WHEN itis_tsn = 179913 AND measurement_name = 'canine width' THEN 'The width of the canine teeth at their base.'
    WHEN itis_tsn = 179913 AND measurement_name = 'ear length' THEN 'The distance from the base to the tip of the ear.'
    WHEN itis_tsn = 179913 AND measurement_name = 'forearm length' THEN 'The distance from the elbow to the wrist.'
    WHEN itis_tsn = 179913 AND measurement_name = 'hind leg length' THEN 'The distance from the hip to the ankle.'
    WHEN itis_tsn = 179913 AND measurement_name = 'foot length' THEN 'The distance from the heel to the tip of the longest toe.'
    WHEN itis_tsn = 179913 AND measurement_name = 'paw length' THEN 'The length of the paw from the heel pad to the tip of the longest toe.'
    WHEN itis_tsn = 179913 AND measurement_name = 'paw width' THEN 'The width of the paw at its widest point.'
    WHEN itis_tsn = 179913 AND measurement_name = 'foot width' THEN 'The width of the foot at its widest point.'
    WHEN itis_tsn = 179913 AND measurement_name = 'hallux length' THEN 'The length of the first digit (big toe).'
    WHEN itis_tsn = 179913 AND measurement_name = 'nipple length' THEN 'The length of the nipple from its base to the tip.'
    WHEN itis_tsn = 179913 AND measurement_name = 'shoulder height' THEN 'The vertical distance from the ground to the top of the shoulder.'
    WHEN itis_tsn = 179913 AND measurement_name = 'shoulder width' THEN 'The distance between the outer edges of the shoulders.'
    WHEN itis_tsn = 179913 AND measurement_name = 'body length' THEN 'The distance from the tip of the snout (or beak) to the base of the tail (excluding the tail).'
    WHEN itis_tsn = 179913 AND measurement_name = 'body mass' THEN 'The total weight of the animal.'
    WHEN itis_tsn = 174371 AND measurement_name = 'cere depth' THEN 'The depth of the cere (the fleshy, typically colored area at the base of the upper beak).'
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
    WHEN itis_tsn = 202423 AND measurement_name = 'offspring count' THEN 'The number of affiliated offspring.'
    WHEN itis_tsn = 202423 AND measurement_name = 'tail length' THEN 'The distance from the base to the tip of the tail.'
    ELSE measurement_desc
END;

----------------------------------------------------------------------------------------
-- Update year unit in age
----------------------------------------------------------------------------------------
UPDATE xref_taxon_measurement_quantitative 
SET unit = CASE 
    WHEN itis_tsn = 202423 AND measurement_name = 'age' THEN 'years'
    ELSE unit
END;


----------------------------------------------------------------------------------------
-- Todo list and needs to be removed
----------------------------------------------------------------------------------------
-- Does baculum need to be changed? What is the itis_tsn right now, and what could/should it be?

----------------------------------------------------------------------------------------
-- Adding some more options based off fish taxa
--
-- There are 4 "real" fish taxa:
--      Actinopterygii
--      Latimeriidae
--      Dipnoi
--      Chondrichthyes
-- 
-- "Real" is in quotes because humans are technically fish within the taxonomic tree. To allow all fish to have 
-- fin length while preventing humans from having fin length, fin length needs to be assigned to each of the fish taxa spearately.
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    -- Length
    (161061, 'caudal fin–snout length', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (161051, 'caudal fin–snout length', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (161039, 'caudal fin–snout length', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),
    (159785, 'caudal fin–snout length', 0, 10000, 'centimeter', 'Standard length is measured from the tip of the snout (or mouth) to the end of the last vertebra or the base of the caudal fin, excluding the length of the tail fin.'),

    (161061, 'otolith growth rings count', 0, 1000, NULL, 'Otolith rings are concentric growth layers in fish otoliths, used to determine the age and growth history of the fish through annual ring count analysis.'),
    (161051, 'otolith growth rings count', 0, 1000, NULL, 'Otolith rings are concentric growth layers in fish otoliths, used to determine the age and growth history of the fish through annual ring count analysis.'),
    (161039, 'otolith growth rings count', 0, 1000, NULL, 'Otolith rings are concentric growth layers in fish otoliths, used to determine the age and growth history of the fish through annual ring count analysis.'),

    (161061, 'cleithrum growth rings count', 0, 1000, NULL, 'The cleithrum is a bone in the pectoral girdle of fish that is used to determine age by counting its annual growth rings'),
    (161051, 'cleithrum growth rings count', 0, 1000, NULL, 'The cleithrum is a bone in the pectoral girdle of fish that is used to determine age by counting its annual growth rings'),
    (161039, 'cleithrum growth rings count', 0, 1000, NULL, 'The cleithrum is a bone in the pectoral girdle of fish that is used to determine age by counting its annual growth rings'),

    (161061, 'operculum growth rings count', 0, 1000, NULL, 'The operculum is a bony plate covering the gills of fish, used to determine age by counting its annual growth rings.'),
    (161051, 'operculum growth rings count', 0, 1000, NULL, 'The operculum is a bony plate covering the gills of fish, used to determine age by counting its annual growth rings.'),
    (161039, 'operculum growth rings count', 0, 1000, NULL, 'The operculum is a bony plate covering the gills of fish, used to determine age by counting its annual growth rings.');

WITH MeasurementIDs AS (
    INSERT INTO xref_taxon_measurement_qualitative (itis_tsn, measurement_name)
    VALUES
        (161061, 'life stage'),
        (161061, 'maturity'),
        (161051, 'life stage'),
        (161039, 'life stage')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_desc, option_value )
SELECT m.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    SELECT * FROM (
        VALUES
            (161061, 'maturity', 'Immature', 'Young individuals that have not yet reproduced; fish with underdeveloped gonads', 0),
            (161061, 'maturity', 'Maturing', 'Ovaries and testes begin to fill out and take up a large part of the body cavity; eggs
            distinguishable to the naked eye.', 1),
            (161061, 'maturity', 'Mature', 'Fish in full spawning colours; gonads at maximum size; body cavity feels full, especially
            females; roe or milt is not produced if the body cavity is lightly squeezed.', 2),
            (161061, 'maturity', 'Spawning', 'Fish in full spawning colours; eggs and milt are expelled when body cavity is lightly
            squeezed (also referred to as gravid).', 3),
            (161061, 'maturity', 'Spent', 'Still have spawning colours; eggs and sperm totally discharged; body cavity feels empty
            and genital opening is inflamed; gonads empty except for a few remaining eggs or residual
            sperm.', 4),
            (161051, 'maturity', 'Immature', 'Young individuals that have not yet reproduced; fish with underdeveloped gonads', 0),
            (161051, 'maturity', 'Maturing', 'Ovaries and testes begin to fill out and take up a large part of the body cavity; eggs
            distinguishable to the naked eye.', 1),
            (161051, 'maturity', 'Mature', 'Fish in full spawning colours; gonads at maximum size; body cavity feels full, especially
            females; roe or milt is not produced if the body cavity is lightly squeezed.', 2),
            (161051, 'maturity', 'Spawning', 'Fish in full spawning colours; eggs and milt are expelled when body cavity is lightly
            squeezed (also referred to as gravid).', 3),
            (161051, 'maturity', 'Spent', 'Still have spawning colours; eggs and sperm totally discharged; body cavity feels empty
            and genital opening is inflamed; gonads empty except for a few remaining eggs or residual
            sperm.', 4),
            (161039, 'maturity', 'Immature', 'Young individuals that have not yet reproduced; fish with underdeveloped gonads', 0),
            (161039, 'maturity', 'Maturing', 'Ovaries and testes begin to fill out and take up a large part of the body cavity; eggs
            distinguishable to the naked eye.', 1),
            (161039, 'maturity', 'Mature', 'Fish in full spawning colours; gonads at maximum size; body cavity feels full, especially
            females; roe or milt is not produced if the body cavity is lightly squeezed.', 2),
            (161039, 'maturity', 'Spawning', 'Fish in full spawning colours; eggs and milt are expelled when body cavity is lightly
            squeezed (also referred to as gravid).', 3),
            (161039, 'maturity', 'Spent', 'Still have spawning colours; eggs and sperm totally discharged; body cavity feels empty
            and genital opening is inflamed; gonads empty except for a few remaining eggs or residual
            sperm.', 4),
            (161061, 'maturity', 'Immature', 'Young individuals that have not yet reproduced; fish with underdeveloped gonads', 0),
            (161061, 'maturity', 'Maturing', 'Ovaries and testes begin to fill out and take up a large part of the body cavity; eggs
            distinguishable to the naked eye.', 1),
            (161061, 'maturity', 'Mature', 'Fish in full spawning colours; gonads at maximum size; body cavity feels full, especially
            females; roe or milt is not produced if the body cavity is lightly squeezed.', 2),
            (161061, 'maturity', 'Spawning', 'Fish in full spawning colours; eggs and milt are expelled when body cavity is lightly
            squeezed (also referred to as gravid).', 3),
            (161061, 'maturity', 'Spent', 'Still have spawning colours; eggs and sperm totally discharged; body cavity feels empty
            and genital opening is inflamed; gonads empty except for a few remaining eggs or residual
            sperm.', 4)
    ) AS option_data (itis_tsn, measurement_name, option_label, option_desc, option_value)
) AS o
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_name = m.measurement_name;
