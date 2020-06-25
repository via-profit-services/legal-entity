import { IResolvers } from 'graphql-tools';
import { Context } from '../types';

import LegalEntitiesMutation from './LegalEntitiesMutation';
import LegalEntitiesQuery from './LegalEntitiesQuery';
import LegalEntity from './LegalEntity';
import LegalEntityExternalSearchResult from './LegalEntityExternalSearchResult';
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
  LegalEntitiesMutation,
  LegalEntityExternalSearchResult,
  LegalEntityPayments,
};

export default resolvers;
