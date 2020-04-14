import {
  Kind, GraphQLScalarType, GraphQLError,
} from 'graphql';

const REGEXP = [
  /^[0-9]{20}$/,
];

const isValidLegalRs = (value: string) => REGEXP.map((pattern) => new RegExp(pattern)
  .test(value))
  .reduce((prev, current) => (!!(prev || current)), false);

export default new GraphQLScalarType({
  name: 'LegalEntityRS',
  description: 'Legal Entity RS (Payment account number)',
  serialize: (value) => {
    if (!isValidLegalRs(String(value))) {
      throw new GraphQLError(`The value ${value} is not a valid Payment account number`);
    }

    return String(value);
  },
  parseValue: (value) => {
    if (!isValidLegalRs(String(value))) {
      throw new GraphQLError(`The value ${String(value)} is not a valid Payment account number`);
    }

    return String(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.INT && ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only parse strings & integers but got a: ${ast.kind}`,
      );
    }

    if (!isValidLegalRs(ast.value)) {
      throw new GraphQLError(`The value ${ast.value} is not a valid Payment account number`);
    }

    return ast.value;
  },
});
