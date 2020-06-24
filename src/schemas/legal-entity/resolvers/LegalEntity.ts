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
  name: () => ({}),
  address: () => ({}),
  ogrn: () => ({}),
  kpp: () => ({}),
  inn: () => ({}),
  rs: () => ({}),
  ks: () => ({}),
  bic: () => ({}),
  bank: () => ({}),
  directorNameNominative: () => ({}),
  directorNameGenitive: () => ({}),
  directorNameShortNominative: () => ({}),
  directorNameShortGenitive: () => ({}),
  comment: () => ({}),
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
