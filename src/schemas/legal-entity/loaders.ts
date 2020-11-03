import {
  Node, DataLoader, collateForDataloader,
} from '@via-profit-services/core';

import LegalEntityService from './service';
import { ILegalEntity, ILegalEntityPayment, Context } from './types';


interface Loaders {
  legalEntities: DataLoader<string, Node<ILegalEntity>>;
  payments: DataLoader<string, Node<ILegalEntityPayment>>;
}

const loaders: Loaders = {
  legalEntities: null,
  payments: null,
};


export default function createLoaders(context: Context) {
  if (loaders.legalEntities !== null) {
    return loaders;
  }

  const service = new LegalEntityService({ context });

  loaders.legalEntities = new DataLoader(async (ids: string[]) => {
    const nodes = await service.getLegalEntitiesByIds(ids);

    return collateForDataloader(ids, nodes);
  });

  loaders.payments = new DataLoader(async (ids: string[]) => {
    const nodes = await service.getLegalEntityPaymentsByIds(ids);

    return collateForDataloader(ids, nodes);
  });

  return loaders;
}
