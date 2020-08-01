import { IFieldResolver } from 'graphql-tools';

import createLoaders from '../loaders';
import { Context, ILegalEntity } from '../types';

interface IParent {
  id: string;
}
interface IArgs {
  id: string;
}
type ILegalEntityProxy = Omit<ILegalEntity, 'deleted'>;

export const legalEntityResolver = new Proxy({
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
  get: (target, prop: keyof ILegalEntityProxy) => {
    const resolver: IFieldResolver<IParent, Context, IArgs> = async (parent, args, context) => {
      const { id } = parent;
      const loaders = createLoaders(context);
      const legalEntity = await loaders.legalEntities.load(id);

      return legalEntity[prop];
    };

    return resolver;
  },
});

export default legalEntityResolver;
