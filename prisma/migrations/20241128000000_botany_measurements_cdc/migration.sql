----------------------------------------------------------------------------------------
-- INSERTING QUANTITATIVE BOTANY MEASUREMENTS 
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_quantitative (itis_tsn, measurement_name, min_value, max_value, unit, measurement_desc)
VALUES
    (161061, 'caudal fin–snout length', 0, 10000, 'centimeter', 'The distance between the tip of the snout and the base of the caudal fin.'),
    (161039, 'operculum growth rings count', 0, 1000, NULL, 'The number of growth rings in the operculum.');


----------------------------------------------------------------------------------------
-- INSERTING QUALITATIVE BOTANY MEASUREMENTS 
----------------------------------------------------------------------------------------
WITH MeasurementIDs AS (
    INSERT INTO xref_taxon_measurement_qualitative (itis_tsn, measurement_name)
    VALUES
        (161061, 'life stage'),
        (159785, 'maturity')
    RETURNING itis_tsn, taxon_measurement_id, measurement_name
)

----------------------------------------------------------------------------------------
-- INSERTING QUALITATIVE MEASUREMENT OPTIONS 
----------------------------------------------------------------------------------------
INSERT INTO xref_taxon_measurement_qualitative_option (taxon_measurement_id, option_label, option_desc, option_value )
SELECT m.taxon_measurement_id, o.option_label, o.option_desc, o.option_value
FROM (
    SELECT * FROM (
        VALUES
        (161061, 'maturity', 'Immature', 'Young individuals that have not yet reproduced; fish with underdeveloped gonads.', 0),
        (159785, 'life stage', 'adult', 'An individual able to reproduce.', 2)
    ) AS option_data (itis_tsn, measurement_name, option_label, option_desc, option_value)
) AS o
JOIN MeasurementIDs m ON o.itis_tsn = m.itis_tsn AND o.measurement_name = m.measurement_name;
