import { Node, DataLoader } from '@via-profit-services/core';
import { ILegalEntity, ILegalEntityPayment, Context } from './types';
interface Loaders {
    legalEntities: DataLoader<string, Node<ILegalEntity>>;
    payments: DataLoader<string, Node<ILegalEntityPayment>>;
}
export default function createLoaders(context: Context): Loaders;
export {};
