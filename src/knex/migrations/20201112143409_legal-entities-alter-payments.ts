/* eslint-disable */

import { Knex } from '@via-profit-services/core';

export async function up(knex: Knex): Promise<unknown> {
  return knex.raw(`
    ALTER TABLE "legalEntitiesPayments" DROP CONSTRAINT "legalEntitiesPaymentsRsUniqe";
  `);
}

export async function down(knex: Knex): Promise<unknown> {
  return knex.raw(`
    
    -- remove duplicates
    DELETE FROM "legalEntitiesPayments"
    WHERE id IN 
    (
      SELECT id
      FROM (
        SELECT
          id,
          ROW_NUMBER() OVER (partition BY "rs" ORDER BY id) AS RowNumber
        FROM "legalEntitiesPayments"
      ) AS T
      WHERE T.RowNumber > 1
    );
    
    -- add constraint
    ALTER TABLE "legalEntitiesPayments" ADD CONSTRAINT "legalEntitiesPaymentsRsUniqe" UNIQUE (rs);
  `);
}
