import {
  Kind, GraphQLScalarType, GraphQLError,
} from 'graphql';

const REGEXP = [
  /^[0-9]{12}$/, // Sole proprietor
  /^[0-9]{10}$/, // personal
  /^[0-9]{15}$/, // standart legal entity
  /^9909[0-9]{5}$/, // foreign legal entity
];

const isValidLegalInn = (value: string) => REGEXP.map((pattern) => new RegExp(pattern)
  .test(value))
  .reduce((prev, current) => (!!(prev || current)), false);

export default new GraphQLScalarType({
  name: 'LegalEntityINN',
  description: 'Legal Entity INN (Taxpayer Identification Number) @see https://ru.wikipedia.org/wiki/%D0%98%D0%B4%D0%B5%D0%BD%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BD%D0%BE%D0%BC%D0%B5%D1%80_%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D1%89%D0%B8%D0%BA%D0%B0',
  serialize: (value) => {
    if (!isValidLegalInn(String(value))) {
      throw new GraphQLError(`The value ${value} is not a valid Taxpayer Identification Number`);
    }

    return String(value);
  },
  parseValue: (value) => {
    if (!isValidLegalInn(String(value))) {
      throw new GraphQLError(`The value ${String(value)} is not a valid Taxpayer Identification Number`);
    }

    return String(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.INT && ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only parse strings & integers but got a: ${ast.kind}`,
      );
    }

    if (!isValidLegalInn(ast.value)) {
      throw new GraphQLError(`The value ${ast.value} is not a valid Taxpayer Identification Number`);
    }

    return ast.value;
  },
});
