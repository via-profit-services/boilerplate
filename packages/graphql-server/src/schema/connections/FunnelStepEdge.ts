import { GraphQLFieldConfig, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context, EdgeInterfaceType } from '@via-profit-services/core';

import FunnelStep from '~/schema/types/FunnelStep';

const FunnelStepsEdge = new GraphQLObjectType({
  name: 'FunnelStepsEdge',
  interfaces: () => [EdgeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<unknown, Context>> = {
      cursor: { type: new GraphQLNonNull(GraphQLString) },
      node: { type: new GraphQLNonNull(FunnelStep) },
    };

    return fields;
  },
});

export default FunnelStepsEdge;
