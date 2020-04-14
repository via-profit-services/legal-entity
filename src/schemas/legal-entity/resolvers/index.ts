import { IContext } from '@via-profit-services/core';
import { IResolvers } from 'graphql-tools';

import * as scalars from '../scalars';
import LegalEntitiesMutationResolver from './LegalEntitiesMutation';
import LegalEntitiesQueryResolver from './LegalEntitiesQuery';
import LegalEntityResolver from './LegalEntity';

const resolvers: IResolvers<any, IContext> = {
  Query: {
    legalEntities: () => ({}),
  },
  Mutation: {
    legalEntities: () => ({}),
  },
  LegalEntity: LegalEntityResolver,
  LegalEntitiesQuery: LegalEntitiesQueryResolver,
  LegalEntitiesMutation: LegalEntitiesMutationResolver,
  ...scalars,
};

export default resolvers;
