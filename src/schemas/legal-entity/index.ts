import loaders from './loaders';
import resolvers from './resolvers';
import * as typeDefs from './schema.graphql';
import LegalEntity from './service';

export * from './types';

export {
  typeDefs,
  resolvers,
  LegalEntity,
  loaders,
};
