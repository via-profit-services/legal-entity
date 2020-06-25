/**
 * @via-profit-services/legal-entity
 *
 * This migration file was created by the @via-profit-services/legal-entity package
 */
/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP TABLE IF EXISTS "legalEntities";
    CREATE TABLE "legalEntities" (
      "id" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "label" varchar(100) NOT NULL,
      "nameShort" varchar(100) NOT NULL,
      "nameFull" varchar(100) NOT NULL,
      "address" varchar(255) NOT NULL,
      "ogrn" varchar(50) NOT NULL,
      "kpp" varchar(100) NULL,
      "inn" varchar(50) NOT NULL,
      "directorNameNominative" varchar(255) NOT NULL,
      "directorNameGenitive" varchar(255) NOT NULL,
      "directorNameShortNominative" varchar(100) NOT NULL,
      "directorNameShortGenitive" varchar(100) NOT NULL,
      "deleted" boolean NOT NULL DEFAULT false,
      "comment" text NULL,
      CONSTRAINT "legalEntities_pkey" PRIMARY KEY (id)
    );
    
    ALTER TABLE "legalEntities" ADD CONSTRAINT "legalEntitiesInnUniqe" UNIQUE (inn);
    ALTER TABLE "legalEntities" ADD CONSTRAINT "legalEntitiesOgrnUniqe" UNIQUE (ogrn);
    CREATE INDEX "legalEntitiesDeletedIndex" ON "legalEntities" USING btree (deleted);
    CREATE INDEX "legalEntitiesInnIndex" ON "legalEntities" (inn);
    CREATE INDEX "legalEntitiesOgrnIndex" ON "legalEntities" (ogrn);


    CREATE TYPE "legalEntityPaymentPriority" AS ENUM (
      'master',
      'slave'
    );


    DROP TABLE IF EXISTS "legalEntitiesPayments";
    CREATE TABLE "legalEntitiesPayments" (
      "id" uuid NOT NULL,
      "owner" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "rs" varchar(255) NOT NULL,
      "ks" varchar(255) NOT NULL,
      "bic" varchar(255) NOT NULL,
      "bank" varchar(255) NOT NULL,
      "priority" "legalEntityPaymentPriority" NOT NULL DEFAULT 'slave'::"legalEntityPaymentPriority",
      "deleted" boolean NOT NULL DEFAULT false,
      "comment" text NULL,
      CONSTRAINT "legalEntitiesPayments_pkey" PRIMARY KEY (id)
    );
    
    ALTER TABLE "legalEntitiesPayments" ADD CONSTRAINT "legalEntitiesPaymentsRsUniqe" UNIQUE (rs);
    ALTER TABLE "legalEntitiesPayments" ADD CONSTRAINT "legalEntitiesPayments_owner_fk" FOREIGN KEY ("owner") REFERENCES "legalEntities"(id) ON DELETE CASCADE;
    CREATE INDEX "legalEntitiesPaymentsDeletedIndex" ON "legalEntitiesPayments" USING btree ("deleted");
  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP TABLE IF EXISTS "legalEntities" CASCADE;
  `);
}
