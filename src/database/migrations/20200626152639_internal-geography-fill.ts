/* eslint-disable import/no-extraneous-dependencies */
import * as ru from '@via-profit-services/geography/dist/countries/RU';
import * as Knex from 'knex';

const list = [ru];

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    delete from "geographyCities";
    delete from "geographyStates";
    delete from "geographyCountries";
  `)
    .then(() => {
      return list.reduce(async (prev, { countries, states, cities }) => {
        await prev;
        await knex('geographyCountries').insert(countries);
        await knex('geographyStates').insert(states);
        await knex('geographyCities').insert(cities);
      }, Promise.resolve());
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    delete from "geographyCities";
    delete from "geographyStates";
    delete from "geographyCountries";
  `);
}
