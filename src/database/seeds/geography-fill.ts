import fs from 'fs';
import path from 'path';
import { Knex } from 'knex';

/**
 * Split array to chunks per size
 */
const arrayChunk = <T extends Record<string, any>>(array: Array<T>, size: number): T[][] => {
  const results: T[][] = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }

  return results;
}

/**
 * Insert or update data for a specific type (countries, states or cities)
 */
const insertOrUpdate = async (
  knex: Knex,
  type: 'countries' | 'states' | 'cities',
): Promise<void> => {

  // Geography data must be in `<ProjectRoot>/.data/geography` directory
  const dataDir = path.resolve(process.cwd(), '../.data/geography');

  // Reading directory to get array of country codes
  await fs.readdirSync(dataDir).reduce(async (prev, countryCode) => {
    await prev;

    const tableMap = {
      countries: 'geographyCountries',
      states: 'geographyStates',
      cities: 'geographyCities',
    };

    const filename = path.resolve(dataDir, countryCode, `${type}.json`);
    const tableName = tableMap[type];

    // read and parse from JSON
    const data = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));

    // split into chunks because the length of the SQL query is limited
    const chunks = arrayChunk(data, 1000);

    // convert chunks to promises
    const requests = chunks.map((chunk) => knex(tableName).insert(chunk).onConflict('id').merge());

    await Promise.all(requests);

  }, Promise.resolve());
}


export const seed = async (knex: Knex) => {
  // Countries first, then states and cities at last
  await insertOrUpdate(knex, 'countries');
  await insertOrUpdate(knex, 'states');
  await insertOrUpdate(knex, 'cities');
}

