import { GraphQLEnumType } from 'graphql';

const ClientsOrderField = new GraphQLEnumType({
  name: 'ClientsOrderField',
  values: {
    NAME: { value: 'name' },
  },
});

export default ClientsOrderField;
