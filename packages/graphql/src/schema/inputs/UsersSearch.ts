import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import UserSearchField from '~/schema/enums/UserSearchField';

const UsersSearch = new GraphQLInputObjectType({
  name: 'UsersSearch',
  fields: {
    field: { type: new GraphQLNonNull(UserSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default UsersSearch;
