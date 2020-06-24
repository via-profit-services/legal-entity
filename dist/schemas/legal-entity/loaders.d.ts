import { Node, DataLoader } from '@via-profit-services/core';
import { ILegalEntity, Context } from './types';
interface Loaders {
    legalEntities: DataLoader<string, Node<ILegalEntity>>;
}
export default function createLoaders(context: Context): Loaders;
export {};
