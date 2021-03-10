import { ServerError } from '@via-profit-services/core';
import { CreatePaymentProps, Resolvers } from '@via-profit-services/legal-entity';
import { v4 as uuidv4 } from 'uuid';

export const legalEntityMutationResolver: Resolvers['LegalEntitiesMutation'] = {
  update: async (_parent, args, context) => {
    const { services, dataloader } = context;
    const { id, input } = args;
    const { payments, ...otherInput } = input;


    // check INN unique
    if (input.inn) {
      const { nodes } = await services.legalEntities.getLegalEntities({
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
      const { nodes } = await services.legalEntities.getLegalEntities({
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
      otherInput.id = id;
      await services.legalEntities.updateLegalEntity(id, otherInput);
      dataloader.legalEntities.clear(id);

    } catch (err) {
      throw new ServerError('Failed to update legal entity', { err, id, input });
    }

    const currentPaymentsIds: string[] = [];
    if (payments && Array.isArray(payments)) {
      const legalEntity = await dataloader.legalEntities.load(id);

      // create and update payments
      await payments.reduce(async (prev, data) => {
        await prev;

        data.id = data.id || uuidv4();

        const existsPaymentData = await dataloader.payments.load(data.id);

        const paymentData: CreatePaymentProps = {
          id: uuidv4(),
          deleted: false,
          rs: '',
          ks: '',
          bank: '',
          bic: '',
          comment: '',
          priority: 'master',
          ...data,
          // set owner permanently
          owner: id,
        };

        currentPaymentsIds.push(paymentData.id);

        if (!existsPaymentData) {
          try {
            await services.legalEntities.createLegalEntityPayment(paymentData);
            dataloader.payments.clear(paymentData.id);
          } catch (err) {
            throw new ServerError('Failed to create legal entity payments', { err });
          }
        } else {
          try {
            await services.legalEntities.updateLegalEntityPayment(paymentData.id, paymentData);
            dataloader.payments.clear(paymentData.id);
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
          dataloader.payments.clear(idToDelete);

          return services.legalEntities.deleteLegalEntityPayment(idToDelete);
        }))));
      } catch (err) {
        throw new ServerError('Failed to remove old payments of this legal entity', { err });
      }
    }

    // clear cache of this legal entity
    dataloader.legalEntities.clear(id);

    return { id };
  },
  create: async (parent, args, context) => {
    const { input } = args;
    const { dataloader, services } = context;
    const { payments, ...otherInput } = input;
    const id = input.id || uuidv4();

    // check INN unique
    if (input.inn) {
      const { totalCount } = await services.legalEntities.getLegalEntities({
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

    try {
      await services.legalEntities.createLegalEntity({
        ...otherInput,
        deleted: false,
        id,
      });
    } catch (err) {
      throw new ServerError('Failed to create legal entity', { err, input });
    }


    try {
      await payments.reduce(async (prev, paymentData) => {
        await prev;
        try {
          await services.legalEntities.createLegalEntityPayment({
            id: uuidv4(),
            comment: '',
            rs: '',
            ks: '',
            bic: '',
            bank: '',
            priority: 'master',
            ...paymentData,
            deleted: false,
            owner: id,
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
  delete: async (parent, args, context) => {
    const { id, ids } = args;
    const { logger } = context;
    const { services, dataloader } = context;

    const toDeleteIds = []
      .concat(ids || [])
      .concat(id ? [id] : []);

    await toDeleteIds.reduce(async (prevPromise, legalEntityId) => {
      await prevPromise;
      try {
        services.legalEntities.deleteLegalEntity(legalEntityId);
        dataloader.legalEntities.clear(legalEntityId);
        logger.server.debug(`Legal entity with id ${legalEntityId} was deleted`, {
          id: legalEntityId,
        });
      } catch (err) {
        throw new ServerError('Failed to delete legal entity', { err, id: legalEntityId });
      }
    }, Promise.resolve());


    return {
      deletedIDs: toDeleteIds,
      query: {},
    };
  },

};


export default legalEntityMutationResolver;
