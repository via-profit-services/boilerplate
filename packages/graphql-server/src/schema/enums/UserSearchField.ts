import { GraphQLEnumType } from 'graphql';

const UserSearchField = new GraphQLEnumType({
  name: 'UserSearchField',
  values: {
    NAME: { value: 'name' },
  },
});

export default UserSearchField;
