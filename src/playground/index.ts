/* eslint-disable import/max-dependencies */
/* eslint-disable no-console */
import { makeExecutableSchema } from '@graphql-tools/schema';
import { factory, resolvers, typeDefs } from '@via-profit-services/core';
import * as geography from '@via-profit-services/geography';
import * as knex from '@via-profit-services/knex';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import { factory as legalEntityFactory } from '../index';

dotenv.config();

const app = express();

const server = http.createServer(app);
(async () => {

  const geographyMiddleware = geography.factory();

  const knexMiddleware = knex.factory({
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    },
  });

  const legalEntity = await legalEntityFactory();

  const schema = makeExecutableSchema({
    typeDefs: [
      typeDefs,
      legalEntity.typeDefs,
      geography.typeDefs,
    ],
    resolvers: [
      resolvers,
      geography.resolvers,
      legalEntity.resolvers,
    ],
  });


  const { graphQLExpress } = await factory({
    server,
    schema,
    debug: true,
    middleware: [
      knexMiddleware,
      geographyMiddleware,
      legalEntity.middleware,
    ],
  });

  app.use(process.env.GRAPHQL_ENDPOINT, graphQLExpress);

  server.listen(Number(process.env.SERVER_PORT), process.env.SERVER_HOST, () => {
    console.log(`GraphQL Server started at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/graphql`);
  });

})();
