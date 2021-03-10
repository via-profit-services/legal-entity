import type { Resolvers } from '@via-profit-services/legal-entity';

import LegalEntitiesMutation from './LegalEntitiesMutation';
import LegalEntitiesQuery from './LegalEntitiesQuery';
import LegalEntity from './LegalEntity';
import LegalEntityExternalSearch from './LegalEntityExternalSearch';
import LegalEntityPayments from './LegalEntityPayments';

const resolvers: Resolvers = {
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
