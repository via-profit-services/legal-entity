import { ServerError, buildCursorConnection, buildQueryFilter } from '@via-profit-services/core';
import type { Resolvers } from '@via-profit-services/legal-entity';

export const queryResolver: Resolvers['LegalEntitiesQuery'] = {
  list: async (_parent, args, context) => {
    const { services } = context;
    const filter = buildQueryFilter(args);

    filter.where.push(['deleted', '=', false]);

    try {
      const legalEntitiesConnection = await services.legalEntities.getLegalEntities(filter);
      const connection = buildCursorConnection(legalEntitiesConnection, 'legalEntities');

      return connection;
    } catch (err) {
      throw new ServerError('Failed to get LegalEntities list', { err });
    }
  },
  legalEntity: async (_parent, args, context) => {
    const { id } = args;
    const { dataloader } = context;
    const legalEntity = await dataloader.legalEntities.load(id);

    return legalEntity;
  },
  externalSearch: (_parent, args) => args,
};


export default queryResolver;
