import { IObjectTypeResolver } from '@graphql-tools/utils';
import { Context } from '@via-profit-services/core';
import { ExternalSearchArgs } from '@via-profit-services/legal-entity';


export const legalEntityExternalSearchResolver: IObjectTypeResolver<unknown, Context> = {
  companies: async (_parent, args: ExternalSearchArgs, context) => {
    const { query } = args;
    const { services } = context;
    const result = await services.legalEntity.externalSearchCompanies(query);

    return result;
  },
  payments: async (_parent, args: ExternalSearchArgs, context) => {
    const { query } = args;
    const { services } = context;
    const result = await services.legalEntity.externalSearchPayments(query);

    return result;
  },
};


export default legalEntityExternalSearchResolver;
