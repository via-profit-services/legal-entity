/**
 * @via-profit-services/geography
 *
 * This migration file was created by the @via-profit-services/geography package
 * This migration will create 3 tables:
 *     `geographyCities`
 *     `geographyStates`
 *     `geographyCountries`
 */

/* eslint-disable import/no-extraneous-dependencies */
import { Knex } from '@via-profit-services/core';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`

    drop table if exists "geographyCities" cascade;
    drop table if exists "geographyStates" cascade;
    drop table if exists "geographyCountries" cascade;

    CREATE TABLE "geographyCountries" (
      "id" uuid NOT NULL,
      "name" varchar(100) NOT NULL,
      "ru" varchar(100) NOT NULL,
      "iso3" varchar(4) NOT NULL,
      "iso2" varchar(4) NOT NULL,
      "phoneCode" varchar(20) NOT NULL,
      "currency" varchar(5) NOT NULL,
      "capital" uuid NULL DEFAULT NULL,
      CONSTRAINT "geographyCountries_pk" PRIMARY KEY (id)
    );


    CREATE TABLE "geographyStates" (
      "id" uuid NOT NULL,
      "name" varchar(100) NOT NULL,
      "ru" varchar(100) NOT NULL,
      "country" uuid NOT NULL,
      "stateCode" varchar(10) NOT NULL,
      "countryCode" varchar(10) NOT NULL,
      CONSTRAINT "geographyStates_pk" PRIMARY KEY (id)
    );
    ALTER TABLE "geographyStates" ADD CONSTRAINT "geographyStates_fk_country" FOREIGN KEY ("country") REFERENCES "geographyCountries"(id) ON DELETE CASCADE;
    

    CREATE TABLE "geographyCities" (
      "id" uuid NOT NULL,
      "name" varchar(100) NOT NULL,
      "ru" varchar(100) NOT NULL,
      "country" uuid NOT NULL,
      "countryCode" varchar(10) NOT NULL,
      "state" uuid NOT NULL,
      "stateCode" varchar(10) NOT NULL,
      "latitude" varchar(20) NOT NULL,
      "longitude" varchar(20) NOT NULL,
      CONSTRAINT "geographyCities_pk" PRIMARY KEY (id)
    );
    ALTER TABLE "geographyCities" ADD CONSTRAINT "geographyCities_fk_country" FOREIGN KEY ("country") REFERENCES "geographyCountries"(id) ON DELETE CASCADE;
    ALTER TABLE "geographyCities" ADD CONSTRAINT "geographyCities_fk_state" FOREIGN KEY ("state") REFERENCES "geographyStates"(id) ON DELETE CASCADE;
  `);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    drop table if exists "geographyCities" cascade;
    drop table if exists "geographyStates" cascade;
    drop table if exists "geographyCountries" cascade;
  `);
}
