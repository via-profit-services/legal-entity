import { IResolvers } from 'graphql-tools';
import { Context } from '../types';

import LegalEntitiesMutation from './LegalEntitiesMutation';
import LegalEntitiesQuery from './LegalEntitiesQuery';
import LegalEntity from './LegalEntity';
import LegalEntityExternalSearch from './LegalEntityExternalSearch';
import LegalEntityPayments from './LegalEntityPayments';

const resolvers: IResolvers<any, Context> = {
  Query: {
    legalEntities: () => ({}),
  },
  Mutation: {
    legalEntities: () => ({}),
  },
  LegalEntity,
  LegalEntitiesQuery,
  LegalEntityExternalSearch,
  LegalEntitiesMutation,
  LegalEntityPayments,
};

export default resolvers;
