import { IContext } from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';
export declare const queryResolver: IResolverObject<any, Pick<IContext, 'knex' | 'timezone'>>;
export default queryResolver;
