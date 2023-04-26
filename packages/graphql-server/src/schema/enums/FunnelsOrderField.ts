import { GraphQLEnumType } from 'graphql';

const FunnelsOrderField = new GraphQLEnumType({
  name: 'FunnelsOrderField',
  values: {
    CREATED_AT: { value: 'createdAt' },
  },
});

export default FunnelsOrderField;
