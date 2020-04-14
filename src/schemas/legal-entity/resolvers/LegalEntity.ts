import { IContext } from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';

import createLoaders from '../loaders';
import { ILegalEntity } from '../service';


export const legalEntityResolver: IResolverObject<Pick<ILegalEntity, 'id'>, IContext> = {

  createdAt: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.createdAt;
  },
  updatedAt: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.updatedAt;
  },
  name: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.name;
  },
  address: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.address;
  },
  ogrn: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.ogrn;
  },
  kpp: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.kpp;
  },
  inn: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.inn;
  },
  rs: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.rs;
  },
  ks: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.ks;
  },
  bic: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.bic;
  },
  bank: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.bank;
  },
  directorNameNominative: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.directorNameNominative;
  },
  directorNameGenitive: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.directorNameGenitive;
  },
};

export default legalEntityResolver;
