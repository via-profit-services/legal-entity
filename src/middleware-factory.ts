import { Middleware, ServerError, collateForDataloader } from '@via-profit-services/core';
import type { MiddlewareFactory, Configuration } from '@via-profit-services/legal-entity';
import '@via-profit-services/geography';
import DataLoader from 'dataloader';

import LegalEntityService from './LegalEntityService';
import resolvers from './resolvers';
import typeDefs from './schema.graphql';

const middlewareFactory: MiddlewareFactory = async (configuration) => {
  let typesTableInit = false;
  const { entities } = configuration || {} as Configuration;
  const typeList = new Set(
    [...entities || []].map((entity) => entity.replace(/[^a-zA-Z]/g, '')),
  );
  
  typeList.add('VoidLegalEntity');

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
    context.services.legalEntities = new LegalEntityService({ context });

    // Inject common dataloader
    context.dataloader.legalEntities = new DataLoader(async (ids: string[]) => {
      const nodes = await context.services.legalEntities.getLegalEntitiesByIds(ids);

      return collateForDataloader(ids, nodes);
    });

    // Inject payments dataloader
    context.dataloader.payments = new DataLoader(async (ids: string[]) => {
      const nodes = await context.services.legalEntities.getLegalEntityPaymentsByIds(ids);

      return collateForDataloader(ids, nodes);
    });

    // check to init tables
    if (!typesTableInit) {
      await context.services.legalEntities.rebaseTypes([...typeList]);
      typesTableInit = true;
    }

    return {
      context,
    };
  };

  return {
    middleware,
    resolvers,
    typeDefs: `
      ${typeDefs}
      union LegalEntityEntity = ${[...typeList].join(' | ')}
      enum LegalEntityType {
        ${[...typeList].join(',\n')}
      }
      `,
  };
};

export default middlewareFactory;
