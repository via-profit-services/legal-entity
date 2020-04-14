import { IContext } from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';
import { ILegalEntity } from '../service';
export declare const legalEntityResolver: IResolverObject<Pick<ILegalEntity, 'id'>, IContext>;
export default legalEntityResolver;
