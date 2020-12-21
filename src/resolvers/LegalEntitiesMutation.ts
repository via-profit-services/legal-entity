import { IObjectTypeResolver } from '@graphql-tools/utils';
import { ServerError, Context } from '@via-profit-services/core';
import type { LegalEntity, LegalEntityPayment } from '@via-profit-services/legal-entity';
import { v4 as uuidv4 } from 'uuid';
import '@via-profit-services/accounts';


interface CreateArgs {
  input: Omit<LegalEntity, 'payments'> & {
    payments: LegalEntityPayment[];
  };
}

interface UpdateArgs {
  id: string;
  input: Omit<LegalEntity, 'payments'> & {
    payments?: LegalEntityPayment[];
  };
}

interface DeleteArgs {
  id?: string;
  ids?: string[];
}

export const legalEntityMutationResolver: IObjectTypeResolver<any, Context> = {

  update: async (parent, args: UpdateArgs, context) => {
    const { id, input } = args;
    const { services, dataloader } = context;
    const { payments, ...otherInput } = input;


    // check INN unique
    if (input.inn) {
      const { nodes } = await services.legalEntity.getLegalEntities({
        limit: 1,
        where: [
          ['inn', '=', input.inn],
          ['id', '<>', id],
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
      const { nodes } = await services.legalEntity.getLegalEntities({
        limit: 1,
        where: [
          ['ogrn', '=', input.ogrn],
          ['id', '<>', id],
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
      await services.legalEntity.updateLegalEntity(id, otherInput);
    } catch (err) {
      throw new ServerError('Failed to update legal entity', { err, id, input });
    }

    const currentPaymentsIds: string[] = [];
    if (payments && Array.isArray(payments)) {
      const legalEntity = await dataloader.legalEntities.load(id);

      // create and update payments
      await payments.reduce(async (prev, data) => {
        await prev;

        const defaultPaymentData = services.legalEntity.getLegalEntityPaymentDefaultData();
        const existsPaymentData = await dataloader.legalEntitiesPayments.load(
          data.id || defaultPaymentData.id,
        );

        const paymentData: Partial<LegalEntityPayment> = {
          // mixed default data if is new payment
          ...(data.id ? {} : defaultPaymentData),
          // mixed input data
          ...data,
          // set owner permanently
          owner: { id },
        };

        currentPaymentsIds.push(paymentData.id);
        dataloader.legalEntitiesPayments.clear(paymentData.id);

        if (!existsPaymentData) {
          try {
            await services.legalEntity.createLegalEntityPayment(paymentData);
          } catch (err) {
            throw new ServerError('Failed to create legal entity payments', { err });
          }
        } else {
          try {
            await services.legalEntity.updateLegalEntityPayment(paymentData.id, paymentData);
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
          dataloader.legalEntitiesPayments.clear(idToDelete);

          return services.legalEntity.deleteLegalEntityPayment(idToDelete);
        }))));
      } catch (err) {
        throw new ServerError('Failed to remove old payments of this legal entity', { err });
      }
    }

    // clear cache of this legal entity
    dataloader.legalEntities.clear(id);

    return { id };
  },
  create: async (parent, args: CreateArgs, context) => {
    const { input } = args;
    const { payments, ...otherInput } = input;
    const { dataloader, services } = context;
    const id = input.id || uuidv4();

    // check INN unique
    if (input.inn) {
      const { totalCount } = await services.legalEntity.getLegalEntities({
        limit: 1,
        where: [
          ['inn', '=', input.inn],
        ],
      });

      if (totalCount) {
        throw new ServerError(
          `Legal entity record already exists with inn ${input.inn} value`, { input },
        );
      }
    }


    // check OGRN unique
    // if (input.ogrn) {
    //   const { totalCount } = await services.legalEntity.getLegalEntities({
    //     limit: 1,
    //     where: [
    //       ['ogrn', '=', input.ogrn],
    //     ],
    //   });

    //   if (totalCount) {
    //     throw new ServerError(
    //       `Legal entity record already exists with ogrn ${input.ogrn} value`, { input },
    //     );
    //   }
    // }

    try {
      await services.legalEntity.createLegalEntity({
        ...services.legalEntity.getLegalEntityDefaultData(),
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
          await services.legalEntity.createLegalEntityPayment({
            ...services.legalEntity.getLegalEntityPaymentDefaultData(),
            ...paymentData,
            owner: { id },
          });
        } catch (err) {
          throw new ServerError('Failed to create legal entity payments', { err });
        }
      }, Promise.resolve());
    } catch (err) {
      throw new ServerError('Failed to create legal entity payments', { err, input });
    }


    dataloader.legalEntities.clear(id);

    return { id };
  },
  delete: async (parent, args: DeleteArgs, context) => {
    const { id, ids } = args;
    const { logger, token, services, dataloader } = context;

    const toDeleteIds = []
      .concat(ids || [])
      .concat(id ? [id] : []);

    await toDeleteIds.reduce(async (prevPromise, legalEntityId) => {
      await prevPromise;
      try {
        services.legalEntity.deleteLegalEntity(legalEntityId);
        dataloader.legalEntities.clear(legalEntityId);
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
