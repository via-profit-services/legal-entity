import { IFieldResolver } from 'graphql-tools';

import { Context, ILegalEntityExternalSearchResult } from '../types';

type IParent = ILegalEntityExternalSearchResult;

export const legalEntityExternalSearchResultResolver = new Proxy({
  name: () => ({}),
  address: () => ({}),
  ogrn: () => ({}),
  kpp: () => ({}),
  inn: () => ({}),
}, {
  get: (target, prop: keyof ILegalEntityExternalSearchResult) => {
    const resolver: IFieldResolver<IParent, Context> = async (parent) => {
      return parent[prop];
    };

    return resolver;
  },
});

export default legalEntityExternalSearchResultResolver;
