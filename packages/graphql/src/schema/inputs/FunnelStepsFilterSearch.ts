import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import FunnelStepsFilterSearchField from '~/schema/enums/FunnelStepsFilterSearchField';

const FunnelStepsFilterSearch = new GraphQLInputObjectType({
  name: 'FunnelStepsFilterSearch',
  fields: {
    field: { type: new GraphQLNonNull(FunnelStepsFilterSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default FunnelStepsFilterSearch;
