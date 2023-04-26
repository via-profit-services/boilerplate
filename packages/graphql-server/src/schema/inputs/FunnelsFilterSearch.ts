import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import FunnelsFilterSearchField from '~/schema/enums/FunnelsFilterSearchField';

const FunnelsFilterSearch = new GraphQLInputObjectType({
  name: 'FunnelsFilterSearch',
  fields: {
    field: { type: new GraphQLNonNull(FunnelsFilterSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default FunnelsFilterSearch;
