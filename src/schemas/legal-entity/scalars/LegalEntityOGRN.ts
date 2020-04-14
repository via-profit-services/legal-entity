import {
  Kind, GraphQLScalarType, GraphQLError,
} from 'graphql';

const REGEXP = [
  /^[0-9]{13}$/, // LLC
  /^[0-9]{15}$/, // Individual
];

const isValidLegalOgrn = (value: string) => REGEXP.map((pattern) => new RegExp(pattern)
  .test(value))
  .reduce((prev, current) => (!!(prev || current)), false);

export default new GraphQLScalarType({
  name: 'LegalEntityOGRN',
  description: 'Legal Entity OGRN (Main state registration number)',
  serialize: (value) => {
    if (!isValidLegalOgrn(String(value))) {
      throw new GraphQLError(`The value ${value} is not a valid Main state registration number`);
    }

    return String(value);
  },
  parseValue: (value) => {
    if (!isValidLegalOgrn(String(value))) {
      throw new GraphQLError(`The value ${String(value)} is not a valid Main state registration number`);
    }

    return String(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.INT && ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only parse strings & integers but got a: ${ast.kind}`,
      );
    }

    if (!isValidLegalOgrn(ast.value)) {
      throw new GraphQLError(`The value ${ast.value} is not a valid Main state registration number`);
    }

    return ast.value;
  },
});
