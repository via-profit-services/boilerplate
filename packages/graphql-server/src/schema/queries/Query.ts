import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import Me from '~/schema/unions/Me';
import AuthentificationQuery from '~/schema/queries/AuthentificationQuery';
import ClientsQuery from '~/schema/queries/ClientsQuery';
import DealsQuery from '~/schema/queries/DealsQuery';
import FilesQuery from '~/schema/queries/FilesQuery';
import FunnelsQuery from '~/schema/queries/FunnelsQuery';
import UsersQuery from '~/schema/queries/UsersQuery';
import PagesQuery from '~/schema/queries/PagesQuery';
import BlogQuery from '~/schema/queries/BlogQuery';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    authentification: { type: new GraphQLNonNull(AuthentificationQuery), resolve: () => ({}) },
    clients: { type: new GraphQLNonNull(ClientsQuery), resolve: () => ({}) },
    deals: { type: new GraphQLNonNull(DealsQuery), resolve: () => ({}) },
    files: { type: new GraphQLNonNull(FilesQuery), resolve: () => ({}) },
    funnels: { type: new GraphQLNonNull(FunnelsQuery), resolve: () => ({}) },
    users: { type: new GraphQLNonNull(UsersQuery), resolve: () => ({}) },
    pages: { type: new GraphQLNonNull(PagesQuery), resolve: () => ({}) },
    blog: { type: new GraphQLNonNull(BlogQuery), resolve: () => ({}) },
    version: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => process.env.WEBPACK_INJECT_APP_VERSION || '',
    },
    me: {
      type: new GraphQLNonNull(Me),
      resolve: async (_parent, _args, context) => {
        const { dataloader, token } = context;

        if (token.uuid) {
          const user = await dataloader.users.load(token.uuid);

          return {
            __typename: 'User',
            ...user,
          };
        }

        return null;
      },
    },
  }),
});

export default Query;
