import * as ru from '@via-profit-services/geography/dist/countries/RU';
import Knex from 'knex';

const list = [ru];

export async function seed (knex: Knex): Promise<any> {
  return list.reduce(async (prev, { countries, states, cities }) => {
    await prev;

    // insert countries
    await knex.raw(`
      ${knex('geographyCountries').insert(countries).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(countries[0]).map((field) => `"${field}" = excluded."${field}"`).join(',')}
    `);

    // insert states
    await knex.raw(`
      ${knex('geographyStates').insert(states).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(states[0]).map((field) => `"${field}" = excluded."${field}"`).join(', ')}
    `);

    // insert cities
    await knex.raw(`
      ${knex('geographyCities').insert(cities).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(cities[0]).map((field) => `"${field}" = excluded."${field}"`).join(', ')}
    `);
  }, Promise.resolve());
}
