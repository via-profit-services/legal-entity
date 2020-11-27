/**
 * @via-profit-services/legal-entity
 *
 * This migration file was created by the @via-profit-services/legal-entity package
 */
/* eslint-disable import/no-extraneous-dependencies */
import { Knex } from '@via-profit-services/core';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    alter table "legalEntities" add column "city" uuid null;
    alter table "legalEntities" add constraint "legalEntitiesToCity_fk" FOREIGN KEY ("city") REFERENCES "geographyCities"(id) ON UPDATE SET NULL;
  `);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    alter table "legalEntities" drop constraint "legalEntitiesToCity_fk";
    alter table "legalEntities" drop column "city";
  `);
}
