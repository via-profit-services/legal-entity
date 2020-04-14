import {
  Kind, GraphQLScalarType, GraphQLError,
} from 'graphql';

const REGEXP = [
  /^[0-9]{9}$/,
];

const isValidLegalKpp = (value: string) => REGEXP.map((pattern) => new RegExp(pattern)
  .test(value))
  .reduce((prev, current) => (!!(prev || current)), false);

export default new GraphQLScalarType({
  name: 'LegalEntityKPP',
  description: 'Legal Entity KPP (Code of the reason for registration)',
  serialize: (value) => {
    if (!isValidLegalKpp(String(value))) {
      throw new GraphQLError(`The value ${value} is not a valid Code of the reason for registration`);
    }

    return String(value);
  },
  parseValue: (value) => {
    if (!isValidLegalKpp(String(value))) {
      throw new GraphQLError(`The value ${String(value)} is not a valid Code of the reason for registration`);
    }

    return String(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.INT && ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only parse strings & integers but got a: ${ast.kind}`,
      );
    }

    if (!isValidLegalKpp(ast.value)) {
      throw new GraphQLError(`The value ${ast.value} is not a valid Code of the reason for registration`);
    }

    return ast.value;
  },
});
