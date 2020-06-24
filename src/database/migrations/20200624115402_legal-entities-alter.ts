/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    truncate table "legalEntities" cascade; 
    alter table "legalEntities" add column "directorNameShortNominative" varchar(100) NOT NULL;
    alter table "legalEntities" add column "directorNameShortGenitive" varchar(100) NOT NULL;
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
