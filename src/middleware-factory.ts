import { Middleware, ServerError } from '@via-profit-services/core';
import type { MiddlewareFactory } from '@via-profit-services/legal-entity';
import '@via-profit-services/geography';

import contextMiddleware from './context-middleware';

const middlewareFactory: MiddlewareFactory = async () => {
  const pool: ReturnType<Middleware> = {
    context: null,
  };

  const middleware: Middleware = async ({ context }) => {

    // check knex dependencies
    if (typeof context.knex === 'undefined') {
      throw new ServerError(
        '«@via-profit-services/knex» middleware is missing. If knex middleware is already connected, make sure that the connection order is correct: knex middleware must be connected before',
      );
    }

    // check knex dependencies
    if (typeof context.services?.geography === 'undefined') {
      throw new ServerError(
        '«@via-profit-services/geography» middleware is missing. If Geography middleware is already connected, make sure that the connection order is correct: Geography middleware must be connected before',
      );
    }

    // define static context at once
    pool.context = pool.context ?? contextMiddleware({ context });

    return pool;
  };

  return middleware;
};

export default middlewareFactory;
