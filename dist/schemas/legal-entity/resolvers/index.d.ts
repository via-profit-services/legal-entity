import { IContext } from '@via-profit-services/core';
import { IResolvers } from 'graphql-tools';
declare const resolvers: IResolvers<any, Pick<IContext, 'knex' | 'timezone'>>;
export default resolvers;
