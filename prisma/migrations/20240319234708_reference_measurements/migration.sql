-- AlterTable
-- Primary key mistakenly dropped in last migration, adding back
ALTER TABLE "xref_taxon_collection_category" DROP CONSTRAINT IF EXISTS "xref_taxon_collection_category_pk";
ALTER TABLE "xref_taxon_collection_category" ADD CONSTRAINT "xref_taxon_collection_category_pk" PRIMARY KEY ("collection_category_id");

-- Create unique constraint for user
ALTER TABLE "user" ADD CONSTRAINT unq_user_identifier_and_uuid UNIQUE (user_identifier, keycloak_uuid);

-- Disable trigger to manually set SYSTEM account.
ALTER TABLE "user" DISABLE TRIGGER ALL;

-- In PRODUCTION environments this value already exits.
-- Using fallback values to handle the edge cases
INSERT INTO "user" (user_id, user_identifier, keycloak_uuid, create_user, update_user)
VALUES (
  coalesce(getuserid('SYSTEM'), '00000000-0000-0000-0000-000000000000'),
  'SYSTEM',
  NULL,
  coalesce(getuserid('SYSTEM'), '00000000-0000-0000-0000-000000000000'),
  coalesce(getuserid('SYSTEM'), '00000000-0000-0000-0000-000000000000'))
ON CONFLICT (user_id) DO NOTHING;


-- Enable trigger after SYSTEM account rectified.
ALTER TABLE "user" ENABLE TRIGGER ALL;

INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    (331030, 'skull length', 0, 10000, 'centimeter', NULL),
    (331030, 'skull width', 0, 10000, 'centimeter', NULL),
    (914181, 'neck girth', 0, 10000, 'centimeter', NULL),
    (914181, 'neck length', 0, 10000, 'centimeter', NULL),
    (180135, 'nest height', 0, 10000, 'centimeter', NULL),
    (173747, 'snout-vent length', 0, 10000, 'millimeter', NULL),
    (173747, 'body length', 0, 10000, 'millimeter', NULL),
    (173747, 'body mass', 0, 10000, 'gram', NULL),
    (202422, 'Diameter at breast height (DBH)', 0, 10000, 'centimeter', NULL),
    (179913, 'baculum length', 0, 10000, 'centimeter', 'The length of the baculum bone, measured from start to end.'),
    (179913, 'chest girth', 0, 10000, 'centimeter', 'The circumference of the chest, measured at the largest point.'),
    (179913, 'abdomen girth', 0, 10000, 'centimeter', 'The circumference of the abdomen, measured at the largest point.'),
    (179913, 'canine length', 0, 10000, 'centimeter', NULL),
    (179913, 'canine width', 0, 10000, 'centimeter', NULL),
    (179913, 'ear length', 0, 10000, 'centimeter', NULL),
    (179913, 'forearm length', 0, 10000, 'centimeter', NULL),
    (179913, 'hind leg length', 0, 10000, 'centimeter', NULL),
    (179913, 'foot length', 0, 10000, 'centimeter', NULL),
    (179913, 'paw length', 0, 10000, 'centimeter', NULL),
    (179913, 'paw width', 0, 10000, 'centimeter', NULL),
    (179913, 'foot width', 0, 10000, 'centimeter', NULL),
    (179913, 'hallux length', 0, 10000, 'centimeter', 'The length of the hallux, or big toe, measured from start to end.'),
    (179913, 'nipple length', 0, 10000, 'centimeter', NULL),
    (179913, 'shoulder height', 0, 10000, 'centimeter', NULL),
    (179913, 'shoulder width', 0, 10000, 'centimeter', NULL),
    (179913, 'body length', 0, 10000, 'centimeter', NULL),
    (179913, 'body mass', 0, 10000, 'kilogram', NULL),
    (174371, 'cere depth', 0, 10000, 'centimeter', NULL),
    (174371, 'culmen length', 0, 10000, 'centimeter', NULL),
    (174371, 'culmen width', 0, 10000, 'centimeter', NULL),
    (174371, 'nest diameter (inner)', 0, 10000, 'centimeter', NULL),
    (174371, 'nest diameter (outer)', 0, 10000, 'centimeter', NULL),
    (174371, 'cavity opening diameter', 0, 10000, 'centimeter', NULL),
    (174371, 'nest height', 0, 10000, 'centimeter', NULL),
    (174371, 'body mass', 0, 10000, 'gram', NULL),
    (174371, 'tarsus length', 0, 10000, 'millimeter', NULL),
    (174371, 'tarsus width', 0, 10000, 'millimeter', NULL),
    (174371, 'wing chord', 0, 10000, 'millimeter', NULL),
    (180692, 'antler point count', 0, 10000, NULL, NULL),
    (202423, 'age', 0, 10000, NULL, 'The number of years that the animal has been alive for'),
    (202423, 'offspring count', 0, 10000, NULL, NULL),
    (202423, 'tail length', 0, 10000, 'centimeter', NULL); --This entry says that all animals have tails. This needs to change

WITH MeasurementIDs AS (
    INSERT INTO xref_taxon_measurement_qualitative (itis_tsn, measurement_name)
    VALUES
        (179913, 'fur colour (primary)'),
        (179913, 'fur colour (secondary)'),
        (174371, 'life stage'),
        (180692, 'antler configuration'),
        (202423, 'sex')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)
INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_value)
SELECT m.taxon_measurement_id, o.option_label, o.option_value
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
    ) AS option_data (itis_tsn, measurement_name, option_label, option_value)
) AS o
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_name = m.measurement_name;
