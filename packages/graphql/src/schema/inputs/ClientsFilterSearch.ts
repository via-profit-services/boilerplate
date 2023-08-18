import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import ClientsFilterSearchField from '~/schema/enums/ClientsFilterSearchField';

const ClientsFilterSearch = new GraphQLInputObjectType({
  name: 'ClientsFilterSearch',
  fields: {
    field: { type: new GraphQLNonNull(ClientsFilterSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default ClientsFilterSearch;
