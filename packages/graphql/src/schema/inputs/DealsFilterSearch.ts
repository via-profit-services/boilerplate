import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import DealsFilterSearchField from '~/schema/enums/DealsFilterSearchField';

const DealsFilterSearch = new GraphQLInputObjectType({
  name: 'DealsFilterSearch',
  fields: {
    field: { type: new GraphQLNonNull(DealsFilterSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default DealsFilterSearch;
