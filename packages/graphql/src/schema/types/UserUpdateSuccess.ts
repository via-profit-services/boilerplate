import { GraphQLNonNull, GraphQLObjectType } from 'graphql';

import User from '~/schema/types/User';
import Query from '~/schema/queries/Query';

const UserUpdateSuccess = new GraphQLObjectType({
  name: 'UserUpdateSuccess',
  fields: {
    user: { type: new GraphQLNonNull(User) },
    query: {
      type: new GraphQLNonNull(Query),
      resolve: () => ({}),
    },
  },
});

export default UserUpdateSuccess;
