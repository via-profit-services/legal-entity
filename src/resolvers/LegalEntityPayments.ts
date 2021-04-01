import type { Resolvers } from '@via-profit-services/legal-entity';

type PaymentResolver = Resolvers['LegalEntityPayments'];

export const legalEntityPaymentResolver = new Proxy<PaymentResolver>({
  id: () => ({}),
  createdAt: () => ({}),
  updatedAt: () => ({}),
  owner: () => ({}),
  rs: () => ({}),
  ks: () => ({}),
  bic: () => ({}),
  bank: () => ({}),
  priority: () => ({}),
  comment: () => ({}),
}, {
  get: (_target, prop: keyof PaymentResolver) => {
    const resolver: PaymentResolver[keyof PaymentResolver] = async (parent, _args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const payment = await dataloader.payments.load(id);

      return payment[prop];
    };

    return resolver;
  },
});

export default legalEntityPaymentResolver;
