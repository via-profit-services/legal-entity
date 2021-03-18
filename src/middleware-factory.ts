import { Middleware, ServerError, collateForDataloader } from '@via-profit-services/core';
import type { MiddlewareFactory } from '@via-profit-services/legal-entity';
import '@via-profit-services/geography';
import DataLoader from 'dataloader';

import LegalEntityService from './LegalEntityService';

const middlewareFactory: MiddlewareFactory = async () => {
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

    // Inject service
    context.services.legalEntities = context.services.legalEntities ?? new LegalEntityService({ context });

    // Inject common dataloader
    context.dataloader.legalEntities = context.dataloader.legalEntities ?? new DataLoader(async (ids: string[]) => {
      const nodes = await context.services.legalEntities.getLegalEntitiesByIds(ids);

      return collateForDataloader(ids, nodes);
    });

    // Inject payments dataloader
    context.dataloader.payments = context.dataloader.payments ?? new DataLoader(async (ids: string[]) => {
      const nodes = await context.services.legalEntities.getLegalEntityPaymentsByIds(ids);

      return collateForDataloader(ids, nodes);
    });

    return {
      context,
    };
  };

  return middleware;
};

export default middlewareFactory;
