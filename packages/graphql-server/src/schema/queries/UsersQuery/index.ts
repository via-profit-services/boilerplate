import { GraphQLObjectType } from 'graphql';

import list from '~/schema/queries/UsersQuery/list';
import user from '~/schema/queries/UsersQuery/user';

const UsersQuery = new GraphQLObjectType({
  name: 'UsersQuery',
  fields: () => ({
    list,
    user,
  }),
});

export default UsersQuery;
