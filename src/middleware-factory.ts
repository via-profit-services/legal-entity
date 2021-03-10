import { Middleware, ServerError } from '@via-profit-services/core';
import type { MiddlewareFactory } from '@via-profit-services/legal-entity';

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

    // define static context at once
    pool.context = pool.context ?? contextMiddleware({ context });

    return pool;
  };

  return middleware;
};

export default middlewareFactory;
