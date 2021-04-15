import { ServerError } from '@via-profit-services/core';
import { Resolvers } from '@via-profit-services/legal-entity';

export const legalEntityMutationResolver: Resolvers['LegalEntitiesMutation'] = {

  create: async (_parent, args, context) => {
    const { services, dataloader } = context;
    const { input } = args;
    const { payments, ...legalEntityInput } = input;

    try {
      // create legal entity
      const id = await services.legalEntities.createLegalEntity(legalEntityInput);
      dataloader.legalEntities.clear(id);

      // create payments
      await Promise.all(
        payments.map((paymentInput) => services.legalEntities.createLegalEntityPayment({
          owner: id,
          ...paymentInput,
        })),
      );

      return { id };

    } catch (err) {
      throw new ServerError('Failed to create legal entity', { err });
    }
  },
  update: async (_parent, args, context) => {
    const { dataloader, services } = context;
    const { id, input } = args;
    const { payments, ...legalEntityInput } = input;

    // check to exist
    const currentEntity = await dataloader.legalEntities.load(id);
    if (!currentEntity) {
      throw new ServerError('Legal entity not found');
    }

    const currentPaymentIDs = currentEntity.payments.map(({ id }) => id);

    try {
      const persistensPaymentIDs = await services.legalEntities.createOrUpdatePayments(payments.map((payment) => ({
        ...payment,
        owner: id,
      })));

      const iDsToRemove = currentPaymentIDs.filter((currentID) => !persistensPaymentIDs.includes(currentID))
      if (persistensPaymentIDs.length) {
        await services.legalEntities.deleteLegalEntityPayments(iDsToRemove);
      }
      
    } catch (err) {
      throw new ServerError('Failed to update legal entity payments', { err });
    }
    
    try {
      await services.legalEntities.updateLegalEntity(id, legalEntityInput);
    } catch (err) {
      throw new ServerError('Failed to update legal entity', { err });
    }

    dataloader.legalEntities.clear(id);

    return { id };
  },
  delete: async (_parent, args, context) => {
    const { services, dataloader } = context;
    const { id, ids } = args;

    const deletedIDs = [
      ...ids || [],
      ...(id ? [id] : []),
    ];

    try {
      await services.legalEntities.deleteLegalEntities(deletedIDs);

      deletedIDs.forEach((id) => {
        dataloader.legalEntities.clear(id);
      });

      return {
        deletedIDs,
        query: {},
      };

    } catch (err) {
      throw new ServerError('Failed to remove legal entities', { ids: deletedIDs, err });
    }
  },
};


export default legalEntityMutationResolver;
