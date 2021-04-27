import type { Resolvers } from '@via-profit-services/legal-entity';

type EntityResolver = Resolvers['LegalEntity'];

export const legalEntityResolver = new Proxy<EntityResolver>({
  id: () => ({}),
  createdAt: () => ({}),
  updatedAt: () => ({}),
  label: () => ({}),
  type: () => ({}),
  entity: () => ({}),
  nameFull: () => ({}),
  nameShort: () => ({}),
  address: () => ({}),
  ogrn: () => ({}),
  kpp: () => ({}),
  inn: () => ({}),
  directorNameNominative: () => ({}),
  directorNameGenitive: () => ({}),
  directorNameShortNominative: () => ({}),
  directorNameShortGenitive: () => ({}),
  comment: () => ({}),
  payments: () => ({}),
  city: () => ({}),
}, {
  get: (_target, prop: keyof EntityResolver) => {
    const resolver: EntityResolver[keyof EntityResolver] = async (
      parent, _args, context) => {
      const { id } = parent;
      const { dataloader } = context;

      const legalEntity = await dataloader.legalEntities.load(id);

      return legalEntity[prop];
    };

    return resolver;
  },
});

export default legalEntityResolver;
