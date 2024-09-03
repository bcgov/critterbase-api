/*
Changes critter sex from an enum to a quantitative measurement to allow for species-specific sex values.

*/

-- Step 1: Add new column for UUID values
ALTER TABLE critter ADD COLUMN sex_qualitative_option_id UUID;

-- Step 2: Update the temporary column with mapped UUIDs
-- The only critters with sex values are animals, so we can just consider the sex measurement assigned to Animalia (202423)
WITH w_sex_measurement_options AS (
    SELECT qo.option_label AS sex_option_label, qo.qualitative_option_id
    FROM xref_taxon_measurement_qualitative_option qo
    JOIN xref_taxon_measurement_qualitative q
      ON q.taxon_measurement_id = qo.taxon_measurement_id
    WHERE q.measurement_name = 'sex' AND q.itis_tsn = '202423'
)
UPDATE critter
SET sex_qualitative_option_id = qm.qualitative_option_id
FROM w_sex_measurement_options qm
-- finds measurement_option_ids by matching on the labels (eg. "male" in the old sex column -> sex measurement labelled "male")
WHERE LOWER(critter.sex::TEXT) = LOWER(qm.sex_option_label);

-- Step 3: Drop the old column and rename the new column
ALTER TABLE critter DROP COLUMN sex;

-- Step 4: Add the foreign key constraint
ALTER TABLE critter
    ADD CONSTRAINT critter_sex_fkey FOREIGN KEY (sex_qualitative_option_id) REFERENCES critterbase.xref_taxon_measurement_qualitative_option(qualitative_option_id);

-- Step 5: Create an index on the `sex_qualitative_option_id` column
CREATE INDEX critter_idx1 ON critter(sex_qualitative_option_id);
