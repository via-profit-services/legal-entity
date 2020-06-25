import {
  ServerError,
  buildCursorConnection,
  buildQueryFilter,
  TInputFilter,
} from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';

import createLoaders from '../loaders';
import LegalEntityService from '../service';
import { Context, IExternalSearchArgs } from '../types';

export const queryResolver: IResolverObject<any, Context> = {

  list: async (parent, args: TInputFilter, context) => {
    const filter = buildQueryFilter(args);
    const legalEntitiesService = new LegalEntityService({ context });
    const loaders = createLoaders(context);

    try {
      const legalEntitiesConnection = await legalEntitiesService.getLegalEntities(filter);
      const connection = buildCursorConnection(legalEntitiesConnection, 'legalEntities');

      // fill the cache
      legalEntitiesConnection.nodes.forEach((node) => {
        loaders.legalEntities
          .clear(node.id)
          .prime(node.id, node);
      });

      return connection;
    } catch (err) {
      throw new ServerError('Failed to get LegalEntities list', { err });
    }
  },
  get: async (parent, args: {id: string}, context) => {
    const { id } = args;
    const loaders = createLoaders(context);
    const legalEntity = await loaders.legalEntities.load(id);

    return legalEntity || null;
  },
  externalSearch: async (parent, args: IExternalSearchArgs, context) => {
    const { query } = args;
    const legalEntitiesService = new LegalEntityService({ context });
    const result = await legalEntitiesService.externalSearch(query);

    return result;
  },
};


export default queryResolver;
