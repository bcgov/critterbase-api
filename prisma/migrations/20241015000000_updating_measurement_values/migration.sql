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
('Pit tag', 'A small, implantable microchip for identifying and tracking animals electronically.');

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
('Middle body', 'The mid portion of the serpent body.', 174118)