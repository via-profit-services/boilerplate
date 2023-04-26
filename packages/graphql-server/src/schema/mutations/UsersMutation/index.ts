import { GraphQLObjectType } from 'graphql';

import update from '~/schema/mutations/UsersMutation/update';

const UsersMutation = new GraphQLObjectType({
  name: 'UsersMutation',
  fields: () => ({
    update,
  }),
});

export default UsersMutation;
