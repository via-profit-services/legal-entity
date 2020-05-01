import { Node, DataLoader } from '@via-profit-services/core';
import { Context } from '../../context';
import { ILegalEntity } from './service';
interface Loaders {
    legalEntities: DataLoader<string, Node<ILegalEntity>>;
}
export default function createLoaders(context: Context): Loaders;
export {};
