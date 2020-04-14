import { Node, DataLoader, IContext } from '@via-profit-services/core';
import { ILegalEntity } from './service';
interface Loaders {
    legalEntities: DataLoader<string, Node<ILegalEntity>>;
}
export default function createLoaders(context: IContext): Loaders;
export {};
