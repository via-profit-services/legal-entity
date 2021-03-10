import { Context, collateForDataloader } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import LegalEntityService from './LegalEntityService';

interface Props {
  context: Context;
}

const contextMiddleware = (props: Props): Context => {

  const { context } = props;

  context.services.legalEntities = new LegalEntityService({ context });

  context.dataloader.legalEntities = new DataLoader(async (ids: string[]) => {
    const nodes = await context.services.legalEntities.getLegalEntitiesByIds(ids);

    return collateForDataloader(ids, nodes);
  });

  context.dataloader.payments = new DataLoader(async (ids: string[]) => {
    const nodes = await context.services.legalEntities.getLegalEntityPaymentsByIds(ids);

    return collateForDataloader(ids, nodes);
  });


  return context;
}

export default contextMiddleware;
