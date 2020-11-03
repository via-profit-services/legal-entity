import { IResolverObject } from 'graphql-tools';

import LegalEntityService from '../service';
import { Context, IExternalSearchArgs } from '../types';

export const legalEntityExternalSearchResolver: IResolverObject<any, Context> = {
  companies: async (parent, args: IExternalSearchArgs, context) => {
    const { query } = args;
    const legalEntitiesService = new LegalEntityService({ context });
    const result = await legalEntitiesService.externalSearchCompanies(query);

    return result;
  },
  payments: async (parent, args: IExternalSearchArgs, context) => {
    const { query } = args;
    const legalEntitiesService = new LegalEntityService({ context });
    const result = await legalEntitiesService.externalSearchPayments(query);

    return result;
  },
};


export default legalEntityExternalSearchResolver;
