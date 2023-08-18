import { GraphQLEnumType } from 'graphql';

const AccountStatus = new GraphQLEnumType({
  name: 'AccountStatus',
  values: {
    ALLOWED: { value: 'allowed' },
    FORBIDDEN: { value: 'forbidden' },
  },
});

export default AccountStatus;
