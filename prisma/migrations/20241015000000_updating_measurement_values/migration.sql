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


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'measurement_unit' AND e.enumlabel = 'kHz' AND n.nspname = 'critterbase'
    ) THEN
        ALTER TYPE critterbase.measurement_unit ADD VALUE 'kHz';
    END IF;
END $$;
COMMIT;

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
VALUES ('Torso', 'The central region of the animal between the head and limbs, or fins.', 202423),
('Fin', 'Fin located on the dorsal, or pectoral, side of aquatic animals.', 161061), 
('Tail', 'The tail of the animal.', 202423);

---------------------------------------------------------------------------------------
-- Adding quantitative measurements
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES

    (173423, 'snout-vent length', 0, 10000, 'centimeter', 'The distance from the tip of the snout to the opening of the vent or cloaca.'),
    (174371, 'wing span', 0, 10000, 'centimeter', 'The distance from the tip of one wing to the tip of the other when fully extended.'),
    (179985, 'wing span', 0, 10000, 'centimeter', 'The distance from the tip of one wing to the tip of the other when fully extended.'),
    (180704, 'horn length', 0, 10000, 'centimeter', 'The measurement from the base of the horn to the tip.'), 
    (179985, 'call frequency',0,1000, 'kHz', 'The frequency of a call'),
    (180693, 'antler spread', 0, 10000, 'centimeter', 'The measured widest point of the antlers.');

 ---------------------------------------------------------------------------------------
-- Adding unclassified to life stage and sex 
----------------------------------------------------------------------------------------   
INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_desc, option_value)
SELECT 
    xq.taxon_measurement_id, 
    'Unclassified' AS option_label, 
    'The measurement is unclassified' AS option_desc, 
    COALESCE(MAX(xqo.option_value),0)+1
FROM xref_taxon_measurement_qualitative xq
LEFT JOIN xref_taxon_measurement_qualitative_option xqo
ON xq.taxon_measurement_id = xqo.taxon_measurement_id
WHERE LOWER(xq.measurement_name) = ANY (ARRAY['life stage', 'sex'])
GROUP BY xq.taxon_measurement_id;