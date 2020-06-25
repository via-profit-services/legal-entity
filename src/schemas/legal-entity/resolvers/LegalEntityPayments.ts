import { IFieldResolver } from 'graphql-tools';

import createLoaders from '../loaders';
import { Context, ILegalEntityPayment } from '../types';

interface IParent {
  id: string;
}
interface IArgs {
  id: string;
}
type ILegalEntityProxy = Omit<ILegalEntityPayment, 'deleted'>;

export const legalEntityPaymentResolver = new Proxy({
  id: () => ({}),
  owner: () => ({}),
  rs: () => ({}),
  ks: () => ({}),
  bic: () => ({}),
  bank: () => ({}),
  priority: () => ({}),
  comment: () => ({}),
}, {
  get: (target, prop: keyof ILegalEntityProxy) => {
    const resolver: IFieldResolver<IParent, Context, IArgs> = async (parent, args, context) => {
      const { id } = parent;
      const loaders = createLoaders(context);
      const payment = await loaders.payments.load(id);
      return payment[prop];
    };

    return resolver;
  },
});

export default legalEntityPaymentResolver;
