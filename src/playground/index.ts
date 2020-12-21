/* eslint-disable no-console */
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as core from '@via-profit-services/core';
import * as geography from '@via-profit-services/geography';
import * as knex from '@via-profit-services/knex';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';

import * as legalEntity from '../index';

dotenv.config();

const PORT = 9005;
const app = express();
const server = http.createServer(app);
(async () => {

  const knexMiddleware = knex.factory({
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    },
  });

  const geographyMiddleware = geography.factory();
  const legalEntityMiddleware = legalEntity.factory();

  const schema = makeExecutableSchema({
    typeDefs: [
      core.typeDefs,
      geography.typeDefs,
      legalEntity.typeDefs,
    ],
    resolvers: [
      core.resolvers,
      geography.resolvers,
      legalEntity.resolvers,
    ],
  });


  const { graphQLExpress } = await core.factory({
    server,
    schema,
    debug: true,
    enableIntrospection: true,
    logDir: path.resolve(__dirname, '../../build/logs'),
    middleware: [
      knexMiddleware,
      geographyMiddleware,
      legalEntityMiddleware,
    ],
  });

  app.use(graphQLExpress);
  server.listen(PORT, () => {
    console.log(`GraphQL Server started at http://localhost:${PORT}/graphql`);
    console.log(`Subscriptions server started at ws://localhost:${PORT}/graphql`);
  })

})();
