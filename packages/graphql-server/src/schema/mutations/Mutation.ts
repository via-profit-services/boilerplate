import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from '@via-profit-services/core';

import AuthentificationMutation from '~/schema/mutations/AuthentificationMutation';
import UsersMutation from '~/schema/mutations/UsersMutation';
import PagesMutation from '~/schema/mutations/PagesMutation';

const Mutation = new GraphQLObjectType<unknown, Context>({
  name: 'Mutation',
  fields: () => ({
    authentification: { type: new GraphQLNonNull(AuthentificationMutation), resolve: () => ({}) },
    users: { type: new GraphQLNonNull(UsersMutation), resolve: () => ({}) },
    pages: { type: new GraphQLNonNull(PagesMutation), resolve: () => ({}) },
  }),
});

export default Mutation;
