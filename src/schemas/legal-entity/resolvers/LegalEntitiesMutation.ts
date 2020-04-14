import { IContext, ServerError, TWhereAction } from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';

import createLoaders from '../loaders';
import LegalEntityService, { ILegalEntityUpdateInfo, ILegalEntityCreateInfo } from '../service';

export const legalEntityMutationResolver: IResolverObject<any, IContext> = {

  update: async (parent, args: {
    id: string;
    data: ILegalEntityUpdateInfo
  }, context) => {
    const { id, data } = args;
    const loaders = createLoaders(context);
    const legalEntityService = new LegalEntityService({ context });


    // check INN unique
    if (data.inn) {
      const { nodes } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['inn', TWhereAction.EQ, data.inn],
          ['id', TWhereAction.NEQ, id],
        ],
      });

      if (nodes.length) {
        loaders.legalEntities.prime(nodes[0].id, nodes[0]);

        if (nodes[0].id !== id) {
          throw new ServerError(
            `Legal entity record already exists with inn ${data.inn} value`, { id, data },
          );
        }
      }
    }


    // check OGRN unique
    if (data.ogrn) {
      const { nodes } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['ogrn', TWhereAction.EQ, data.ogrn],
          ['id', TWhereAction.NEQ, id],
        ],
      });

      if (nodes.length) {
        loaders.legalEntities.prime(nodes[0].id, nodes[0]);

        if (nodes[0].id !== id) {
          throw new ServerError(
            `Legal entity record already exists with ogrn ${data.ogrn} value`, { id, data },
          );
        }
      }
    }


    try {
      await legalEntityService.updateLegalEntity(id, data);
    } catch (err) {
      throw new ServerError('Failed to update legal entity', { err, id, data });
    }

    // clear cache of this legal entity
    loaders.legalEntities.clear(id);
    return { id };
  },
  create: async (parent, args: { data: ILegalEntityCreateInfo }, context) => {
    const { data } = args;
    const legalEntityService = new LegalEntityService({ context });

    // check INN unique
    if (data.inn) {
      const { totalCount } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['inn', TWhereAction.EQ, data.inn],
        ],
      });

      if (totalCount) {
        throw new ServerError(
          `Legal entity record already exists with inn ${data.inn} value`, { data },
        );
      }
    }


    // check OGRN unique
    if (data.ogrn) {
      const { totalCount } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['ogrn', TWhereAction.EQ, data.ogrn],
        ],
      });

      if (totalCount) {
        throw new ServerError(
          `Legal entity record already exists with ogrn ${data.ogrn} value`, { data },
        );
      }
    }

    try {
      const id = await legalEntityService.createLegalEntity(data);

      return { id };
    } catch (err) {
      throw new ServerError('Failed to create legal entity', { err, data });
    }
  },
  delete: async (parent, args: { id: string; }, context) => {
    const { id } = args;
    const legalEntityService = new LegalEntityService({ context });

    try {
      const result = legalEntityService.deleteLegalEntity(id);
      return result;
    } catch (err) {
      throw new ServerError('Failed to delete legal entity', { err, id });
    }
  },

};


export default legalEntityMutationResolver;
