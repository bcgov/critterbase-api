-- AlterTable
ALTER TABLE "critter" ADD COLUMN     "itis_tsn" INTEGER,
ADD COLUMN "itis_scientific_name" TEXT;

-- AlterTable
ALTER TABLE "mortality" ADD COLUMN     "proximate_predated_by_itis_tsn" INTEGER,
ADD COLUMN     "ultimate_predated_by_itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_collection_category" ADD COLUMN     "itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_marking_body_location" ADD COLUMN     "itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_measurement_qualitative" ADD COLUMN     "itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_measurement_quantitative" ADD COLUMN     "itis_tsn" INTEGER;

-- Patch TSN's

-- Animalia 
UPDATE critter a                             SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';

-- Chordata
UPDATE critter a                             SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';

-- Mammalia
UPDATE critter a                             SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';

-- Artiodactyla
UPDATE critter a                             SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';

-- Cervidae
UPDATE critter a                             SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';

-- Alces
UPDATE critter a                             SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';

-- Alces alces
UPDATE critter a                             SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';

-- Rangifer
UPDATE critter a                             SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';

-- Rangifer tarandus
UPDATE critter a                             SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';

-- Carnivora
UPDATE critter a                             SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';

-- Canidae
UPDATE critter a                             SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';

-- Canis
UPDATE critter a                             SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';

-- Canis lupus
UPDATE critter a                             SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';

-- Ursidae
UPDATE critter a                             SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';

-- Ursus
UPDATE critter a                             SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';

-- Usrsus arctos
UPDATE critter a                             SET itis_tsn                       = 180543 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180543 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180543 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180543 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180543 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180543 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180543 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';

