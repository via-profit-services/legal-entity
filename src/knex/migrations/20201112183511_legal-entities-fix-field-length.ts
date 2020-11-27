/* eslint-disable */

import { Knex } from '@via-profit-services/core';

export async function up(knex: Knex): Promise<unknown> {
  return knex.raw(`
    ALTER TABLE "legalEntities" ALTER COLUMN "nameFull" TYPE text USING "nameFull"::text;
  `);
}

export async function down(knex: Knex): Promise<unknown> {
  return knex.raw(`
    ALTER TABLE "legalEntities" ALTER COLUMN "nameFull" TYPE varchar(100) USING "nameFull"::text;
  `);
}
