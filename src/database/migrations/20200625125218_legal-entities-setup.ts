/**
 * @via-profit-services/legal-entity
 *
 * This migration file was created by the @via-profit-services/legal-entity package
 */
/* eslint-disable import/no-extraneous-dependencies */
import Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`

    alter table "legalEntities" drop column "rs" cascade;
    alter table "legalEntities" drop column "ks" cascade;
    alter table "legalEntities" drop column "bic" cascade;
    alter table "legalEntities" drop column "bank" cascade;
    alter table "legalEntities" rename column "name" to "label";

    alter table "legalEntities" add column "nameShort" varchar(100) default '';
    alter table "legalEntities" alter column "nameShort" set not null;

    alter table "legalEntities" add column "nameFull" varchar(100) default '';
    alter table "legalEntities" alter column "nameFull" set not null;
    




    drop type if exists "legalEntityPaymentPriority" cascade;
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
    DROP TABLE IF EXISTS "legalEntitiesPayments" cascade;
    drop type if exists "legalEntityPaymentPriority" cascade;

    alter table "legalEntities" rename column "label" to "name";

    alter table "legalEntities" add column "rs" varchar(255) default '';
    alter table "legalEntities" alter column "rs" set not null;

    alter table "legalEntities" add column "ks" varchar(255) default '';
    alter table "legalEntities" alter column "ks" set not null;

    alter table "legalEntities" add column "bic" varchar(255) default '';
    alter table "legalEntities" alter column "bic" set not null;

    alter table "legalEntities" add column "bank" varchar(255) default '';
    alter table "legalEntities" alter column "bank" set not null;
    
    alter table "legalEntities" drop column "nameShort" cascade;
    alter table "legalEntities" drop column "nameFull" cascade;
  `);
}
