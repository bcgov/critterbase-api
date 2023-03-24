DROP TABLE IF EXISTS bctw.animal;
DROP SCHEMA IF EXISTS bctw;

CREATE SCHEMA bctw;

CREATE TABLE bctw.animal (
	critter_id uuid NOT NULL DEFAULT crypto.gen_random_uuid(),
	critter_transaction_id uuid NOT NULL DEFAULT crypto.gen_random_uuid(),
	animal_id varchar(30) NULL,
	animal_status varchar(300) NULL,
	associated_animal_id varchar(30) NULL,
	associated_animal_relationship varchar(300) NULL,
	capture_comment varchar(200) NULL,
	capture_date timestamptz NULL,
	capture_latitude float8 NULL,
	capture_longitude float8 NULL,
	capture_utm_easting int4 NULL,
	capture_utm_northing int4 NULL,
	capture_utm_zone int4 NULL,
	collective_unit varchar(60) NULL,
	animal_colouration varchar(20) NULL,
	ear_tag_left_colour varchar(20) NULL,
	ear_tag_right_colour varchar(20) NULL,
	estimated_age float8 NULL,
	juvenile_at_heel varchar(300) NULL,
	life_stage varchar(300) NULL,
	map_colour varchar(30) NULL,
	mortality_comment varchar(200) NULL,
	mortality_date timestamptz NULL,
	mortality_latitude float8 NULL,
	mortality_longitude float8 NULL,
	mortality_utm_easting int4 NULL,
	mortality_utm_northing int4 NULL,
	mortality_utm_zone int4 NULL,
	proximate_cause_of_death varchar(300) NULL,
	ultimate_cause_of_death varchar(300) NULL,
	population_unit varchar(300) NULL,
	recapture_ind bool NULL,
	region varchar(300) NULL,
	release_comment varchar(200) NULL,
	release_date timestamptz NULL,
	release_latitude float8 NULL,
	release_longitude float8 NULL,
	release_utm_easting int4 NULL,
	release_utm_northing int4 NULL,
	release_utm_zone int4 NULL,
	sex varchar(300) NULL,
	species varchar(20) NULL,
	translocation_ind bool NULL,
	wlh_id varchar(20) NULL,
	animal_comment varchar(200) NULL,
	created_at timestamptz NULL DEFAULT now(),
	created_by_user_id int4 NULL,
	updated_at timestamptz NULL DEFAULT now(),
	updated_by_user_id int4 NULL,
	valid_from timestamptz NULL DEFAULT now(),
	valid_to timestamptz NULL,
	pcod_predator_species varchar(20) NULL,
	owned_by_user_id int4 NULL,
	ear_tag_left_id varchar(20) NULL,
	ear_tag_right_id varchar(20) NULL,
	juvenile_at_heel_count int4 NULL,
	predator_known_ind bool NULL,
	captivity_status_ind bool NULL,
	mortality_captivity_status_ind bool NULL,
	ucod_predator_species varchar(20) NULL,
	pcod_confidence varchar(300) NULL,
	ucod_confidence varchar(300) NULL,
	mortality_report_ind bool NULL,
	mortality_investigation varchar(300) NULL,
	device_id int4 NULL,
	you varchar(13) NULL,
	CONSTRAINT animal_pkey PRIMARY KEY (critter_transaction_id)
);

INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('4bd8fe08-f0e1-41fd-99b3-494fab00a763','157c4ca7-4c76-4290-9b63-b88d1eaba165','6','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,401428,5767390,10,NULL,NULL,'','0-1889',NULL,NULL,NULL,NULL,NULL,NULL,'#38A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10748','*Moved to Rainbows in May 2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('0e634a79-de08-4db0-8a33-71dfdfdd9405','9623b126-7c4a-4018-9956-b73f16dca845','7','Alive',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,372188,5774520,10,NULL,NULL,'','0-1861',NULL,NULL,NULL,'No',NULL,NULL,'#FFFFBE','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10793','Last fix 7/21/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('c20c4b75-e3b1-48eb-9924-5ae66f1e14ab','2666d761-4f6b-4073-a94b-62d8eb0a57d3','8','Unknown',NULL,NULL,NULL,'2018-03-13 00:00:00-07',NULL,NULL,398601,5770273,10,NULL,NULL,'','0-1873',NULL,NULL,NULL,'No',NULL,NULL,'#A83800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10785','Last fix 7/18/2018; *Moved to Rainbows in May 2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('e77e14e8-1dac-475c-bdb1-2c6bdaf97578','56739d2e-3388-4f9e-ac90-a6ebccc6b351','29','Unknown',NULL,NULL,NULL,'2018-03-08 00:00:00-08',NULL,NULL,374843,5777591,10,NULL,NULL,'','0-1792',NULL,NULL,NULL,'No',NULL,NULL,'#A80084','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10770','Last fix 9/24/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('d3f8323f-e441-4191-9274-093c805ffc64','3b0fc204-62af-4929-9470-eeefcaa4128e','30','Unknown',NULL,NULL,NULL,'2018-03-08 00:00:00-08',NULL,NULL,374661,5774908,10,NULL,NULL,'','0-1892',NULL,NULL,NULL,'No',NULL,NULL,'#0082FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10761','Last fix 11/08/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('ed30fd30-5011-4f0e-8df1-edae7c006554','1cf05c1d-58bc-4ae9-8cb5-715c07b70069','9','Mortality',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,416340,5776235,10,NULL,NULL,'','0-1857',NULL,NULL,NULL,'No',NULL,NULL,'#38A800','','2018-07-27 00:00:00-07',NULL,NULL,406868,5837723,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10772','Probable wolf Predation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('a134a301-ce7f-4c3e-a116-3aaae6f582aa','8e16b266-fdbf-4c5e-91ee-5cca30c0053e','50','Mortality',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,412236,5781892,10,NULL,NULL,'','0-1771',NULL,NULL,NULL,'No',NULL,NULL,'#AAFF00','Email alert Aug 26, 2018.','2018-08-26 00:00:00-07',NULL,NULL,425006,5837108,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10764','Mortality site 2.4km from mortality alert location. Health related - Compound fracture rear right leg; Mortality site 2.4km from mortality alert location',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('7a8bca4e-177e-46fb-81eb-31788a4466a1','51a5bd13-d410-4971-b683-811e58ebda90','10','Unknown',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,412753,5781047,10,NULL,NULL,'','0-1855',NULL,NULL,NULL,'No',NULL,NULL,'#FFD37F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10776','Last fix 11/21/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('c06e8b7e-c108-4862-b184-309fee888150','9967d6b2-0c71-4ac6-b57a-3d9a4b483516','46','Mortality',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,400326,5774272,10,NULL,NULL,'','0-1890',NULL,NULL,NULL,'No',NULL,NULL,'#004C73','','2018-03-22 00:00:00-07',NULL,NULL,404158,5770389,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10749','Cougar Predation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('d8d64480-818b-47da-bb16-684c8e18734d','e7e02f1e-c94f-47ac-a2a4-55d90506c204','47','Mortality',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,404393,5776215,10,NULL,NULL,'','0-1881',NULL,NULL,NULL,'No',NULL,NULL,'#A8A800','Email alert Aug 17, 2018.','2018-08-17 00:00:00-07',NULL,NULL,425430,5835746,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10775','Likely inexperienced bear per comms Wildlife Health Team; Probable bear predation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('7aecb1fc-7778-4768-b0cf-2e4ea4a3d9fd','af75e68e-23a0-4603-add8-75070ea6f659','48','Unknown',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,412897,5777577,10,NULL,NULL,'','0-1872',NULL,NULL,NULL,'No',NULL,NULL,'#732600','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10786','Last fix 6/19/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('aee7cdbd-f02b-49ca-8d08-5b306b82e979','052dafcb-94dd-4c7c-a825-7ec4c1d3f225','26','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,366933,5791599,10,NULL,NULL,'','0-1876',NULL,NULL,NULL,'No',NULL,NULL,'#A900E6','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10753','Last fix 1/24/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('c79f3b59-9c75-400e-82cb-637bb086300e','9bd3f14c-b3e7-4dcd-a01f-bcf6e6159cc2','27','Mortality',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,402479,5774639,10,NULL,NULL,'','0-1878',NULL,NULL,NULL,'No',NULL,NULL,'#732600','','2018-04-02 00:00:00-07',NULL,NULL,406212,5765484,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10751','Mortality most likely occurred on march 30th. Did not send mort signal until April 3rd.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('f0dc2059-dc54-4ce2-8987-5f0e65bf807a','a8c6d9f2-b4bc-4c2c-986f-6ea0800198b2','28','Mortality',NULL,NULL,NULL,'2018-03-13 00:00:00-07',NULL,NULL,402835,5768828,10,NULL,NULL,'','0-1882',NULL,NULL,NULL,'No',NULL,NULL,'#FF00C5','','2019-12-04 00:00:00-08',NULL,NULL,385936,5823941,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10780','Received mortality signal, unable to investigate due to weather, Itcha pack collar was at this location on Dec 4',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('f754f6a6-c08f-4aee-8ef5-943dfe493fba','c2efbee0-dffe-48af-99f9-507da47d4035','31','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,417129,5776040,10,NULL,NULL,'','0-1891',NULL,NULL,NULL,'No',NULL,NULL,'#FFD37F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10763','Last fix 2/20/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('a0585186-b93e-40f0-a9c0-c5392e3f8b00','ede82d67-c1d4-4cb0-8331-181a0cacda16','32','Unknown',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,380697,5780435,10,NULL,NULL,'','0-1868',NULL,NULL,NULL,'No',NULL,NULL,'#DF73FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10755','Last fix 7/31/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('804ae9cf-7e8d-472e-92ae-cc13f2e0dfa0','1f3c37da-9d9a-4eab-a18e-27223901edcc','12','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,393251,5774068,10,NULL,NULL,'','0-1894',NULL,NULL,NULL,'No',NULL,NULL,'#00A884','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10781','Last fix 8/11/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('75c82af6-f274-493c-a8b3-9b3ad23a781a','658f8b97-c59f-4a20-a282-322790a430be','13','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,401400,5767391,10,NULL,NULL,'','0-1870',NULL,NULL,NULL,'No',NULL,NULL,'#00734C','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10744','Last fix 6/05/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('fe4a231a-788f-4cb5-927d-736cee995be8','33ef72b3-951d-4863-bf39-fde3816ea3c1','14','Mortality',NULL,NULL,NULL,'2018-03-13 00:00:00-07',NULL,NULL,388526,5790265,10,NULL,NULL,'','0-1851',NULL,NULL,NULL,'No',NULL,NULL,'#A83800','MORTALITY - spatial review, last data 26/03/2019. Email alert 25-Mar-19, and mortality file 23-Mar-19.','2019-03-25 00:00:00-07',NULL,NULL,412444,5777046,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10792','Cougar still at kill site',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('2cdef57a-098f-4ebc-873c-1eb75c8aebb4','2c0902a6-c56c-4f0a-a930-1e36b95dc1ff','15','Mortality',NULL,NULL,NULL,'2018-03-13 00:00:00-07',NULL,NULL,387927,5789928,10,NULL,NULL,'','0-1888',NULL,NULL,NULL,NULL,NULL,NULL,'#FF73DF','Email alert 20-Aug-18','2018-08-20 00:00:00-07',NULL,NULL,364975,5836323,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10746','Probable wolf Predation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('fc619dea-7e6b-4f47-adda-fda830526afe','e86e5be6-f87c-4e95-8f9b-f8e117935889','39','Unknown',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,365703,5799942,10,NULL,NULL,'','0-1781',NULL,NULL,NULL,'No',NULL,NULL,'#FFD37F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10784','Last fix 9/14/2018; *Moved to N.Tweedsmuir in May 2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('0455d6ff-b76b-45e6-8241-3dd53918cdea','53ee5c9c-3526-4ace-9c3f-6e900f64af29','16','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,366868,5791730,10,NULL,NULL,'','0-1782',NULL,NULL,NULL,'No',NULL,NULL,'#70A800','Email alert Jul 17, mortality file Aug 1, 2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10766','Last fix 04-23-2020',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('82fc1fba-c538-43f8-84d9-60b243b7df77','5c69bd93-dc6e-4634-bbea-b1d1cc884185','17','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,416492,5776208,10,NULL,NULL,'','0-1877',NULL,NULL,NULL,'No',NULL,NULL,'#4CE600','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10752','Last fix 5/25/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('bab2d15f-3d27-48a0-819d-2a37e18adc65','19231d5e-3574-48f6-914d-9d0a2cc84391','19','Unknown',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,380434,5779447,10,NULL,NULL,'','0-1895',NULL,NULL,NULL,'No',NULL,NULL,'#FFEBAF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10790','Last fix 4/2/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('88802a51-e314-442d-8b82-842cc8cb5605','884da41e-afe9-4b73-953b-d3b523c89468','20','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,404034,5768682,10,NULL,NULL,'','0-1791',NULL,NULL,NULL,'No',NULL,NULL,'#D3FFBE','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10769','Last fix 08-10-2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('d4a2bd73-72e8-4738-9f40-4bc00472d8e6','3748cce1-fb47-4031-9a92-cc0704728d52','21','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,419873,5783578,10,NULL,NULL,'','0-1884',NULL,NULL,NULL,'No',NULL,NULL,'#FFEBAF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10762','Last fix 8/20/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('6263f59e-726b-4273-92fe-08dbbf1c7638','24ab8fda-2052-452b-8c0c-4cbfc4a0cc23','22','Mortality',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,418588,5778613,10,NULL,NULL,'','0-1883',NULL,NULL,NULL,'No',NULL,NULL,'#4C7300','Mortality email Nov 11, 2020 & Sept 29th and 30, 2020','2020-10-10 00:00:00-07',NULL,NULL,367705,5838073,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10778','Signal came in late. Old mortality had to dig collar out of snow.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('b64a3a66-3fa5-4af9-a31f-095cd5e57404','65f29863-7912-4b28-80aa-04a4af0ee4f7','23','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,421574,5783835,10,NULL,NULL,'','0-1860',NULL,NULL,NULL,'No',NULL,NULL,'#A3FF73','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10758','Last fix 03-09-2020',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('56075f99-07f0-4ddf-ac82-64a342a7d5df','bdf1fef9-817a-468a-8907-7b434424d8db','24','Mortality',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,402146,5774514,10,NULL,NULL,'','0-1856',NULL,NULL,NULL,NULL,NULL,NULL,'#98E600','Email alert Jul 1, mortality file Aug 1, 2019','2019-07-01 00:00:00-07',NULL,NULL,423425,5829052,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10788','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('29f82991-712a-424e-a37c-852d6a2a1e9b','82380816-8eef-401a-8e23-cffcc1355e5e','25','Unknown',NULL,NULL,NULL,'2018-03-13 00:00:00-07',NULL,NULL,407612,5774333,10,NULL,NULL,'','0-1854',NULL,NULL,NULL,'No',NULL,NULL,'#0082FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10791','Last fix 03-24-2020',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('0006cd82-3da7-4674-9394-1d68d69716e7','b8c2cc1d-413c-4176-9b72-976cf2752f1c','1','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,403387,5772537,10,NULL,NULL,'','0-1885',NULL,NULL,NULL,NULL,NULL,NULL,'#A900E6','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10760','Last fix 09-10-2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('0ec87511-70e5-487c-ad0a-137d674cec3a','e86e7b8f-752e-48d3-8da1-5b8f239acab3','2','Unknown',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,394504,5770553,10,NULL,NULL,'','0-1871',NULL,NULL,NULL,NULL,NULL,NULL,'#FFD37F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10789','Last fix 5/16/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('0cd68d8c-cb02-42e9-8c38-3221eacd0996','b7654cf3-5775-4370-b6fd-65115c8dd8c8','3','Unknown',NULL,NULL,NULL,'2018-03-13 00:00:00-07',NULL,NULL,372174,5774333,10,NULL,NULL,'','0-1880',NULL,NULL,NULL,NULL,NULL,NULL,'#BEFFE8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10750','Last fix 9/13/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('f35b011b-d002-49f7-9628-79980df4e5b3','51880bc2-76b9-424a-ba7b-8951495e41ee','5','Alive',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,369044,5789216,10,NULL,NULL,'','0-1783',NULL,NULL,NULL,NULL,NULL,NULL,'#FF7F7F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10782','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('9c7ec486-cb21-4cce-962c-6595c46741f4','137347d6-d1ea-43f3-a164-6eed56716906','11','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,413055,5782692,10,NULL,NULL,'','0-1859',NULL,NULL,NULL,'No',NULL,NULL,'#8400A8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10759','Last fix 6/04/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('7c674fae-74ff-4116-a2a1-37d6dad9d2c4','4365843e-17c6-4c27-bcef-e9508f700265','49','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,419995,5783713,10,NULL,NULL,'','0-1893',NULL,NULL,NULL,'No',NULL,NULL,'#FFEBAF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10745','Last fix 11/07/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('30069510-1352-44dd-8f5e-aedb1cdaa88c','a2647f01-ed54-45c9-8767-ed6c28b3ca56','40','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,393264,5774081,10,NULL,NULL,'','0-1874',NULL,NULL,NULL,'No',NULL,NULL,'#73DFFF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10768','Last fix 8/26/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('9342b7b1-2b68-4b40-aded-4a0fad51964d','87eccf45-f960-4ac0-b20d-ff36c2f54382','4','Mortality',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,372204,5775267,10,NULL,NULL,'','0-1864',NULL,NULL,NULL,'No',NULL,NULL,'#FFBEBE','Email alert Jul 3, mortality file Aug 1, 2019','2019-07-03 00:00:00-07',NULL,NULL,373316,5834880,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10774','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('0907e89c-0b3b-4889-a1d4-428cb9c37a51','7a4841d2-8fa8-4a9c-b020-28f30de6ac60','41','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,420949,5785198,10,NULL,NULL,'','0-1867',NULL,NULL,NULL,'No',NULL,NULL,'#A8A800','Email alert 19-Oct-18, and mortality file Oct 25, 2018',NULL,NULL,NULL,380145,5831847,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10783','Not a mortality, collar dropped off of caribou',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('ee00b66c-f058-4a99-a297-840544599085','96aaa847-75b6-45d7-b7e6-dc5647f0504d','42','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,419799,5784060,10,NULL,NULL,'','0-1866',NULL,NULL,NULL,'No',NULL,NULL,'#A87000','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10756','Last fix 4/13/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('37e85a05-3606-46dc-baf5-95770c1ad48e','1c7f9a28-3538-489d-8fdf-a4623cd7dbfa','43','Mortality',NULL,NULL,NULL,'2018-03-08 00:00:00-08',NULL,NULL,384968,5775668,10,NULL,NULL,'','0-1793',NULL,NULL,NULL,'No',NULL,NULL,'#732600','','2018-08-06 00:00:00-07',NULL,NULL,378442,5836488,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10757','Probable wolf Predation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('ff8c80d3-1626-49b7-9b85-3758289f8de2','38194336-19f9-459f-9c2c-9641e4270f62','33','Unknown',NULL,NULL,NULL,'2018-03-11 00:00:00-08',NULL,NULL,365890,5800182,10,NULL,NULL,'','0-1794',NULL,NULL,NULL,'No',NULL,NULL,'#D1FF73','Email alert Nov 14, 2018',NULL,NULL,NULL,397278,5846465,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10777','*Moved to Rainbows in May 2018; not a mortality (animal alive), collar retrieved, collar dropped 2018-Nov-14 at 10.397278.5846465',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('e3a61332-9d1a-48fe-ae13-d31b3bb7e752','7cde0696-2a8a-42c2-b270-913c3d780a78','34','Unknown',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,411508,5776825,10,NULL,NULL,'','0-1862',NULL,NULL,NULL,'No',NULL,NULL,'#732600','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10765','Last fix 8/4/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('f0504cb6-52ba-4659-9703-853a399e7c1c','5b613d93-43e2-46a3-86eb-fbe44dc0150d','35','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,366958,5790411,10,NULL,NULL,'','0-1879',NULL,NULL,NULL,'No',NULL,NULL,'#A8A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10747','Last fix 5/23/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('94bf52b1-b4af-4586-9677-25818da9a037','1c6d77ca-06d3-43bc-b5c1-f3d3c04c56ca','36','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,420412,5783792,10,NULL,NULL,'','0-1853',NULL,NULL,NULL,'No',NULL,NULL,'#00A884','Email alert 20-Oct-18, and mortality file Oct 25, 2018',NULL,NULL,NULL,380145,5831847,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10767','Not a mortality, collar dropped off of caribou 2018-Oct-20, near (< 1km) collar 101879',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('a4c2455e-b20e-49c8-88ce-d51f6784f0df','9f4e9847-6117-49d9-97b5-b129c62e4fe2','37','Unknown',NULL,NULL,NULL,'2018-03-12 00:00:00-07',NULL,NULL,368705,5789325,10,NULL,NULL,'','0-1869',NULL,NULL,NULL,'No',NULL,NULL,'#E8BEFF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10754','Last fix 2/02/2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('149998a1-5094-49ce-b0ea-ca49ab692021','e27a00ef-c8f2-4f75-bf7e-db0f0c984080','38','Unknown',NULL,NULL,NULL,'2018-03-09 00:00:00-08',NULL,NULL,413422,5782185,10,NULL,NULL,'','0-1858',NULL,NULL,NULL,'No',NULL,NULL,'#D1FF73','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10773','Last fix 10/19/2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('6683aae2-fe68-45c3-8151-b0ed485ea2d8','b470e6a8-c44d-4e3d-8bb6-14737a36959d','45','Unknown',NULL,NULL,NULL,'2018-03-10 00:00:00-08',NULL,NULL,391913,5774106,10,NULL,NULL,'','0-1890',NULL,NULL,NULL,'No',NULL,NULL,'#004DA8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'17-10779','Last fix 10/02/2018; *Moved to Rainbows in May 2018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('992a6251-6b3b-49d3-966b-2e452fa5ecb2','5287c429-e306-4281-90e6-8ee79ebf9e51','57','Unknown',NULL,NULL,NULL,'2019-02-05 00:00:00-08',NULL,NULL,381693,5794034,10,NULL,NULL,'YELLOW','Black',NULL,NULL,NULL,'No',NULL,'Adult','#DF73FF','Mortality file May 9, 2019 - TESTING?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13133',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('d03604df-f188-4139-a23a-839bc4f29b4f','12405fe7-c5c8-4120-be23-af3c8e398835','51','Unknown',NULL,NULL,NULL,'2019-02-14 00:00:00-08',NULL,NULL,377483,5793769,10,NULL,NULL,'WHITE','ORANGE  ',NULL,NULL,NULL,NULL,NULL,'Adult','#BEFFE8','Mortality file May 9, 2019 - TESTING?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'18-13127',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('12ab62b2-31de-4cbe-b182-506fc79c9924','02393fd4-c8fb-4b23-8756-e66a52a3e5da',NULL,'Alive',NULL,NULL,'BorealCaribou; No eartag?','2021-02-19 00:00:00-08',58.113848,-121.179285,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#AAFF00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Chinchaga',NULL,'Peace',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',NULL,'20-1981',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-01-25 17:52:02.23611-08',NULL,'2023-01-25 17:52:02.23611-08',88,88),
	 ('93abad3b-abd6-47e2-aa27-48b5c578e6d3','6cc8c7cf-ef36-47e5-b515-79a1dd478583','52','Mortality',NULL,NULL,NULL,'2019-02-04 00:00:00-08',NULL,NULL,365047,5784698,10,NULL,NULL,'WHITE','YELLOW',NULL,NULL,NULL,NULL,NULL,'Subadult','#8400A8','Mortality file May 9, 2019 - TESTING?','2020-03-30 00:00:00-07',NULL,NULL,3662651,5775550,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'18-13134','Intact carcass found. No signs of predators. Test results should lung trauma. Helen expects that neck was broken. Pressume fight with another bull is COD. ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('aed49a38-5a94-4111-a63f-e29915bbf00a','70daa28b-1fc9-4001-b3af-71106dde186f','53','Mortality',NULL,NULL,NULL,'2019-02-10 00:00:00-08',NULL,NULL,368658,5785287,10,NULL,NULL,'RED  ','YELLOW',NULL,NULL,NULL,NULL,NULL,'Adult','#A3FF73','Mortality file May 9, 2019 - TESTING?','2020-05-29 00:00:00-07',NULL,NULL,409175,5817523,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'18-13130','Carcass located by creek. Fresh wolf tracks and scat. ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('ace1d379-436f-4929-b039-fc2b64747187','1d0cb3db-9bd4-45f5-bdac-8e58c5b02724','59','Mortality',NULL,NULL,NULL,'2019-02-05 00:00:00-08',NULL,NULL,381693,5794034,10,NULL,NULL,'ORANGE','BLUE',NULL,NULL,NULL,'No',NULL,'Adult','#BED2FF','Mortality file May 9, 2019 - TESTING?','2021-07-23 00:00:00-07',NULL,NULL,377935,5846054,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13129','No helicopters available to investigate because of high fire activity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('e9fe538e-926b-41e6-b72b-7c97500887e0','f37fafce-5112-4d71-9ff1-c4169bd3da5d','60','Mortality',NULL,NULL,NULL,'2019-02-06 00:00:00-08',NULL,NULL,375462,5795989,10,NULL,NULL,'BLUE','RED',NULL,NULL,NULL,'No',NULL,'Adult','#BEFFE8','Mortality file May 9, 2019 - TESTING?','2020-08-02 00:00:00-07',NULL,NULL,691817,5829987,9,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13128','Only collar located at mortality notification location. Collar was cached. Site where disturbance, caribou hair first encountered was ~400 SE of collar. One set of wolf tracks in general area. 6 bear ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('681f16b5-6b02-4bda-ae65-3d55e0a6ee20','0ba4d487-1c64-46d2-b48d-352a9a1c89ad','61','Alive',NULL,NULL,NULL,'2019-02-04 00:00:00-08',NULL,NULL,365047,5784698,10,NULL,NULL,'ORANGE ','RED',NULL,NULL,NULL,'No',NULL,'Adult','#0084A8','Mortality file May 9, 2019 - TESTING?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13137','last fix 2020-12-25',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('6437ba57-0f1d-437d-8442-3a579e26eff3','de4120e2-12a7-47a8-ae4e-a61f138d411b','54','Mortality',NULL,NULL,NULL,'2019-02-14 00:00:00-08',NULL,NULL,367958,5786159,10,NULL,NULL,'RED','BLUE',NULL,NULL,NULL,NULL,NULL,'Subadult','#002673','Mortality file May 9, 2019 - TESTING?','2019-10-15 00:00:00-07',NULL,NULL,370375,5845512,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'18-13136','Carcass located by creek, in willow and alder. Consumed with legs detached and scattered. Fresh snowfall this morning. Wolf scat surrounding carcass collected. Pre mortem hemorraghing to rear legs. Co',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('5715e178-ee94-4586-93a1-df3e3a00e477','241cd9e3-d301-42cf-9731-28f36f165a03','62','Unknown',NULL,NULL,NULL,'2019-02-05 00:00:00-08',NULL,NULL,394237,5794983,10,NULL,NULL,'WHITE','BLACK',NULL,NULL,NULL,'Yes',NULL,'Subadult','#4C0073','Mortality file May 9, 2019 - TESTING?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13131',' last fix 2020-05-26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('ead00f5e-ab6b-40d2-868a-768a6d7bb11b','135a33f8-3b10-4998-8580-0555a78b87a5','55','Mortality',NULL,NULL,NULL,'2019-02-11 00:00:00-08',NULL,NULL,421853,5781808,10,NULL,NULL,'ORANGE','ORANGE  ',NULL,NULL,NULL,NULL,NULL,'Adult','#4C7300','Mortality file May 9, 2019 - TESTING?','2020-12-31 00:00:00-08',NULL,NULL,384706,5762456,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'18-13139','Cougar had fed on carcass for some time, but unable to determine if it was predation or scavenging due to most of the carcass being eaten and fresh snow obscuring tracks. ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('e535b48a-2773-4eec-b7ef-7746a6f67f92','299a59f6-f5fb-4133-8b0c-9ed12f5070e5','56','Alive',NULL,NULL,NULL,'2019-02-15 00:00:00-08',NULL,NULL,365146,5788168,10,NULL,NULL,'PURPLE','BLUE',NULL,NULL,NULL,NULL,NULL,'Adult','#55FF00','Mortality file May 9, 2019 - TESTING?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'18-13126',' last fix 2021-02-09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('6ff3eb3d-e756-4c3a-a0f9-32079013b5b3','45267984-9dd1-4835-80a5-f1db1da0f37c','63','Mortality',NULL,NULL,NULL,'2019-02-08 00:00:00-08',NULL,NULL,368433,5785809,10,NULL,NULL,'BLACK ','BLACK',NULL,NULL,NULL,'No',NULL,'Adult','#73FFDF','Mortality file May 9, 2019 - TESTING?','2021-06-02 00:00:00-07',NULL,NULL,361630,5847481,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13135',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('c9ca97ad-bd90-4fc6-ada9-136468b9709b','7f78b209-7796-4523-abf0-8757bce6a586','64','Unknown',NULL,NULL,NULL,'2019-02-05 00:00:00-08',NULL,NULL,394237,5794983,10,NULL,NULL,'YELLOW','YELLOW',NULL,NULL,NULL,'No',NULL,'Adult','#73004C','Mortality file May 9, 2019 - TESTING?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13132',' Last fix 2020-03-11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('b4718b72-d5b1-4aa4-b1b3-fa862dbd4ed8','814c7679-511d-4fa7-8bdf-e00ed199abae',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-03 00:00:00-08',59.56413,-130.62959,407782,6598433,9,NULL,NULL,'None','3798',NULL,NULL,NULL,'No',NULL,'Adult','#4CE600','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2186','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-10 02:00:49.342058-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('5526eae6-2203-40dc-b458-fa99f7e3c670','b99dcb7f-c1ea-4743-acb0-e73b2adced5e','65','Mortality',NULL,NULL,NULL,'2019-02-05 00:00:00-08',NULL,NULL,383477,5794705,10,NULL,NULL,'BLUE','WHITE',NULL,NULL,NULL,'No',NULL,'Adult','#FFFFBE','Mortality file Jun 12, 2019','2019-06-12 00:00:00-07',NULL,NULL,370635,5856921,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13903','Collared wolves in Itcha Pack near caribou at 8:30 am, got mortality signal at 12:50 pm',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('818ceccb-0351-4d38-8d9c-3be61a66c690','4ea29bfb-9249-4e61-ba36-ea243d16182b','','Unknown',NULL,NULL,NULL,'2016-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#FFD37F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7937',' No status field provided.  ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('4012087a-6fa0-4c0e-bcf5-0fd0cdda5b4f','d7ffaba0-621a-4ed4-a6ef-e6b0de25f115','','Unknown',NULL,NULL,NULL,'2016-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#FFBEBE','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7949','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('ce31b26a-243b-4378-91c5-1f0733441162','c6932aaa-3d1b-43fa-a884-f08b7fd76de4','71','Mortality',NULL,NULL,NULL,'2020-02-07 00:00:00-08',52.19899,-125.04158,360474,5785135,10,NULL,NULL,'green',' blue',NULL,NULL,NULL,NULL,NULL,'Adult','#E9FFBE','','2020-04-27 00:00:00-07',NULL,NULL,397180,5829558,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-1379','Mortality came through night of April 27th. Unable to investigate. No road access (washouts from flooding) and no helicopter approvals (COVID restrictions). When we collected the collar the site had b',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('b66e9153-de22-4b07-b9d8-a7315ab73e0c','e0f06416-e7c1-46fc-afb4-1b42109976b1','72','Mortality',NULL,NULL,NULL,'2020-02-15 00:00:00-08',52.14102,-124.93627,367498,5778491,10,NULL,NULL,'blue','green',NULL,NULL,NULL,'No',NULL,'Adult','#E9FFBE','','2020-04-13 00:00:00-07',NULL,NULL,409157,5778078,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-3362','Caribou was killed by a predator and definetly fed on by wolves. Unknown whether killed by wolves or cougar. No predator scat was found at the site. ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('5c1bad57-7f3d-4d26-a135-18f5e78c7834','79107446-eeb5-45cb-9ac9-a10bec9b33ab','SKRATALR0048','Potential Mortality',NULL,NULL,NULL,'2022-03-13 00:00:00-08',NULL,NULL,484468,6578660,9,NULL,NULL,'','00-4311',NULL,NULL,NULL,'No',NULL,'Adult','#73FFDF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'21-2148','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-17 02:02:30.263542-07',NULL,'2022-07-21 09:04:26.807392-07',0,NULL),
	 ('e481c7fa-5e40-4331-8d7c-10cb7e821fac','1685a576-39d7-4bac-8873-a5a9c731d62b','76','Mortality',NULL,NULL,NULL,'2020-02-12 00:00:00-08',52.10563,-124.46632,399576,5773801,10,NULL,NULL,'green','orange',NULL,NULL,NULL,'No',NULL,'Adult','#73DFFF','','2021-05-13 00:00:00-07',NULL,NULL,393345,5825943,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-3368','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('59fecfb0-0a0d-4400-b596-546865285bcc','ed4e4564-fea8-4ed7-98f7-581210bb712c','78','Unknown',NULL,NULL,NULL,'2020-02-07 00:00:00-08',52.19782,-125.04883,359975,5785019,10,NULL,NULL,'green','green',NULL,NULL,NULL,'No',NULL,'Adult','#D1FF73','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-1381','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('4bc23d12-da38-4ff0-bd0c-3ae3d6a9d7b8','fd659eae-2996-4824-aa96-341f795a2430','79','Mortality',NULL,NULL,NULL,'2020-02-12 00:00:00-08',52.20296,-125.04686,360126,5785587,10,NULL,NULL,'red','white',NULL,NULL,NULL,'No',NULL,'Adult','#A87000','','2021-05-06 00:00:00-07',NULL,NULL,366659,5862105,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-1383','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('ba9e6a8b-5b58-44b5-b6d3-0b5fb0029f90','e7712713-dbe9-48fa-bdb3-006ed7cfd1a2','103','Alive',NULL,NULL,NULL,'2021-02-16 00:00:00-08',52.1077,-124.74811,380284,5774458,10,NULL,NULL,'None','Yellow 0-3881',NULL,NULL,NULL,'No',NULL,'Adult','#002673','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1410','8-04-2021 collar timed dropoff',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('fbf49452-c2ac-4a6b-969e-23314488908a','4995d072-8cbc-47bd-9472-2c1af0bb0490','TWC1067','Potential Mortality',NULL,NULL,NULL,'2021-03-02 00:00:00-08',53.2042,-126.15951,689704,5898753,9,NULL,NULL,'0-3741','None',NULL,NULL,NULL,'Unknown',NULL,'Adult','#E600A9','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1358','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-26 02:02:06.341633-07',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('f91ae2d3-4f5b-4502-aceb-264351709695','06047d42-44f1-4e9b-a685-284899573aa5','83','Alive',NULL,NULL,NULL,'2021-02-11 00:00:00-08',52.20673,-124.92596,368398,5785780,10,NULL,NULL,'Orange','White',NULL,NULL,NULL,NULL,NULL,'Adult','#00FFC5','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1391','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('e801a45f-c205-4c1f-890c-c6112c5e963b','40462e3d-c7c5-4cc4-b2d2-65d5a7bbd316','104','Mortality',NULL,NULL,NULL,'2021-02-16 00:00:00-08',52.100691,-124.74998,380137,5773692,10,NULL,NULL,'Purple','White',NULL,NULL,NULL,'Yes',NULL,'Adult','#AAFF00','','2021-03-24 00:00:00-07',NULL,NULL,380805,5774552,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1415','Carcass was cached with hair sheared off. Cougar tracks at site.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('b25d32f3-a45b-4db4-9d20-ac4597baa80c','55082587-3101-4423-9d52-3b966c7db930','TWC1082','Potential Mortality',NULL,NULL,NULL,'2022-02-03 00:00:00-08',53.31782,-126.17926,NULL,NULL,NULL,NULL,NULL,'','00-4221',NULL,NULL,NULL,'Unknown',NULL,'Adult','#004DA8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'21-2165','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-04 12:32:59.819827-07',NULL,'2022-07-21 09:04:26.807392-07',0,NULL),
	 ('af69aefd-1489-4c3a-98e3-71eb028a2159','3e0ff1f9-7b9a-439a-9bed-5f52b00126b6',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-03 00:00:00-08',59.56482,-130.51514,414386,6603924,9,NULL,NULL,'3790','None',NULL,NULL,NULL,'No',NULL,'Adult','#4C0073','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2178','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-10 02:00:52.386597-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('9ed42a0a-9c65-4d31-9ef9-8ad2788d290a','6fa9f253-8450-4a8b-b30d-2cc010c40bd8',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-05 00:00:00-08',60.24117,-129.23689,486883,6678294,9,NULL,NULL,'None','3824',NULL,NULL,NULL,'Yes',NULL,'Adult','#4C7300','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2192','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-10 02:01:00.911129-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('0e605033-9b20-44bf-95c1-c5f3864c72b9','00bff3b1-5495-4689-89be-e789687b1a8f',NULL,'Alive',NULL,NULL,'BorealCaribou','2022-01-22 00:00:00-08',59.38953,-121.97682,NULL,NULL,NULL,NULL,NULL,NULL,'0-4570',NULL,'Yellow',NULL,NULL,NULL,NULL,'#BEFFE8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Snake-Sahtaneh',NULL,'Peace',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',NULL,'21-2249',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-01-25 17:52:02.23611-08',NULL,'2023-01-25 17:52:02.23611-08',88,88);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('892e7a45-47f0-486b-a8f4-b2d716e6c983','8f2ec35f-f589-49c6-bad3-5f1d6824a43b','91','Mortality',NULL,NULL,NULL,'2021-02-14 00:00:00-08',52.19099,-124.88839,370919,5783962,10,NULL,NULL,'Black ','White',NULL,NULL,NULL,NULL,NULL,'Adult','#DF73FF','','2021-05-01 00:00:00-07',NULL,NULL,360024,5802248,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1405','Blood spray. Older wolf tracks at site',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('b21e2841-1502-4ca4-82bf-524b29d1122e','0a5efd8b-ebc7-4b3d-b9b4-65d7d6df16ad','107','Mortality',NULL,NULL,NULL,'2021-02-17 00:00:00-08',52.19315,-124.8994,370173,5784222,10,NULL,NULL,'None','None',NULL,NULL,NULL,'No',NULL,'Adult','#E600A9','','2021-07-20 00:00:00-07',NULL,NULL,408177,5826948,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-3386','No helicopters available for retriveal because of high fire activity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('e1a66520-9fdc-41c8-ad04-8ee5ade25513','2e5ac99d-f2ae-4dd7-a173-87575b8baeb1','89','Mortality',NULL,NULL,NULL,'2021-02-14 00:00:00-08',52.11323,-124.7693,378848,5775109,10,NULL,NULL,'None','Yellow 0-3903',NULL,NULL,NULL,NULL,NULL,'Adult','#C500FF','','2021-06-22 00:00:00-07',NULL,NULL,362322,5839267,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1432','June caribou survey crew (Shane White',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('4c646192-1338-42fd-95f6-32e1cd5e6316','9217756a-aba3-4074-9961-512f45d7d07c','88','Mortality',NULL,NULL,NULL,'2021-02-14 00:00:00-08',52.08602,-124.85796,372700,5772234,10,NULL,NULL,'None','Yellow 0-3887',NULL,NULL,NULL,NULL,NULL,'Adult','#D1FF73','','2021-06-14 00:00:00-07',NULL,NULL,332866,5758055,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1416','Mortality in the Charlotte Alplands',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('12ef22f4-93ca-4f22-a652-e306ba0ba8c9','dea83d77-fb6d-4d0f-ad12-92a192ac9bb4',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-03 00:00:00-08',59.57253,130.61699,409048,6604908,9,NULL,NULL,'None','3800',NULL,NULL,NULL,'Unknown',NULL,'Subadult','#4C7300','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2188','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-09-23 02:00:58.33492-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('f0419f13-f2f0-462f-9805-f207eb39394d','44342534-39e5-4bcc-aaee-a8c8652dd346','81','Mortality',NULL,NULL,NULL,'2021-02-09 00:00:00-08',52.08062,-124.83221,374449,5771589,10,NULL,NULL,'None','None',NULL,NULL,NULL,NULL,NULL,'Adult','#4CE600','','2021-05-08 00:00:00-07',NULL,NULL,395340,5821967,10,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1428','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('e7d771cc-7365-48f5-9dd0-629c1a5a03e1','ed723ee9-037a-4258-948b-9fda1c6d87d2','35','Unknown',NULL,NULL,NULL,'2021-02-13 00:00:00-08',NULL,NULL,412218,5884253,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#0084A8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Grey Wolf',false,'20-1438','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('54ef0caa-790f-42a3-834d-142db6b3b50e','fdeecef2-ad11-47f7-954e-1c99f100e42f','42',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#A8A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Grey Wolf',false,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('2e03112e-03bc-44ba-8856-7232cb3ee2f6','92370b97-e4ef-40a9-a433-dab907ff1275','41',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#A3FF73','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Grey Wolf',false,NULL,'tested, not delpoyed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('a14bf816-05d6-41ad-a381-8f626374c1d6','bb1109f5-5336-4b95-ac5e-c0272f28ff1f','37',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#38A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Grey Wolf',false,NULL,'tested, not delpoyed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('0a14917f-f816-4578-80bc-43d95d8c60a4','1a5ce799-6141-4589-bb95-ee2e06062579','47',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#0082FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Grey Wolf',false,NULL,'tested, not delpoyed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('258d8e66-a66e-4cca-b9ac-e79c9ad8b379','f73df0d2-84a9-4cf7-aba4-8740a5611561','39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#E9FFBE','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Grey Wolf',false,NULL,'tested, not delpoyed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-22 09:41:46.628691-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('ef93f814-77b3-434a-9502-70c26bf7d6b9','7dd0d331-c816-4d56-9901-4e22951fdf55','TWC1076','Potential Mortality',NULL,NULL,NULL,'2022-01-29 00:00:00-08',53.27703,-125.26196,NULL,NULL,NULL,NULL,NULL,'','00-4337',NULL,NULL,NULL,'No',NULL,'Adult','#38A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'21-2170','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-04 12:32:59.824871-07',NULL,'2022-07-21 09:04:26.807392-07',0,NULL),
	 ('43201d4d-f16f-4f8e-8413-dde5d4a195e6','5667123c-f988-48c8-ad90-b84adadae376','94','Mortality',NULL,NULL,NULL,'2018-03-25 00:00:00-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'04yellow','04red',NULL,NULL,NULL,'No',NULL,'Adult','#005CE6','','2021-12-01 02:00:00-08',NULL,NULL,374622,5700314,11,NULL,NULL,'Columbia North',false,'Kootenay',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10533',' ',NULL,NULL,false,NULL,NULL,NULL,NULL,NULL,'Field','2022-08-10 08:41:08.5392-07',NULL,'2021-12-06 14:42:02.213038-08',0,NULL),
	 ('5e967921-1968-44f1-a3fd-5d95adf5b6fa','02007f29-8d54-4eac-bfa6-cebedbbcb0ba','75','Potential Mortality',NULL,NULL,NULL,'2020-02-12 00:00:00-08',52.09903,-125.04097,360516,5785139,10,NULL,NULL,'green','black',NULL,NULL,NULL,'No',NULL,'Adult','#004DA8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-1380','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-14 02:02:01.162957-07',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('2d02ba3c-027d-4964-8893-353070d2d52a','d1fba3ba-3cb9-43b3-9e17-f6485c074273','TWC1040','Unknown',NULL,NULL,NULL,'2019-02-05 00:00:00-08',53.29451,-125.24726,350225,5907389,9,NULL,NULL,'0-1065','Yellow (0-1065)',NULL,NULL,NULL,'Yes',NULL,'Adult','#002673','Email alert 03-Jan-19, mortality file Jan 9, 2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13304','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('f4208d6e-2572-42f0-8c05-5fc7856345c5','f713a942-5200-4230-9a8f-00dd97a9788c','TWC1039','Mortality',NULL,NULL,NULL,'2019-01-18 00:00:00-08',NULL,NULL,687898,5943523,9,NULL,NULL,'None','Yellow (0-1560)',NULL,NULL,NULL,'No',NULL,'Subadult','#00A884','Email alert 03-Jan-19, mortality file Jan 9, 2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13306','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('a0ae699e-88e9-42b3-9334-21e206a81495','d71011c7-7077-4174-a69d-b00264d47699','','Unknown',NULL,NULL,NULL,'2016-02-08 00:00:00-08',55.936633,-124.393817,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#00734C','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7955','No status field provided.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('88be15fa-e771-44fc-9c63-c8198549f060','229f1b41-5b34-4981-8c0c-cfe8d59d2c3b','','Unknown',NULL,NULL,NULL,'2016-02-08 00:00:00-08',55.936633,-124.393733,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#00A884','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7953','unknown status.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('d84d5192-5cc1-4fad-a619-cd76597b7164','b7800c09-1138-48d1-baae-c05010422c8f','','Unknown',NULL,NULL,NULL,'2016-02-08 00:00:00-08',55.789333,-126.02075,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#737300','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7936','No status field provided.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('13dec3e6-3149-4be8-9e9f-255c04638f48','2621bb11-4d8d-48e1-83b0-c941c839d69e','58','Unknown',NULL,NULL,NULL,'2019-02-04 00:00:00-08',NULL,NULL,383419,5790058,10,NULL,NULL,'BLACK ','RED',NULL,NULL,NULL,'No',NULL,'Adult','#A87000','Mortality file May 9, 2019 - TESTING?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Itcha-Ilgachuz',false,'Cariboo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13138',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-11 01:00:27.691445-08',NULL,'2021-11-22 09:41:46.628691-08',0,NULL),
	 ('cd71e3fe-840f-40b6-8a92-f8c25f1e37f5','f8f11fe8-d1e7-4e4a-bf8c-96e1bf632a00',NULL,'Alive',NULL,NULL,'BorealCaribou','2022-01-22 00:00:00-08',59.6133,-122.10102,NULL,NULL,NULL,NULL,NULL,NULL,'0-4583',NULL,'Yellow',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Maxhamish',NULL,'Peace',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',NULL,'21-2262',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-01-25 17:52:02.23611-08',NULL,'2023-01-25 17:52:02.23611-08',88,88),
	 ('7499e6e9-f382-4482-afd0-f60618fc2942','aab949e3-2cd2-40de-895a-879123af8a29','TWC1023','Unknown',NULL,NULL,NULL,'2019-01-17 00:00:00-08',NULL,NULL,347594,5902034,9,NULL,NULL,'None','Yellow (0-1623)',NULL,NULL,NULL,'No',NULL,'Adult','#00C5FF','Email alert Dec  22/26, 2019, 04-Jan-19, and mortality file Jan 9, 2019.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13308','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('d88531d7-b1d8-4c4f-86b7-591363750dad','de10252f-8dfd-499e-b3c9-5a3c3b4d7070','TWC1018','Alive',NULL,NULL,NULL,'2019-01-18 00:00:00-08',NULL,NULL,696574,5937014,9,NULL,NULL,'0-244','Yellow (0-244)',NULL,NULL,NULL,'No',NULL,'Adult','#00E6A9','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13862','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('5223d7a3-1df2-4fe1-9342-84a1c8456b0d','63c50d40-a708-4c06-812c-762651e3e146','TWC1025','Unknown',NULL,NULL,NULL,'2019-01-16 00:00:00-08',NULL,NULL,307434,5909405,9,NULL,NULL,'0-1556','Yellow (0-1556)',NULL,NULL,NULL,'No',NULL,'Adult','#0082FF','Email alert 02-Jan-19, 03-Jan-19, and mortality file Jan 9, 2019',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'18-13309','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('874766e4-849d-458c-be51-ee454c07a762','ca7f6116-24d5-4a4c-a81b-29e628c421b3','TWC1049','Unknown',NULL,NULL,NULL,'2018-02-27 00:00:00-08',53.2563,-125.32925,NULL,NULL,NULL,NULL,NULL,'Yellow (0-1902)','',NULL,NULL,NULL,'No',NULL,'Adult','#55FF00','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10825',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('e6f7871c-4823-4e59-b947-dbcf83339159','66a6a2c0-ca6a-40ad-9cd2-72c139f5c0ab','TWC1031','Mortality',NULL,NULL,NULL,'2018-02-28 00:00:00-08',53.19033,-125.64546,NULL,NULL,NULL,NULL,NULL,'','Yellow (0-1904)',NULL,NULL,NULL,NULL,NULL,'Adult','#732600','','2020-04-12 00:00:00-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',true,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10823',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('49aaec31-009b-49ae-9d0b-cb0638089a59','9f805a47-d648-4d8d-a835-e9a2ff8c9eb0','','Unknown',NULL,NULL,NULL,'2016-02-09 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#00A884','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7962','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('b9c82866-5ca6-4475-bf76-5256b9f47b66','ef02198e-b41f-4d49-97ce-0316c5fe1eb7','TWC1051','Mortality',NULL,NULL,NULL,'2018-02-28 00:00:00-08',53.54963,-126.01335,697854,5937565,9,NULL,NULL,'','Yellow (0-1912)',NULL,NULL,NULL,'No',NULL,'Adult','#AAFF00','Unconfirmed - apparent calving related mortality. Mortality file 9-Jan-19 (testing in Smithers)','2018-06-03 00:00:00-07',NULL,NULL,652493,5950816,9,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10822','Unconfirmed - apparent calving related mortality, collar in office. Collar in same location June 2018 to Sept 2018 - Mort that was not picked up immediately.  Jan 2019 location in Smithers office.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('220d9506-0b5a-4f42-a70e-1000dd11c882','347d9094-5f8b-4969-95bf-ce7f35cb51ea','TWC1035','Unknown',NULL,NULL,NULL,'2017-02-16 00:00:00-08',53.08667,-125.38942,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#FFD37F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'16-8925','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('90159364-2296-4a93-b901-7b6d1c2b7c78','b7dde1dc-3bac-4c32-a881-e5a49fe90c7f','','Unknown',NULL,NULL,NULL,'2016-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#A87000','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7951','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('d247071f-2aea-495b-bc28-fd96322bc73e','b2b44e1f-abb9-4c9b-8488-4b9109fa2660','TWC1037','Unknown',NULL,NULL,NULL,'2017-02-16 00:00:00-08',53.51379,-125.94595,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#73FFDF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'16-8945','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('5a5161d9-1dbc-410b-9e92-6e0cb474671b','0c2193cc-5379-4cf8-a590-76ab0960357d','TWC1028','Mortality',NULL,NULL,NULL,'2016-02-16 00:00:00-08',53.28113,-125.8576,309496,5907354,10,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#004C73','Possible predation - grizzly. Collar still transmitting after field collection - No mortalities. Mortality file 14-Nov-18. Mortality file downloaded Nov 14, 2018, Jun 13, 2019.','2018-05-14 00:00:00-07',53.25283,-125.87799,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'16-7976','Possible predation - grizzly, retrieved - collar in office',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('aa3ac68e-1201-47d5-8b98-5356de345bfe','311f2180-9f00-4d6c-9469-dce6d3498ade','TWC1029','Mortality',NULL,NULL,NULL,'2016-02-16 00:00:00-08',53.28235,-125.87271,308494,5907530,10,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#D3FFBE','unknown. MORTALITY - spatial review, collar retrived from field 23/05/2018 (to Smithers/Prince George) but still transmitting. Mortality file 14-Nov-18. Mortality files received Oct 25, Nov 14, 2018.','2018-05-05 00:00:00-07',53.1661072,-125.72459,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'16-7967','Unknown cause of death, retrieved - collar in office',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('b2e3e471-7589-4980-b372-6708f107fc74','65f21217-ce09-47dd-ae2a-429915f79c29','TWC1001','Mortality',NULL,NULL,NULL,'2014-10-23 00:00:00-07',53.43367,-126.43367,670480,5923582,9,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Subadult','#A3FF73','Accident - puncture in side of body. ','2018-02-16 00:00:00-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'0',' Accident - puncture in side of body, collar in office.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('7a5a7314-869d-4746-a5a0-d114bdc20370','5da413e4-ea8e-4de0-a73d-787d4b77dfd4','TWC1012','Unknown',NULL,NULL,NULL,'2015-01-20 00:00:00-08',53.06717,-125.81333,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,'Adult','#FFD37F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Caribou',false,'0',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('15d57bca-7195-413f-93b7-b4c451671775','8d7438b9-4f8e-441c-a138-1b6a24c92133','TWC1015','Unknown',NULL,NULL,NULL,'2015-01-26 00:00:00-08',53.08247,-125.77644,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,'Yes',NULL,'Adult','#FF7F7F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'0',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('275ef6e8-c6d6-47e3-b39b-a54a2dc60306','16995e6c-ba03-4060-9f0c-51fe8b0e23ab','TWC1014','Unknown',NULL,NULL,NULL,'2015-01-22 00:00:00-08',53.09771,-125.72746,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#73FFDF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'0',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('5c8c837e-6add-4269-839c-a57a761aad09','2c3a1e91-0dd2-4b12-8431-07a054084ccf','TWC1016','Unknown',NULL,NULL,NULL,'2015-01-22 00:00:00-08',53.0264,-125.69066,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#00C5FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'0',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('66047565-28aa-44e8-be1f-a5cb0ddeb7f5','88ca0f07-3e99-4986-8edf-f02b842a0eaf','TWC1062','Potential Mortality',NULL,NULL,NULL,'2021-02-18 00:00:00-08',54.7778,-127.17318,689488,5897153,9,NULL,NULL,'0-3738','None',NULL,NULL,NULL,'No',NULL,'Juvenile','#8400A8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-1355','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-31 02:02:04.144611-07',NULL,'2021-11-24 10:17:28.539491-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('42c2c01a-be75-4d99-a691-ff6441dbe119','575cad68-654f-4454-be77-db385c1eb35b','22564','Mortality',NULL,NULL,NULL,'2017-03-17 00:00:00-07',NULL,NULL,481742,5599294,11,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#E600A9','grizzly','2022-07-05 20:12:00-07',NULL,NULL,486305,5607622,11,'Predation Probable',NULL,'Central Selkirks',false,'Kootenay',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'99-0005','',NULL,NULL,false,NULL,NULL,NULL,NULL,true,'Field','2022-08-10 08:43:20.306335-07',NULL,'2021-12-06 14:42:02.213038-08',0,NULL),
	 ('a106f358-99b8-4cf7-9eac-ab8a5c1b97a5','19e15405-e6f8-4856-b872-92cbd7c0b58e','TWC1034','Mortality',NULL,NULL,NULL,'2017-02-14 00:00:00-08',53.45048,-125.88009,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#C500FF','','2020-06-09 00:00:00-07',53.43567,-127.09914,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'16-8922',' ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('869bbfdb-8d8c-4c81-95d7-f67ed51cbe27','60c764aa-14fe-4169-8074-f39162de95e4','','Unknown',NULL,NULL,NULL,'2016-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#C500FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7963','No status field provided.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('b393838a-0ceb-4acf-8efc-c0262db35c17','285a2ab1-af29-43be-b2f8-ea0094b5f4dd',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-03 00:00:00-08',60.15149,-129.17181,490461,6668295,9,NULL,NULL,'None','None',NULL,NULL,NULL,'No',NULL,NULL,'#00734C','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2187','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-12 02:00:57.19522-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('cd3e9c00-9505-4184-8a8d-c032ef37de48','2e226f29-1033-465d-9f6d-2b4c5a18e637','TWC1060','Mortality',NULL,NULL,NULL,'2020-02-14 00:00:00-08',53.22144,-126.74859,650308,5899270,9,NULL,NULL,'None','Yellow (0-2600)',NULL,NULL,NULL,'Yes',NULL,'Adult','#002673','','2021-03-20 00:00:00-07',53.20414,-126.16723,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-1593','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('ee4a7d05-6fac-473b-be18-da3283abdc59','5e6a442e-cb55-40b0-966d-220af2f087db','00-4565','Alive',NULL,NULL,'Collar 87134 originally deployed in Frog, mort due to predation; redeployed in Graham','2022-03-08 00:00:00-08',56.91144,-123.12528,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#4C0073',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Graham',NULL,'Peace',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',NULL,'21-2244',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-02-24 16:50:12.82377-08',NULL,'2023-02-24 16:50:12.82377-08',88,88),
	 ('e3b35b46-2744-458a-9792-215a6c3588cc','5c093cbe-5554-41e4-90cd-7e2c42a921c9',NULL,'Alive',NULL,NULL,'BorealCaribou','2022-01-24 00:00:00-08',59.8219,-122.2435,NULL,NULL,NULL,NULL,NULL,NULL,'0-4581',NULL,'Yellow',NULL,NULL,NULL,NULL,'#BEFFE8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Maxhamish',NULL,'Peace',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',NULL,'21-2260',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-01-25 17:52:02.23611-08',NULL,'2023-01-25 17:52:02.23611-08',88,88),
	 ('4a108879-59c0-4167-b687-d2b8903fd2ad','6fbc629e-9503-4ce7-950b-098702c8078e','TWC1041','Mortality',NULL,NULL,NULL,'2020-03-07 00:00:00-08',53.9684,-126.00465,302048,5943228,10,NULL,NULL,'None','Yellow 0-2064',NULL,NULL,NULL,'Unknown',NULL,'Adult','#005CE6','','2021-03-14 00:00:00-08',53.611524,-126.160164,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-1584','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('05b4a0d7-e31b-49d0-a34d-9a39d7556d00','d64a0b88-1e37-4aa1-aa36-d353d462c620','TWW1032','Mortality',NULL,NULL,NULL,'2021-02-22 00:00:00-08',53.49627,-125.71049,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#98E600','','2021-03-13 00:00:00-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Grey Wolf',false,'20-1374','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('f53106ef-df3d-4c34-84e2-744b87adf37d','bfb5b504-0d3c-4363-8b3d-aa0d332e8036','TWC1077','Potential Mortality',NULL,NULL,NULL,'2022-01-31 00:00:00-08',53.7413,-126.4793,NULL,NULL,NULL,NULL,NULL,'','00-4329',NULL,NULL,NULL,'Unknown',NULL,'Subadult','#73B2FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'21-2162','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-04 12:32:59.822504-07',NULL,'2022-07-21 09:04:26.807392-07',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('139c1e72-0986-473d-8b85-f64722d25760','3bb0d937-fbc8-4981-b197-68f703464f65',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-04 00:00:00-08',60.15604,-129.37286,479301,6668848,9,NULL,NULL,'3788','None',NULL,NULL,NULL,'Yes',NULL,'Adult','#55FF00','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2176','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-11 02:01:06.91541-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('69764d05-835b-4cb4-bdbf-676051cf17c9','48bab0d8-8cc7-4f3d-aadf-1351318d2d73','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#267300','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Grey Wolf',false,'0','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('c6b0a6c7-71ca-421a-96d6-1878fec07b05','b9b1c4c4-99db-4acb-bd3b-069ad77ccf05','TWC1031','Unknown',NULL,NULL,NULL,'2016-02-16 00:00:00-08',53.25546,-125.89957,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,'No',NULL,'Adult','#FF7F7F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'16-7975','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-24 10:17:28.539491-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('d22efa1d-971f-48cf-9643-dc1431c4dcd7','59729d69-ffd9-409c-b2e5-70f7242a7a16','','Unknown',NULL,NULL,NULL,'2017-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#00C5FF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-8916','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('3e4c8346-7c30-4426-8521-96a5b8453635','253e442d-8add-46de-944b-22d8df1fac21','TWC1048','Unknown',NULL,NULL,NULL,'2020-03-17 00:00:00-07',53.60867,-126.02917,696531,5944109,9,NULL,NULL,'None','Yellow',NULL,NULL,NULL,'Unknown',NULL,'Adult','#FFA77F','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'19-1585','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-25 17:00:36.811717-08',NULL,'2021-11-24 10:17:28.539491-08',0,NULL),
	 ('8fa2d657-fd82-4930-a38f-a95374bd9bc4','278c0fec-cc52-4765-8b7f-6438192c108c','','Unknown',NULL,NULL,NULL,'2016-02-11 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#38A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7959','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('d9a04d94-a21f-4e33-8ae7-a97dcda61262','51adf574-09d3-4569-a941-effb3143df9d','','Unknown',NULL,NULL,NULL,'2016-02-10 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#00FFC5','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-7956','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('bdc9d48d-ed5e-4bfe-863c-16dbad8aaa06','285902d5-bdce-408f-a7dd-7fb3eebb0f54','','Unknown',NULL,NULL,NULL,'2017-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#4C7300','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-8910','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('75529e7b-bae9-4b99-8f60-dfb4c2f1967e','94cd3c59-10be-4143-8441-feae68f5257a','','Unknown',NULL,NULL,NULL,'2017-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#732600','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-8909','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('798b852d-ee0c-47f9-9747-f035408b2cbf','0e116fbe-ee84-434a-a4ad-b27c218b9bbd','','Unknown',NULL,NULL,NULL,'2017-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#FFBEE8','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-8912','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL);
INSERT INTO bctw.animal (critter_id,critter_transaction_id,animal_id,animal_status,associated_animal_id,associated_animal_relationship,capture_comment,capture_date,capture_latitude,capture_longitude,capture_utm_easting,capture_utm_northing,capture_utm_zone,collective_unit,animal_colouration,ear_tag_left_id,ear_tag_right_id,ear_tag_left_colour,ear_tag_right_colour,estimated_age,juvenile_at_heel,juvenile_at_heel_count,life_stage,map_colour,mortality_comment,mortality_date,mortality_latitude,mortality_longitude,mortality_utm_easting,mortality_utm_northing,mortality_utm_zone,proximate_cause_of_death,ultimate_cause_of_death,population_unit,recapture_ind,region,release_comment,release_date,release_latitude,release_longitude,release_utm_easting,release_utm_northing,release_utm_zone,sex,species,translocation_ind,wlh_id,animal_comment,pcod_predator_species,ucod_predator_species,predator_known_ind,captivity_status_ind,mortality_captivity_status_ind,pcod_confidence,ucod_confidence,mortality_report_ind,mortality_investigation,valid_from,valid_to,created_at,created_by_user_id,owned_by_user_id) VALUES
	 ('a45704af-f21b-4bd3-96e8-4a5feaf3e8fa','ecebec10-d182-43e8-8aec-63276fcb1cec','','Unknown',NULL,NULL,NULL,'2017-02-08 00:00:00-08',NULL,NULL,NULL,NULL,10,NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,'#FFEBAF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Wolverine',false,'Omineca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Caribou',false,'16-8913','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('70c9826f-44dd-4eba-94e7-31fc98189212','04d8fbc4-5fc4-44a9-bcb7-409f22ca3efa','TC084','Unknown',NULL,NULL,NULL,'2018-03-28 00:00:00-07',53.60414,-126.02817,NULL,NULL,9,NULL,NULL,'Yellow01952','',NULL,NULL,NULL,'Yes',NULL,'Adult','#38A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Telkwa',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10808','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL),
	 ('9b747d66-3265-4943-b234-93cc1a1c8925','bf39ffb8-94cb-449e-ad2b-32d404d18797',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-03 00:00:00-08',59.56459,-130.6203,408444,6604038,9,NULL,NULL,'None','3825',NULL,NULL,NULL,'No',NULL,'Adult','#FF73DF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2193','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-11 02:01:07.275965-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('cefb3beb-2a44-47c0-a679-41e17796d2c4','14f656ad-9722-4416-b6f4-2ccf6f14dabc',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-05 00:00:00-08',60.12539,-129.10721,494043,6665381,9,NULL,NULL,'None','3801',NULL,NULL,NULL,'Yes',NULL,'Adult','#70A800','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2189','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-11 02:01:08.826443-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('a63c0afa-47c2-4688-b8a3-fc4463d0d14e','192e3510-f50c-460d-880e-c383af848e38',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-05 00:00:00-08',60.23693,-129.27389,484832,6677829,9,NULL,NULL,'None','None',NULL,NULL,NULL,'No',NULL,'Subadult','#737300','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2177','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-11 02:01:10.969804-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('eba2063b-b520-43be-9817-953e00373b39','c05085cd-1827-4098-bcb5-3e5aa64105e7',NULL,'Potential Mortality',NULL,NULL,NULL,'2020-11-04 00:00:00-08',59.4555,-130.77046,399637,6592110,9,NULL,NULL,'3823','None',NULL,NULL,NULL,'Yes',NULL,'Adult','#002673','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Little Rancheria',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'20-2191','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-12 02:00:58.915243-07',NULL,'2021-12-07 09:25:27.085851-08',0,NULL),
	 ('eb1e0491-9298-4c12-ba1a-5a75086ce7ea','5923444c-3a15-4104-9295-a69251ab7034','TWC1085','Potential Mortality',NULL,NULL,NULL,'2022-02-04 00:00:00-08',53.49793,-126.15743,NULL,NULL,NULL,NULL,NULL,'','00-4339',NULL,NULL,NULL,'No',NULL,'Adult','#737300','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Tweedsmuir',false,'Skeena',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'21-2172','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-08-04 12:32:59.824511-07',NULL,'2022-07-21 09:04:26.807392-07',0,NULL),
	 ('9d0c0b60-8366-437b-ba7c-e80b57564034','59988091-7db8-4035-828a-93ce7e9a7c02','GR18-05','Mortality',NULL,NULL,NULL,'2018-03-07 00:00:00-08',NULL,NULL,484084,6309645,10,NULL,NULL,'GREENwbluebutton015','None',NULL,NULL,NULL,'No',NULL,'Adult','#00734C','POTENTIAL MORTALITY - spatial review, collar in Ft St John after 04/04/2019. Email alert 9-Aug-18, 28-Mar, 03-Apr-19, and mortality file 9-Aug-18, 28-Mar, 03-Apr-19.','2019-03-28 00:00:00-07',NULL,NULL,484834,6305586,10,NULL,NULL,'Graham',false,'Peace',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','Caribou',false,'17-10426','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-11-30 12:59:37.065719-08',NULL,'2021-11-30 12:59:37.065719-08',0,NULL);




INSERT INTO critter (critter_id, taxon_id, wlh_id, animal_id, sex, responsible_region_nr_id, critter_comment)
WITH spatial AS (
SELECT region_nr_name, unit_name FROM lk_region_nr lrn JOIN lk_population_unit_temp lput 
ON (public.ST_Intersects(lput.unit_geom, lrn.region_geom) AND public.ST_Relate(lrn.region_geom, lput.unit_geom, '2********'))
),
single_units AS (
SELECT unit_name FROM spatial GROUP BY unit_name HAVING count(*) = 1
),
unit_mapping AS (
SELECT region_nr_name, spatial.unit_name FROM spatial JOIN single_units ON spatial.unit_name = single_units.unit_name
UNION ALL 
SELECT 'Northeast Natural Resource Region', 'Pink Mountain'
UNION ALL 
SELECT 'Northeast Natural Resource Region', 'Muskwa'
UNION ALL 
SELECT 'Northeast Natural Resource Region', 'Rabbit'
UNION ALL 
SELECT 'Northeast Natural Resource Region', 'Quintette'
UNION ALL 
SELECT 'Omineca Natural Resource Region', 'Frog'
UNION ALL
SELECT 'Omineca Natural Resource Region', 'Finlay'
UNION ALL
SELECT 'Omineca Natural Resource Region', 'Hart Ranges'
UNION ALL
SELECT 'Omineca Natural Resource Region', 'Gataga'
UNION ALL
SELECT 'Cariboo Natural Resource Region', 'Itcha-Ilgachuz'
UNION ALL
SELECT 'Thompson-Okanagan Natural Resource Region', 'Groundhog'
)
SELECT 
	critter_id,
	(SELECT taxon_id FROM lk_taxon WHERE taxon_name_common = species),
	wlh_id, 
	animal_id, 
	(CASE WHEN sex::text != ALL(enum_range(null::sex)::text[]) OR sex IS NULL THEN 'Unknown'::sex ELSE sex::sex END),
	(SELECT region_nr_id FROM lk_region_nr WHERE region_nr_name = um.region_nr_name),
	animal_comment
	FROM 
	bctw.animal a LEFT JOIN unit_mapping um ON a.population_unit = um.unit_name
WHERE valid_to IS NULL AND species IS NOT NULL;


/*
 * Inserts population units for BCTW animals into critter_collection_unit rows.
 */
INSERT INTO critter_collection_unit (critter_collection_unit_id, critter_id, collection_unit_id)
SELECT 
crypto.gen_random_uuid() AS critter_collection_unit_id,
critter_id, 
(SELECT collection_unit_id FROM xref_collection_unit xcu WHERE unit_name = population_unit)
FROM bctw.animal 
WHERE valid_to IS NULL AND population_unit IS NOT NULL AND population_unit NOT ILIKE '%wmu%';


/**
 * Converts mortality events from BCTW to critterbase mortality rows.
 * Skips animal rows if they have NULL mortality date.
 */

CREATE TEMP TABLE IF NOT EXISTS mortality_locations AS 
WITH tform AS (
SELECT critter_id, critter_transaction_id, public.st_transform(public.st_setsrid(public.st_makepoint(mortality_utm_easting, mortality_utm_northing), 32600 + mortality_utm_zone), 4326) AS stf  
FROM 
bctw.animal 
WHERE 
mortality_utm_easting IS NOT NULL AND 
mortality_utm_northing IS NOT NULL AND
mortality_utm_zone IS NOT NULL
),
coords AS (
	SELECT 
		(CASE WHEN mortality_latitude IS NULL THEN public.st_y(tform.stf) ELSE mortality_latitude END) AS latitude,
		(CASE WHEN mortality_longitude IS NULL THEN public.st_x(tform.stf) ELSE mortality_longitude END) AS longitude,
		a.critter_transaction_id
	FROM bctw.animal a LEFT JOIN tform ON a.critter_transaction_id = tform.critter_transaction_id
)
SELECT
	crypto.gen_random_uuid() AS location_id,
	critter_id,
	latitude,
	longitude,
	NULL::float8 as coordinate_uncertainty,
	NULL::coordinate_uncertainty_unit,
	(SELECT wmu_id FROM lk_wildlife_management_unit lwmu WHERE public.st_contains(wmu_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS wmu_id,
	(SELECT region_nr_id FROM lk_region_nr WHERE public.st_contains(region_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS region_nr_id,
	(SELECT region_env_id FROM lk_region_env WHERE public.st_contains(region_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS region_env_id
FROM 
	bctw.animal a JOIN coords t ON a.critter_transaction_id = t.critter_transaction_id
	 WHERE valid_to IS NULL AND mortality_date IS NOT NULL
	 AND num_nonnulls(mortality_latitude, mortality_longitude, mortality_utm_easting, mortality_utm_northing) > 0
;

INSERT INTO location (location_id, latitude, longitude, coordinate_uncertainty, "coordinate_uncertainty_unit", wmu_id, region_nr_id, region_env_id)
SELECT location_id, latitude, longitude, coordinate_uncertainty, "coordinate_uncertainty_unit", wmu_id, region_nr_id, region_env_id
FROM mortality_locations;

INSERT INTO mortality (mortality_id, critter_id, location_id, mortality_timestamp, 
proximate_cause_of_death_id, proximate_cause_of_death_confidence, proximate_predated_by_taxon_id,
ultimate_cause_of_death_id, ultimate_cause_of_death_confidence, ultimate_predated_by_taxon_id, mortality_comment)
SELECT
	crypto.gen_random_uuid() AS mortality_id,
	a.critter_id,
	(SELECT location_id FROM mortality_locations WHERE mortality_locations.critter_id = a.critter_id),
	mortality_date AS mortality_timestamp,
	(
		CASE WHEN proximate_cause_of_death IS NULL THEN 
			(SELECT cod_id FROM lk_cause_of_death WHERE cod_category = 'Unknown')
		ELSE
			(SELECT cod_id FROM lk_cause_of_death WHERE proximate_cause_of_death LIKE '%' || cod_category || '%')
		END
	) AS proximate_cause_of_death_id,
	pcod_confidence::cod_confidence AS proximate_cause_of_death_confidence,
	(SELECT taxon_id FROM lk_taxon WHERE taxon_name_common = pcod_predator_species) AS  proximate_predated_by_taxon_id,
	(SELECT cod_id FROM lk_cause_of_death WHERE ultimate_cause_of_death LIKE '%' || cod_category || '%') AS ultimate_cause_of_death_id,
	ucod_confidence::cod_confidence AS ultimate_cause_of_death_confidence,
	(SELECT taxon_id FROM lk_taxon WHERE taxon_name_common = ucod_predator_species) AS  ultimate_predated_by_taxon_id,
	mortality_comment
FROM 
	bctw.animal a  WHERE valid_to IS NULL AND mortality_date IS NOT NULL
;

/*
 * Converts capture related columns from BCTW to capture table entries in Critterbase.
 * We create these temporary tables so that we can include critter_id, making it easier to associate
 * locations with critters later.
 */
CREATE TEMP TABLE IF NOT EXISTS capture_locations AS
WITH tform AS (
	SELECT 
		critter_id, 
		critter_transaction_id, 
		public.st_transform(public.st_setsrid(public.st_makepoint(capture_utm_easting, capture_utm_northing), 32600 + capture_utm_zone), 4326) AS stf  
	FROM 
	bctw.animal 
	WHERE 
	capture_utm_easting  IS NOT NULL AND 
	capture_utm_northing  IS NOT NULL AND
	capture_utm_zone  IS NOT NULL
),
coords AS (
	SELECT 
		(CASE WHEN capture_latitude  IS NULL THEN public.st_y(tform.stf) ELSE capture_latitude  END) AS latitude,
		(CASE WHEN capture_longitude  IS NULL THEN public.st_x(tform.stf) ELSE capture_longitude  END) AS longitude,
		a.critter_transaction_id
	FROM bctw.animal a LEFT JOIN tform ON a.critter_transaction_id = tform.critter_transaction_id
)
SELECT 
crypto.gen_random_uuid() AS location_id,
a.critter_id,
latitude,
longitude,
NULL::float8 AS coordinate_uncertainty,
NULL::coordinate_uncertainty_unit AS coordinate_uncertainty_unit,
(SELECT wmu_id FROM lk_wildlife_management_unit lwmu WHERE public.st_contains(wmu_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS wmu_id,
(SELECT region_nr_id FROM lk_region_nr WHERE public.st_contains(region_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS region_nr_id,
(SELECT region_env_id FROM lk_region_env WHERE public.st_contains(region_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS region_env_id
FROM 
	bctw.animal a JOIN coords t ON a.critter_transaction_id = t.critter_transaction_id
WHERE valid_to IS NULL AND capture_date IS NOT NULL
AND num_nonnulls(capture_latitude, capture_longitude, capture_utm_easting, capture_utm_northing) > 0;


/*
* Special case where critters do not have capture information but do belong to a population unit.
* In this case we take the centroid of the herd boundary as capture coordinate and use the longest line between the centroid and a vertex of the polygon
* as the coordinate uncertainty.
*/
INSERT INTO capture_locations
WITH
longest_line AS (SELECT unit_name, public.st_Centroid(unit_geom) AS unit_center, public.st_LongestLine(unit_geom, public.st_Centroid(unit_geom)) AS linestring FROM lk_population_unit_temp),
pop_uncertainty AS (SELECT unit_name, unit_center, public.st_DistanceSphere(public.st_pointn(longest_line.linestring, 1), public.st_pointn(longest_line.linestring, 2)) AS uncertainty FROM longest_line)
SELECT 
crypto.gen_random_uuid() AS location_id,
a.critter_id, 
public.st_y(unit_center) AS latitude,
public.st_x(unit_center) AS longitude,
uncertainty AS coordinate_uncertainty,
'm' AS "coordinate_uncertainty_unit",
(SELECT wmu_id FROM lk_wildlife_management_unit lwmu WHERE public.st_contains(wmu_geom, public.st_setsrid(unit_center, 4326))) AS wmu_id,
(SELECT region_nr_id FROM lk_region_nr WHERE public.st_contains(region_geom, public.st_setsrid(unit_center, 4326))) AS region_nr_id,
(SELECT region_env_id FROM lk_region_env WHERE public.st_contains(region_geom, public.st_setsrid(unit_center, 4326))) AS region_env_id
FROM bctw.animal a LEFT JOIN pop_uncertainty p ON a.population_unit = p.unit_name
WHERE valid_to IS NULL AND 
num_nonnulls(a.capture_latitude, a.capture_longitude, a.capture_utm_easting, a.capture_utm_northing) = 0 AND 
a.population_unit IS NOT NULL AND 
a.capture_date IS NOT NULL;

INSERT INTO location (location_id, latitude, longitude, coordinate_uncertainty, coordinate_uncertainty_unit, wmu_id, region_nr_id, region_env_id)
SELECT location_id, latitude, longitude, coordinate_uncertainty, coordinate_uncertainty_unit, wmu_id, region_nr_id, region_env_id FROM capture_locations;

CREATE TEMP TABLE IF NOT EXISTS release_locations AS
WITH tform AS (
	SELECT 
		critter_id, 
		critter_transaction_id, 
		public.st_transform(public.st_setsrid(public.st_makepoint(release_utm_easting, release_utm_northing), 32600 + release_utm_zone), 4326) AS stf  
	FROM 
	bctw.animal 
	WHERE 
	release_utm_easting IS NOT NULL AND 
	release_utm_northing IS NOT NULL AND
	release_utm_zone IS NOT NULL
),
coords AS (
	SELECT 
		(CASE WHEN release_latitude IS NULL THEN public.st_y(tform.stf) ELSE release_latitude  END) AS latitude,
		(CASE WHEN release_longitude  IS NULL THEN public.st_x(tform.stf) ELSE release_longitude  END) AS longitude,
		a.critter_transaction_id
	FROM bctw.animal a LEFT JOIN tform ON a.critter_transaction_id = tform.critter_transaction_id
)
SELECT 
crypto.gen_random_uuid() AS location_id,
a.critter_id,
latitude,
longitude,
(SELECT wmu_id FROM lk_wildlife_management_unit lwmu WHERE public.st_contains(wmu_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS wmu_id,
(SELECT region_nr_id FROM lk_region_nr WHERE public.st_contains(region_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS region_nr_id,
(SELECT region_env_id FROM lk_region_env WHERE public.st_contains(region_geom, public.st_setsrid(public.st_makepoint(longitude, latitude ), 4326))) AS region_env_id
FROM 
	bctw.animal a JOIN coords t ON a.critter_transaction_id = t.critter_transaction_id
WHERE valid_to IS NULL AND release_date IS NOT NULL;

INSERT INTO location (location_id, latitude, longitude, wmu_id, region_nr_id, region_env_id)
SELECT location_id, latitude, longitude, wmu_id, region_nr_id, region_env_id FROM release_locations;

INSERT INTO capture (capture_id, critter_id, capture_location_id, release_location_id, capture_timestamp, release_timestamp, capture_comment, release_comment)
SELECT 
crypto.gen_random_uuid() AS capture_id,
a.critter_id,
(SELECT location_id FROM capture_locations WHERE capture_locations.critter_id = a.critter_id) AS capture_location_id,
(SELECT location_id FROM release_locations WHERE release_locations.critter_id = a.critter_id) AS release_location_id,
capture_date AS capture_timestamp,
release_date AS release_timestamp,
(CASE WHEN num_nonnulls(a.capture_latitude, a.capture_longitude, a.capture_utm_easting, a.capture_utm_northing) = 0 THEN 
	COALESCE(capture_comment, '') || '<Note: Real capture coordinates were missing from BCTW, this data is approximated.>'
ELSE
	capture_comment
END),
release_comment
FROM 
	bctw.animal a
WHERE valid_to IS NULL AND capture_date IS NOT NULL;

/*
 * Converts ear_tag_left_id column of BCTW to marking table entries in Critterbase.
 */
INSERT INTO marking (marking_id, critter_id, capture_id, mortality_id, taxon_marking_body_location_id, marking_type_id, marking_material_id, primary_colour_id, secondary_colour_id, identifier, attached_timestamp, comment)
WITH 
sec AS (
SELECT
		critter_transaction_id,
		(regexp_matches(ear_tag_left_id, '([a-zA-Z]+?)(w|WITH|with)([a-zA-Z]+?)(\d+?|button|button\d+?)'))[3] AS ear_tag_secondary
FROM bctw.animal
)
SELECT 
crypto.gen_random_uuid() AS marking_id,
critter_id, 
(SELECT capture_id FROM capture c WHERE a.critter_id = c.critter_id),
NULL::uuid AS mortality_id,
(SELECT taxon_marking_body_location_id FROM xref_taxon_marking_body_location WHERE body_location = 'Left Ear') AS taxon_marking_body_location_id,
(SELECT marking_type_id FROM lk_marking_type WHERE name = 'Ear Tag') AS marking_type_id,
(SELECT marking_material_id FROM lk_marking_material  WHERE material = 'Plastic') AS marking_material_id,
(SELECT colour_id FROM lk_colour WHERE  substring(a.ear_tag_left_id, '[a-zA-Z]+') ~* ('^' || colour)) AS primary_colour,
(SELECT colour_id FROM lk_colour WHERE  ear_tag_secondary ~* ('^' || colour)) AS secondary_colour,
(SELECT substring(a.ear_tag_left_id, '\d*-?\d+')) AS identifier,
(SELECT capture_date FROM bctw.animal a2 WHERE a.ear_tag_left_id = a2.ear_tag_left_id AND a.critter_id = a2.critter_id ORDER BY capture_date ASC LIMIT 1) AS attached_timestamp,
'Ported from BCTW, original data: < ' || a.ear_tag_left_id || ' >' AS comment
FROM 
bctw.animal a LEFT JOIN sec ON a.critter_transaction_id  = sec.critter_transaction_id
WHERE a.ear_tag_left_id IS NOT NULL AND a.ear_tag_left_id != '' AND a.ear_tag_left_id != 'None' AND a.ear_tag_left_id != 'NR' 
AND valid_to IS NULL;

/*
 * Converts ear_tag_right_id column of BCTW to marking table entries in Critterbase.
 */
INSERT INTO marking (marking_id, critter_id, capture_id, mortality_id, taxon_marking_body_location_id, marking_type_id, marking_material_id, primary_colour_id, secondary_colour_id, identifier, attached_timestamp, comment)
WITH 
sec AS (
SELECT
		critter_transaction_id,
		(regexp_matches(ear_tag_right_id, '([a-zA-Z]+?)(w|WITH|with)([a-zA-Z]+?)(\d+?|button|button\d+?)'))[3] AS ear_tag_secondary
FROM bctw.animal
)
SELECT 
crypto.gen_random_uuid() AS marking_id,
critter_id, 
(SELECT capture_id FROM capture c WHERE a.critter_id = c.critter_id),
NULL::uuid AS mortality_id,
(SELECT taxon_marking_body_location_id FROM xref_taxon_marking_body_location WHERE body_location = 'Right Ear') AS taxon_marking_body_location_id,
(SELECT marking_type_id FROM lk_marking_type WHERE name = 'Ear Tag') AS marking_type_id,
(SELECT marking_material_id FROM lk_marking_material  WHERE material = 'Plastic') AS marking_material_id,
(SELECT colour_id FROM lk_colour WHERE  substring(a.ear_tag_right_id, '[a-zA-Z]+') ~* ('^' || colour)) AS primary_colour,
(SELECT colour_id FROM lk_colour WHERE  ear_tag_secondary ~* ('^' || colour)) AS secondary_colour,
(SELECT substring(a.ear_tag_right_id, '\d*-?\d+')) AS identifier,
(SELECT capture_date FROM bctw.animal a2 WHERE a.ear_tag_right_id = a2.ear_tag_right_id AND a.critter_id = a2.critter_id ORDER BY capture_date ASC LIMIT 1) AS attachment_start,
'Ported from BCTW, original data: < ' || a.ear_tag_right_id || ' >' AS comment
FROM 
bctw.animal a LEFT JOIN sec ON a.critter_transaction_id  = sec.critter_transaction_id
WHERE a.ear_tag_right_id IS NOT NULL AND a.ear_tag_right_id != '' AND a.ear_tag_right_id != 'None' AND a.ear_tag_right_id != 'NR'
AND valid_to IS NULL;

/*
 * Converts BCTW juvenile_at_heel to a qualitative Yes/No measurement.
 * NULL and Unknown values are skipped.
 */
INSERT INTO measurement_qualitative (measurement_qualitative_id, critter_id, taxon_measurement_id, capture_id, mortality_id, qualitative_option_id, measurement_comment, measured_timestamp)
SELECT 
	crypto.gen_random_uuid() AS measurement_qualitative_id,
	critter_id,
	(SELECT taxon_measurement_id FROM xref_taxon_measurement_qualitative WHERE measurement_name = 'Juvenile at heel indicator') AS taxon_measurement_id,
	(SELECT capture_id FROM capture c WHERE a.critter_id = c.critter_id),
	NULL::uuid AS mortality_id,
	(CASE WHEN juvenile_at_heel = 'Yes' THEN 
		(SELECT qualitative_option_id FROM xref_taxon_measurement_qualitative_option WHERE option_label = 'True')
	ELSE
		(SELECT qualitative_option_id FROM xref_taxon_measurement_qualitative_option WHERE option_label = 'False')
	END) AS qualitative_option_id,
	'Ported from BCTW, original data: < ' || juvenile_at_heel || ' >' AS measurement_comment,
	NULL::timestamptz AS measured_timestamp
FROM bctw.animal a WHERE valid_to IS NULL AND juvenile_at_heel IS NOT NULL AND juvenile_at_heel != 'Unknown';

/*
 * Converts BCTW rows with juvenile_at_heel = No to a quantitative row with value 0
 */
INSERT INTO measurement_quantitative (measurement_quantitative_id, critter_id, taxon_measurement_id, capture_id, mortality_id, value, measurement_comment, measured_timestamp)
SELECT 
	crypto.gen_random_uuid() AS measurement_quantitative_id,
	critter_id,
	(SELECT taxon_measurement_id FROM xref_taxon_measurement_quantitative WHERE measurement_name = 'Juvenile count') AS taxon_measurement_id,
	(SELECT capture_id FROM capture c WHERE a.critter_id = c.critter_id),
	NULL::uuid AS mortality_id,
	0 AS value,
	'Ported from BCTW, original data: < ' || juvenile_at_heel || ' >' AS measurement_comment,
	NULL::timestamptz AS measured_timestamp
FROM bctw.animal a WHERE valid_to IS NULL AND juvenile_at_heel = 'No';



/*
 * Converts BCTW rows with life_stage to their qualitative equivalent
 */
INSERT INTO measurement_qualitative (measurement_qualitative_id, critter_id, taxon_measurement_id, capture_id, mortality_id, qualitative_option_id, measurement_comment, measured_timestamp)
WITH qualitative_with_taxons AS (
SELECT taxon_name_latin, measurement_name, taxon_measurement_id
FROM xref_taxon_measurement_qualitative q JOIN
lk_taxon t ON t.taxon_id = q.taxon_id),
options_with_taxons AS (
SELECT taxon_name_latin, option_label, qualitative_option_id
FROM xref_taxon_measurement_qualitative_option o JOIN xref_taxon_measurement_qualitative q ON o.taxon_measurement_id = q.taxon_measurement_id
JOIN lk_taxon t ON t.taxon_id = q.taxon_id
)
SELECT 
	crypto.gen_random_uuid() AS measurement_qualitative_id,
	critter_id,
	(CASE WHEN species = 'Grey Wolf' THEN 
		(SELECT taxon_measurement_id FROM qualitative_with_taxons WHERE taxon_name_latin = 'Canis lupus' AND measurement_name = 'Life Stage')
	 ELSE
	 	(SELECT taxon_measurement_id FROM qualitative_with_taxons WHERE taxon_name_latin = 'Artiodactyla' AND measurement_name = 'Life Stage')
	 END) AS taxon_measurement_id,
	(SELECT capture_id FROM capture c WHERE a.critter_id = c.critter_id),
	NULL::uuid AS mortality_id,
	(CASE WHEN species ='Grey Wolf' THEN 
		(SELECT qualitative_option_id FROM options_with_taxons WHERE taxon_name_latin = 'Canis lupus' AND option_label ILIKE life_stage)
	 ELSE
		(SELECT qualitative_option_id FROM options_with_taxons WHERE taxon_name_latin = 'Artiodactyla' AND option_label ILIKE life_stage)
	 END
	) AS qualitative_option_id,
	'Ported from BCTW, original data: < ' || life_stage || ' >' AS measurement_comment,
	NULL::timestamptz AS measured_timestamp
FROM bctw.animal a WHERE valid_to IS NULL AND life_stage IS NOT NULL;

/*
 * Converts BCTW rows with estimated_age to a quantitative measurement
 */
INSERT INTO measurement_quantitative (measurement_quantitative_id, critter_id, taxon_measurement_id, capture_id, mortality_id, value, measurement_comment, measured_timestamp)
SELECT 
	crypto.gen_random_uuid() AS measurement_quantitative_id,
	critter_id,
	(SELECT taxon_measurement_id FROM xref_taxon_measurement_quantitative WHERE measurement_name = 'Estimated age') AS taxon_measurement_id,
	(SELECT capture_id FROM capture c WHERE a.critter_id = c.critter_id),
	NULL::uuid AS mortality_id,
	estimated_age AS value,
	'Ported from BCTW, original data: < ' || estimated_age || ' >' AS measurement_comment,
	NULL::timestamptz AS measured_timestamp
FROM bctw.animal a WHERE valid_to IS NULL AND estimated_age IS NOT NULL;

DROP TABLE bctw.animal;
DROP SCHEMA bctw;