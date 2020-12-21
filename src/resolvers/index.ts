import { IResolvers } from '@graphql-tools/utils';
import { Context } from '@via-profit-services/core';

import LegalEntitiesMutation from './LegalEntitiesMutation';
import LegalEntitiesQuery from './LegalEntitiesQuery';
import LegalEntity from './LegalEntity';
import LegalEntityExternalSearch from './LegalEntityExternalSearch';
import LegalEntityPayments from './LegalEntityPayments';
import Mutation from './Mutation';
import Query from './Query';

const resolvers: IResolvers<any, Context> = {
  Query,
  Mutation,
  LegalEntity,
  LegalEntitiesQuery,
  LegalEntityExternalSearch,
  LegalEntitiesMutation,
  LegalEntityPayments,
};

export default resolvers;
