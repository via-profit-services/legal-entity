import { Knex } from '@via-profit-services/core';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    directory: './.migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './.seeds',
    extension: 'ts',
  },
  pool: {
    afterCreate: (conn: any, done: any) => {
      conn.query(
        `
          SET TIMEZONE = 'UTC';
          SET CLIENT_ENCODING = UTF8;
        `,
        (err: any) => {
          done(err, conn);
        },
      );
    },
  },
};

module.exports = config;
