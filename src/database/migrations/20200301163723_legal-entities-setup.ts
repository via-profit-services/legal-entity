import Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    drop table if exists "legalEntities" cascade;
    drop table if exists "legalEntitiesPayments" cascade;
    drop table if exists "legalEntitiesTypes" cascade;

    drop type if exists "legalEntityPaymentPriority";

    create table "legalEntitiesTypes" (
      "type" varchar(50) NOT NULL,
      constraint "legalEntitiesTypes_un" UNIQUE (type)
    );

    create type "legalEntityPaymentPriority" AS enum (
      'master',
      'slave'
    );


    create table "legalEntities" (
      "id" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "type" varchar(50) NOT NULL DEFAULT 'VoidLegalEntity'::character varying,
      "entity" varchar(100) NOT NULL,
      "label" varchar(100) NOT NULL,
      "address" varchar(255) NOT NULL,
      "ogrn" varchar(50) NOT NULL,
      "kpp" varchar(100) NULL,
      "inn" varchar(50) NOT NULL,
      "directorNameNominative" varchar(255) NOT NULL,
      "directorNameGenitive" varchar(255) NOT NULL,
      "directorNameShortNominative" varchar(100) NOT NULL DEFAULT ''::character varying,
      "directorNameShortGenitive" varchar(100) NOT NULL DEFAULT ''::character varying,
      "comment" text NULL,
      "nameShort" varchar(100) NOT NULL DEFAULT ''::character varying,
      "nameFull" text NOT NULL DEFAULT ''::character varying,
      "city" uuid NULL,
      CONSTRAINT "legalEntities_pkey" PRIMARY KEY (id)
    );

    create table "legalEntitiesPayments" (
      "id" uuid NOT NULL,
      "owner" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "rs" varchar(255) NOT NULL,
      "ks" varchar(255) NOT NULL,
      "bic" varchar(255) NOT NULL,
      "bank" varchar(255) NOT NULL,
      "priority" "legalEntityPaymentPriority" NOT NULL DEFAULT 'slave'::"legalEntityPaymentPriority",
      "comment" text NOT NULL DEFAULT '',
      CONSTRAINT "legalEntitiesPayments_pkey" PRIMARY KEY (id)
    );


    create index "legalEntitiesEntityIndex" ON "legalEntities" USING btree ("entity");
    create index "legalentitiesInnIndex" ON "legalEntities" USING btree ("inn");
    create index "legalentitiesOgrnIndex" ON "legalEntities" USING btree ("ogrn");

    alter table "legalEntitiesPayments" ADD CONSTRAINT "legalEntitiesPayments_owner_fk" FOREIGN KEY ("owner") REFERENCES "legalEntities"("id") ON DELETE CASCADE;
    alter table "legalEntities" ADD CONSTRAINT "legalEntitiesToCity_fk" FOREIGN KEY ("city") REFERENCES "geographyCities"("id") ON UPDATE SET NULL;

  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    drop table if exists "legalEntitiesPayments" cascade;
    drop table if exists "legalEntities" cascade;
    drop table if exists "legalEntitiesTypes" cascade;

    drop type if exists "legalEntityPaymentPriority";
  `);
}
