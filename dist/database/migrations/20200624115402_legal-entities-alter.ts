/**
 * @via-profit-services/legal-entity
 *
 * This migration file was created by the @via-profit-services/legal-entity package
 */
/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    alter table "legalEntities" add column "directorNameShortNominative" varchar(100) default '';
    alter table "legalEntities" alter column "directorNameShortNominative" set not null;
    
    alter table "legalEntities" add column "directorNameShortGenitive" varchar(100) default '';
    alter table "legalEntities" alter column "directorNameShortGenitive" set not null;

    alter table "legalEntities" add column "comment" text NULL;
  `);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    alter table "legalEntities" drop column "directorNameShortNominative";
    alter table "legalEntities" drop column "directorNameShortGenitive";
    alter table "legalEntities" drop column "comment";
`);
}
