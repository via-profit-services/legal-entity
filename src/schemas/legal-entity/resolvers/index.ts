import { IContext } from '@via-profit-services/core';
import { IResolvers } from 'graphql-tools';

import QueryResolver from './LegalEntitiesQuery';
import LegalEntityResolver from './LegalEntity';

const resolvers: IResolvers<any, IContext> = {
  Query: {
    legalEntities: () => ({}),
  },
  Mutation: {
    legalEntities: () => ({}),
  },
  LegalEntity: LegalEntityResolver,
  LegalEntitiesQuery: QueryResolver,
};

export default resolvers;
