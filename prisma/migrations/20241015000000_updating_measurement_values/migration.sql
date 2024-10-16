----------------------------------------------------------------------------------------
-- Adding celsius if not exists
----------------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'measurement_unit' AND e.enumlabel = 'celsius' AND n.nspname = 'critterbase'
    ) THEN
        ALTER TYPE critterbase.measurement_unit ADD VALUE 'celsius';
    END IF;
END $$;


----------------------------------------------------------------------------------------
-- New markings type "Pit Tags"
----------------------------------------------------------------------------------------
INSERT into lk_marking_type
(name, description)
VALUES
('Pit tag', 'A small, implantable microchip for identifying and tracking animals electronically.'),
('Brand', 'A permanent symbol that is burned or frozen onto the skin.'),
('Clip', 'A small part of the animal is removed for identification.');

----------------------------------------------------------------------------------------
-- Updating and inserting body marking locations
----------------------------------------------------------------------------------------
UPDATE xref_taxon_marking_body_location
SET itis_tsn = 179913
WHERE body_location = 'Left Ear' OR body_location = 'Right Ear';

INSERT INTO xref_taxon_marking_body_location (body_location, description, itis_tsn)
VALUES ('Peritoneal cavity', 'The abdominal space containing organs, lined by the peritoneum membrane.', 161061),
('Dorsal fin', 'Fin located on the dorsal, or back, side of aquatic animals.', 161061), 
('Dorsal lymph sac', 'A fluid-filled structure located subcutaneously on the dorsal or back side of an animal.', 173423), 
('Flank', 'The side of an animals body between the ribs and hips.', 179913), 
('Ventral torso', 'The lower, stomach region of an animals body, on the underside.', 179913), 
('Dorsal torso', 'The upper, back region of an animals body, along the spine.', 179913), 
('Tail base', 'The area where the tail meets the body.', 179913),
('Tail base', 'The area where the tail meets the body.', 948936),
('Tail Proximate', 'Near the tail.', 174118),
('Head Proximate', 'Near the head.', 174118),
('Middle body', 'The mid portion of the serpent body.', 174118),
('Head', 'The region between the snout and the neck, just before the widening of the body.', 174118),
('Scales', 'Overlapping, protective plates made of keratin.', 174118),
('Tail', 'The region of the body spanning between the cloaca and the tail tip.', 174118), 
('Ventral torso', 'The lower, stomach region of a birds body, on the underside.', 174371), 
('Dorsal torso', 'The upper, back region of a birds body, along the spine.', 174371);

---------------------------------------------------------------------------------------
-- Adding quantitative measurements
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES

    (173423, 'snout-vent length', 0, 10000, 'centimeter', 'The distance from the tip of the snout to the opening of the vent or cloaca.'),
    (174371, 'wing span', 0, 10000, 'centimeter', 'The distance from the tip of one wing to the tip of the other when fully extended.'),
    (179985, 'wing span', 0, 10000, 'centimeter', 'The distance from the tip of one wing to the tip of the other when fully extended.'),
    (180704, 'horn length', 0, 10000, 'centimeter', 'The measurement from the base of the horn to the tip.'), 
    (180693, 'antler spread', 0, 10000, 'centimeter', 'The measured widest point of the antlers.');

INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_desc, option_value )
SELECT m.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    SELECT * FROM (
        VALUES
        (180702, 'Antler Configuration', 'Spike fork', 'Antlers with no branching.', 0), 
        (180702, 'Antler Configuration', 'Subprime', 'Small, undeveloped antlers not meeting trophy standards.', 1), 
        (180702, 'Antler Configuration', 'Prime', 'Large, fully developed antlers.', 2), 
        (180702, 'Antler Configuration', 'Raghorn', 'Small, irregular, or incomplete antlers.', 3), 
        (180702, 'Antler Configuration', 'Less than or equal to 3', 'Less than or equal to 3.', 4), 
        (180702, 'Antler Configuration', 'Greater than 3', 'Greater than or equal to 4.', 5)

) AS o
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_name = m.measurement_name;