import { GraphQLEnumType } from 'graphql';

const TokenType = new GraphQLEnumType({
  name: 'TokenType',
  values: {
    ACCESS: {
      value: 'access',
      description: 'Access token type',
    },
    REFRESH: {
      value: 'refresh',
      description: 'Refresh token type',
    },
  },
});

export default TokenType;
