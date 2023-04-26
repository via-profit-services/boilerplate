import { GraphQLObjectType } from 'graphql';

import client from '~/schema/queries/ClientsQuery/client';
import list from '~/schema/queries/ClientsQuery/list';

const ClientsQuery = new GraphQLObjectType({
  name: 'ClientsQuery',
  fields: () => ({
    client,
    list,
  }),
});

export default ClientsQuery;
