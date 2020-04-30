import { IContext } from '@via-profit-services/core';
import { IResolvers } from 'graphql-tools';

import LegalEntitiesMutationResolver from './LegalEntitiesMutation';
import LegalEntitiesQueryResolver from './LegalEntitiesQuery';
import LegalEntityResolver from './LegalEntity';

const resolvers: IResolvers<any, Pick<IContext, 'knex' | 'timezone'>> = {
  Query: {
    legalEntities: () => ({}),
  },
  Mutation: {
    legalEntities: () => ({}),
  },
  LegalEntity: LegalEntityResolver,
  LegalEntitiesQuery: LegalEntitiesQueryResolver,
  LegalEntitiesMutation: LegalEntitiesMutationResolver,
};

export default resolvers;
