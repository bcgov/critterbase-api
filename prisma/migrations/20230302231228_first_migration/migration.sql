-- AlterTable
ALTER TABLE "artifact" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "audit_log" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "capture" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "critter" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "critter_collection_unit" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "family" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "family_child" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "family_parent" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_cause_of_death" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_collection_category" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_colour" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_marking_material" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_marking_type" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_region_env" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_region_nr" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_taxon" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "lk_wildlife_management_unit" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "marking" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "measurement_qualitative" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "measurement_quantitative" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "mortality" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "relationship" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "xref_collection_unit" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "xref_taxon_collection_category" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "xref_taxon_marking_body_location" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "xref_taxon_measurement_qualitative" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "xref_taxon_measurement_qualitative_option" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);

-- AlterTable
ALTER TABLE "xref_taxon_measurement_quantitative" ALTER COLUMN "create_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text),
ALTER COLUMN "update_user" SET DEFAULT critterbase.getuserid('SYSTEM'::text);
