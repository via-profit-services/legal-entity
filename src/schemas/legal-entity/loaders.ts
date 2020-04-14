import { Node, DataLoader, IContext } from '@via-profit-services/core';
import LegalEntityService, { ILegalEntity } from './service';


interface Loaders {
  legalEntities: DataLoader<string, Node<ILegalEntity>>;
}

const loaders: Loaders = {
  legalEntities: null,
};

export default function createLoaders(context: IContext) {
  if (loaders.legalEntities !== null) {
    return loaders;
  }

  const service = new LegalEntityService({ context });

  loaders.legalEntities = new DataLoader<
    string, Node<ILegalEntity>
    >((ids: string[]) => service.getLegalEntitiesByIds(ids));

  return loaders;
}
