import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import AuthentificationQuery from '~/schema/queries/AuthentificationQuery';
import ClientsQuery from '~/schema/queries/ClientsQuery';
import FilesQuery from '~/schema/queries/FilesQuery';
import UsersQuery from '~/schema/queries/UsersQuery';
import PagesQuery from '~/schema/queries/PagesQuery';
import BlogQuery from '~/schema/queries/BlogQuery';
import me from '~/schema/queries/Query/me';
import node from '~/schema/queries/Query/node';
import version from '~/schema/queries/Query/version';
import NotificationsQuery from '~/schema/queries/NotificationsQuery';
// import DealsQuery from '~/schema/queries/DealsQuery';
// import FunnelsQuery from '~/schema/queries/FunnelsQuery';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    // funnels: { type: new GraphQLNonNull(FunnelsQuery), resolve: () => ({}) },
    // deals: { type: new GraphQLNonNull(DealsQuery), resolve: () => ({}) },
    authentification: {
      type: new GraphQLNonNull(AuthentificationQuery),
      resolve: () => ({}),
      description: 'Token info',
    },
    clients: {
      type: new GraphQLNonNull(ClientsQuery),
      resolve: () => ({}),
      description: 'Queries of the simple clients list and client data',
    },
    files: {
      type: new GraphQLNonNull(FilesQuery),
      resolve: () => ({}),
      description: 'File storage',
    },
    users: {
      type: new GraphQLNonNull(UsersQuery),
      resolve: () => ({}),
      description: 'Users list, user data and more',
    },
    pages: {
      type: new GraphQLNonNull(PagesQuery),
      resolve: () => ({}),
      description: 'Public queries for the website render',
    },
    blog: {
      type: new GraphQLNonNull(BlogQuery),
      resolve: () => ({}),
      description: 'Queries of simple blog',
    },
    notifications: {
      type: new GraphQLNonNull(NotificationsQuery),
      resolve: () => ({}),
      description: 'Queries of users notifications',
    },
    version,
    me,
    node,
  }),
});

export default Query;
