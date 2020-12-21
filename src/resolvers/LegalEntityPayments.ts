import { IObjectTypeResolver, IFieldResolver } from '@graphql-tools/utils';
import { Context } from '@via-profit-services/core';
import { LegalEntityPayment } from '@via-profit-services/legal-entity';

interface Parent {
  id: string;
}
interface Args {
  id: string;
}
type LegalEntityProxy = Omit<LegalEntityPayment, 'deleted'>;

export const legalEntityPaymentResolver: IObjectTypeResolver<Parent, Context, unknown> = new Proxy({
  id: () => ({}),
  owner: () => ({}),
  rs: () => ({}),
  ks: () => ({}),
  bic: () => ({}),
  bank: () => ({}),
  priority: () => ({}),
  comment: () => ({}),
}, {
  get: (target, prop: keyof LegalEntityProxy) => {
    const resolver: IFieldResolver<Parent, Context, Args> = async (parent, args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const payment = await dataloader.legalEntitiesPayments.load(id);

      return payment[prop];
    };

    return resolver;
  },
});

export default legalEntityPaymentResolver;
