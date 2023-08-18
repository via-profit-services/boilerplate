import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import FunnelStepEdge from '~/schema/connections/FunnelStepEdge';

const FunnelStepsConnection = new GraphQLObjectType({
  name: 'FunnelStepsConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(FunnelStepEdge))) },
  }),
});

export default FunnelStepsConnection;
