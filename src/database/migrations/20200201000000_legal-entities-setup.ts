/**
 * @via-profit-services/legal-entity
 *
 * This migration file was created by the @via-profit-services/legal-entity package
 */

import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`


    DROP TABLE IF EXISTS "legalEntities";
    CREATE TABLE "legalEntities" (
      "id" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "name" varchar(100) NOT NULL,
      "address" varchar(255) NOT NULL,
      "ogrn" varchar(50) NOT NULL,
      "kpp" varchar(100) NULL,
      "inn" varchar(50) NOT NULL,
      "rs" varchar(255) NOT NULL,
      "ks" varchar(255) NOT NULL,
      "bic" varchar(255) NOT NULL,
      "bank" varchar(255) NOT NULL,
      "directorNameNominative" varchar(255) NOT NULL,
      "directorNameGenitive" varchar(255) NOT NULL,
      "deleted" boolean NOT NULL DEFAULT false,
      CONSTRAINT "legalEntities_pkey" PRIMARY KEY (id)
    );
    
    ALTER TABLE "legalEntities" ADD CONSTRAINT "legalEntitiesInnUniqe" UNIQUE (inn);
    ALTER TABLE "legalEntities" ADD CONSTRAINT "legalEntitiesOgrnUniqe" UNIQUE (ogrn);
    CREATE INDEX "legalEntitiesDeletedIndex" ON "legalEntities" USING btree (deleted);
    CREATE INDEX "legalentitiesInnIndex" ON "legalEntities" (inn);
    CREATE INDEX "legalentitiesOgrnIndex" ON "legalEntities" (ogrn);
  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP TABLE IF EXISTS "legalEntities" CASCADE;
  `);
}
