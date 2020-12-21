/* eslint-disable */
const path = require('path');
const { exportMigrations } = require('@via-profit-services/knex/dist/export-migrations');

exportMigrations({
  migrationsSource: path.resolve(__dirname, '../.knex/migrations'),
  migrationsDestination: path.resolve(process.env.INIT_CWD, './.knex/migrations')
});
