import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import AuthentificationQuery from '~/schema/queries/AuthentificationQuery';
import ClientsQuery from '~/schema/queries/ClientsQuery';
import DealsQuery from '~/schema/queries/DealsQuery';
import FilesQuery from '~/schema/queries/FilesQuery';
import FunnelsQuery from '~/schema/queries/FunnelsQuery';
import UsersQuery from '~/schema/queries/UsersQuery';
import PagesQuery from '~/schema/queries/PagesQuery';
import BlogQuery from '~/schema/queries/BlogQuery';
import me from '~/schema/queries/Query/me';
import node from '~/schema/queries/Query/node';
import version from '~/schema/queries/Query/version';

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
    version,
    me,
    node,
  }),
});

export default Query;
