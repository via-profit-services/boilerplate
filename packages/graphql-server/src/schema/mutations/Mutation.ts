import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from '@via-profit-services/core';

import AuthentificationMutation from '~/schema/mutations/AuthentificationMutation';
import UsersMutation from '~/schema/mutations/UsersMutation';
import PagesMutation from '~/schema/mutations/PagesMutation';

const Mutation = new GraphQLObjectType<unknown, Context>({
  name: 'Mutation',
  fields: () => ({
    authentification: {
      type: new GraphQLNonNull(AuthentificationMutation),
      resolve: () => ({}),
      description: 'Create and refresh token and more auth actions',
    },
    users: {
      type: new GraphQLNonNull(UsersMutation),
      resolve: () => ({}),
      description: 'User profile mutations',
    },
    pages: {
      type: new GraphQLNonNull(PagesMutation),
      resolve: () => ({}),
      description: 'Actions for public website data',
    },
  }),
});

export default Mutation;
