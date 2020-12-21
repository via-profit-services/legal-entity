import { IObjectTypeResolver, IFieldResolver } from '@graphql-tools/utils';
import { Context } from '@via-profit-services/core';
import { LegalEntity } from '@via-profit-services/legal-entity';


interface Parent {
  id: string;
}
interface Args {
  id: string;
}
type LegalEntityProxy = Omit<LegalEntity, 'deleted'>;

export const legalEntityResolver:IObjectTypeResolver<Parent, Context, any> = new Proxy({
  id: () => ({}),
  createdAt: () => ({}),
  updatedAt: () => ({}),
  label: () => ({}),
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
  deleted: () => ({}),
}, {
  get: (target, prop: keyof LegalEntityProxy) => {
    const resolver: IFieldResolver<Parent, Context, Args> = async (
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
