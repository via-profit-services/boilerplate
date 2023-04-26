import { GraphQLEnumType } from 'graphql';

const UserOrderField = new GraphQLEnumType({
  name: 'UserOrderField',
  values: {
    NAME: { value: 'name' },
    CREATED_AT: { value: 'createdAt' },
    UPDATED_AT: { value: 'updatedAt' },
  },
});

export default UserOrderField;
