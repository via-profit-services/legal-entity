import type { Resolvers } from '@via-profit-services/legal-entity';


export const legalEntityExternalSearchResolver: Resolvers['LegalEntityExternalSearch'] = {
  companies: async (_parent, args, context) => {
    const { query } = args;
    const { services } = context;
    const result = await services.legalEntities.externalSearchCompanies(query);

    return result;
  },
  payments: async (_parent, args, context) => {
    const { query } = args;
    const { services } = context;
    const result = await services.legalEntities.externalSearchPayments(query);

    return result;
  },
};


export default legalEntityExternalSearchResolver;
