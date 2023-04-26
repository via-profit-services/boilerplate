import { GraphQLEnumType } from 'graphql';

const ClientStatus = new GraphQLEnumType({
  name: 'ClientStatus',
  values: {
    ACTIVE: { value: 'active' },
    INACTIVE: { value: 'inactive' },
  },
});

export default ClientStatus;
