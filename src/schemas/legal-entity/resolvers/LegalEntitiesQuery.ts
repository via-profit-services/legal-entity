import {
  IContext,
  ServerError,
  buildCursorConnection,
  buildQueryFilter,
  TInputFilter,
} from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';

import createLoaders from '../loaders';
import LegalEntityService from '../service';


export const queryResolver: IResolverObject<any, IContext> = {

  list: async (parent, args: TInputFilter, context) => {
    const filter = buildQueryFilter(args);
    const legalEntitiesService = new LegalEntityService({ context });
    const loaders = createLoaders(context);

    try {
      const legalEntitiesConnection = await legalEntitiesService.getLegalEntities(filter);
      const connection = buildCursorConnection(legalEntitiesConnection);

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
};


export default queryResolver;