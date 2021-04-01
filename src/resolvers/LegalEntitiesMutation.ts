import { ServerError } from '@via-profit-services/core';
import { Resolvers, ReplaceEntityPaymentsProps, ReplaceEntityProps } from '@via-profit-services/legal-entity';

export const legalEntityMutationResolver: Resolvers['LegalEntitiesMutation'] = {
  replace: async (_parent, args, context) => {
    const { entity, input } = args;
    const { dataloader, services } = context;

    const paymentsMap: Record<string, ReplaceEntityPaymentsProps[]> = {};
    const inputWithoutPayments: ReplaceEntityProps[] = [];
    input.map(({ payments, ...entityData }) => {
      inputWithoutPayments.push(entityData);
      paymentsMap[entityData.id] = payments;
    });

    try {
      const { affected, persistens } = await services.legalEntities.replaceEntities(
        entity,
        inputWithoutPayments,
      );
      affected.forEach((id) => {
        dataloader.legalEntities.clear(id);
      });

      // replace payments
      await Promise.all(
        Object.entries(paymentsMap)
          .map(([owner, payments]) => services.legalEntities.replacePayments(owner, payments)),
      );

      return persistens.map((id) => ({ id }));

    } catch (err) {
      throw new ServerError('Failed to replace legal entities', { err });
    }
  },
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

    try {
      await services.legalEntities.updateLegalEntity(id, legalEntityInput);
    } catch (err) {
      throw new ServerError('Failed to update legal entity', { err });
    }

    // update (replace) payments
    if (payments) {
      await services.legalEntities.replacePayments(id, payments);
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
