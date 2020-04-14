import {
  Kind, GraphQLScalarType, GraphQLError,
} from 'graphql';

const REGEXP = [
  /^04[0-9]{7}$/,
];

const isValidLegalBic = (value: string) => REGEXP.map((pattern) => new RegExp(pattern)
  .test(value))
  .reduce((prev, current) => (!!(prev || current)), false);

export default new GraphQLScalarType({
  name: 'LegalEntityBIC',
  description: 'Legal Entity BIC (Bank Identification Code)',
  serialize: (value) => {
    if (!isValidLegalBic(String(value))) {
      throw new GraphQLError(`The value ${value} is not a valid Bank Identification Code`);
    }

    return String(value);
  },
  parseValue: (value) => {
    if (!isValidLegalBic(String(value))) {
      throw new GraphQLError(`The value ${String(value)} is not a valid Bank Identification Code`);
    }

    return String(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.INT && ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only parse strings & integers but got a ${ast.kind}`,
      );
    }

    if (!isValidLegalBic(ast.value)) {
      throw new GraphQLError(`The value ${ast.value} is not a valid Bank Identification Code`);
    }

    return ast.value;
  },
});
