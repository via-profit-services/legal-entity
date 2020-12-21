import { Middleware, collateForDataloader } from '@via-profit-services/core';
import type { LegalEntityMiddlewareFactory } from '@via-profit-services/legal-entity';

import DataLoader from 'dataloader';

import LegalEntity from './LegalEntity';

const pool: ReturnType<Middleware> = {
  context: null,
}

const middlewareFactory: LegalEntityMiddlewareFactory = () => {

  const middleware: Middleware = ({ context }) => {

    if (pool.context !== null) {
      return pool;
    }

    pool.context = context;
    const service = new LegalEntity({ context });

    pool.context.services.legalEntity = service;

    pool.context.dataloader.legalEntities = new DataLoader(async (ids: string[]) => {
      const nodes = await service.getLegalEntitiesByIds(ids);

      return collateForDataloader(ids, nodes);
    });

    pool.context.dataloader.legalEntitiesPayments = new DataLoader(async (ids: string[]) => {
      const nodes = await service.getLegalEntityPaymentsByIds(ids);

      return collateForDataloader(ids, nodes);
    });

    return pool;
  }


  return middleware;
}

export default middlewareFactory;
