import { IFieldResolver } from '@graphql-tools/utils';
import { ServerError, buildCursorConnection, buildQueryFilter, InputFilter, Context } from '@via-profit-services/core';


const listResolver: IFieldResolver<
unknown, Context, InputFilter> = async (_parent, args, context) => {
  const { dataloader, services } = context;
  const filter = buildQueryFilter(args);

  filter.where.push(['deleted', '=', false]);

  try {
    const legalEntitiesConnection = await services.legalEntity.getLegalEntities(filter);
    const connection = buildCursorConnection(legalEntitiesConnection, 'legalEntities');

    // fill the cache
    legalEntitiesConnection.nodes.forEach((node) => {
      dataloader.legalEntities
        .clear(node.id)
        .prime(node.id, node);
    });

    return connection;
  } catch (err) {
    throw new ServerError('Failed to get LegalEntities list', { err });
  }
}

const getResolver: IFieldResolver<
unknown, Context, {id: string}> = async (_parnt, args, context) => {
  const { id } = args;
  const { dataloader } = context;
  const legalEntity = await dataloader.legalEntities.load(id);

  return legalEntity || null;
}

const externalSearchResolver: IFieldResolver<
unknown, Context, {id: string}> = (_parent, args) => args;


export default {
  list: listResolver,
  get: getResolver,
  externalSearch: externalSearchResolver,
};
