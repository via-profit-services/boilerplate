import { GraphQLEnumType } from 'graphql';

const DealsOrderField = new GraphQLEnumType({
  name: 'DealsOrderField',
  values: {
    CREATED_AT: { value: 'createdAt' },
    UPDATED_AT: { value: 'createdAt' },
  },
});

export default DealsOrderField;
