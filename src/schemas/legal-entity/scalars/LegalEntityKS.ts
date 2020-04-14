import {
  Kind, GraphQLScalarType, GraphQLError,
} from 'graphql';

const REGEXP = [
  /^[0-9]{20}$/,
];

const isValidLegalKs = (value: string) => REGEXP.map((pattern) => new RegExp(pattern)
  .test(value))
  .reduce((prev, current) => (!!(prev || current)), false);

export default new GraphQLScalarType({
  name: 'LegalEntityKS',
  description: 'Legal Entity KS (Correspondent account number)',
  serialize: (value) => {
    if (!isValidLegalKs(String(value))) {
      throw new GraphQLError(`The value ${value} is not a valid Correspondent account number`);
    }

    return String(value);
  },
  parseValue: (value) => {
    if (!isValidLegalKs(String(value))) {
      throw new GraphQLError(`The value ${String(value)} is not a valid Correspondent account number`);
    }

    return String(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.INT && ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only parse strings & integers but got a: ${ast.kind}`,
      );
    }

    if (!isValidLegalKs(ast.value)) {
      throw new GraphQLError(`The value ${ast.value} is not a valid Correspondent account number`);
    }

    return ast.value;
  },
});
