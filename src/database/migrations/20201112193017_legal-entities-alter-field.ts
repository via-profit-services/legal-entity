/* eslint-disable */

import { Knex } from '@via-profit-services/core';

export async function up(knex: Knex): Promise<unknown> {
  return knex.raw(`
    ALTER TABLE "legalEntities" DROP CONSTRAINT "legalEntitiesOgrnUniqe";
  `);
}

export async function down(knex: Knex): Promise<unknown> {
  return knex.raw(`
    
    -- remove duplicates
    DELETE FROM "legalEntities"
    WHERE id IN 
    (
      SELECT id
      FROM (
        SELECT
          id,
          ROW_NUMBER() OVER (partition BY "ogrn" ORDER BY id) AS RowNumber
        FROM "legalEntities"
      ) AS T
      WHERE T.RowNumber > 1
    );
    
    -- add constraint
    ALTER TABLE "legalEntities" ADD CONSTRAINT "legalEntitiesOgrnUniqe" UNIQUE (rs);
  `);
}
