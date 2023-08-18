import { GraphQLEnumType } from 'graphql';

const ClientsFilterSearchField = new GraphQLEnumType({
  name: 'ClientsFilterSearchField',
  values: {
    NAME: { value: 'name' },
    COMMENT: { value: 'comment' },
  },
});

export default ClientsFilterSearchField;
