/*
  Warnings:

  - A unique constraint covering the columns `[keycloak_uuid]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "critterbase_user_keycloak_uuid_unq" ON "user"("keycloak_uuid");
