import { ServerError, TWhereAction } from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';

import createLoaders from '../loaders';
import LegalEntityService from '../service';
import {
  Context, IUpdateArgs, ICreateArgs, IDeleteArgs,
} from '../types';

export const legalEntityMutationResolver: IResolverObject<any, Context> = {

  update: async (parent, args: IUpdateArgs, context) => {
    const { id, input } = args;
    const { payments, ...otherInput } = input;
    const loaders = createLoaders(context);
    const legalEntityService = new LegalEntityService({ context });


    // check INN unique
    if (input.inn) {
      const { nodes } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['inn', TWhereAction.EQ, input.inn],
          ['id', TWhereAction.NEQ, id],
        ],
      });

      if (nodes.length) {
        if (nodes[0].id !== id) {
          throw new ServerError(
            `Legal entity record already exists with inn ${input.inn} value`, { id, input },
          );
        }
      }
    }


    // check OGRN unique
    if (input.ogrn) {
      const { nodes } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['ogrn', TWhereAction.EQ, input.ogrn],
          ['id', TWhereAction.NEQ, id],
        ],
      });

      if (nodes.length) {
        if (nodes[0].id !== id) {
          throw new ServerError(
            `Legal entity record already exists with ogrn ${input.ogrn} value`, { id, input },
          );
        }
      }
    }


    // update legal entity
    try {
      await legalEntityService.updateLegalEntity(id, otherInput);
    } catch (err) {
      throw new ServerError('Failed to update legal entity', { err, id, input });
    }

    const currentPaymentsIds: string[] = [];
    if (payments && Array.isArray(payments)) {
      const legalEntity = await loaders.legalEntities.load(id);

      // create and update payments
      await payments.reduce(async (prev, data) => {
        await prev;

        const defaultPaymentData = LegalEntityService.getLegalEntityPaymentDefaultData();
        const existsPaymentData = await loaders.payments.load(data.id || defaultPaymentData.id);

        const paymentData = {
          // mixed default data if is new payment
          ...(data.id ? {} : defaultPaymentData),
          // mixed input data
          ...data,
          // set owner permanently
          owner: id,
        };

        currentPaymentsIds.push(paymentData.id);
        loaders.payments.clear(paymentData.id);

        if (!existsPaymentData) {
          try {
            await legalEntityService.createLegalEntityPayment(paymentData);
          } catch (err) {
            throw new ServerError('Failed to create legal entity payments', { err });
          }
        } else {
          try {
            await legalEntityService.updateLegalEntityPayment(paymentData.id, paymentData);
          } catch (err) {
            throw new ServerError('Failed to update legal entity payments', { err });
          }
        }
      }, Promise.resolve());

      // remove old payments of this legal entity
      const prevPaymentsIds = legalEntity.payments.map((p) => p.id);
      const toDeletePaymentIds = prevPaymentsIds
        .filter((prevId) => !currentPaymentsIds
          .includes(prevId));
      try {
        await Promise.all(toDeletePaymentIds.map((((idToDelete) => {
          loaders.payments.clear(idToDelete);
          return legalEntityService.deleteLegalEntityPayment(idToDelete);
        }))));
      } catch (err) {
        throw new ServerError('Failed to remove old payments of this legal entity', { err });
      }
    }

    // clear cache of this legal entity
    loaders.legalEntities.clear(id);
    return { id };
  },
  create: async (parent, args: ICreateArgs, context) => {
    const { input } = args;
    const { payments, ...otherInput } = input;
    const id = input.id || uuidv4();
    const legalEntityService = new LegalEntityService({ context });

    // check INN unique
    if (input.inn) {
      const { totalCount } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['inn', TWhereAction.EQ, input.inn],
        ],
      });

      if (totalCount) {
        throw new ServerError(
          `Legal entity record already exists with inn ${input.inn} value`, { input },
        );
      }
    }


    // check OGRN unique
    if (input.ogrn) {
      const { totalCount } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['ogrn', TWhereAction.EQ, input.ogrn],
        ],
      });

      if (totalCount) {
        throw new ServerError(
          `Legal entity record already exists with ogrn ${input.ogrn} value`, { input },
        );
      }
    }

    try {
      await legalEntityService.createLegalEntity({
        ...LegalEntityService.getLegalEntityDefaultData(),
        ...otherInput,
        id,
      });
    } catch (err) {
      throw new ServerError('Failed to create legal entity', { err, input });
    }


    try {
      await payments.reduce(async (prev, paymentData) => {
        await prev;
        try {
          await legalEntityService.createLegalEntityPayment({
            ...LegalEntityService.getLegalEntityPaymentDefaultData(),
            ...paymentData,
            owner: id,
          });
        } catch (err) {
          throw new ServerError('Failed to create legal entity payments', { err });
        }
      }, Promise.resolve());
    } catch (err) {
      throw new ServerError('Failed to create legal entity payments', { err, input });
    }


    return { id };
  },
  delete: async (parent, args: IDeleteArgs, context) => {
    const { id, ids } = args;
    const { logger, token } = context;
    const legalEntityService = new LegalEntityService({ context });
    const loaders = createLoaders(context);

    const toDeleteIds = []
      .concat(ids || [])
      .concat(id ? [id] : []);

    await toDeleteIds.reduce(async (prevPromise, legalEntityId) => {
      await prevPromise;
      try {
        legalEntityService.deleteLegalEntity(legalEntityId);
        loaders.legalEntities.clear(legalEntityId);
        logger.server.debug(`Legal entity with id ${legalEntityId} was deleted`, {
          id: legalEntityId,
          uuid: token.uuid,
        });
      } catch (err) {
        throw new ServerError('Failed to delete legal entity', { err, id: legalEntityId });
      }
    }, Promise.resolve());


    return true;
  },

};


export default legalEntityMutationResolver;
