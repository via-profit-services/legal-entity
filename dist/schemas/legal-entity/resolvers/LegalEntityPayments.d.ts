import { IObjectTypeResolver } from '@via-profit-services/core';
import { Context } from '../types';
interface IParent {
    id: string;
}
export declare const legalEntityPaymentResolver: IObjectTypeResolver<IParent, Context, any>;
export default legalEntityPaymentResolver;
