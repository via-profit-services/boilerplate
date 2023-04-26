import { GraphQLFieldConfig, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context, EdgeInterfaceType } from '@via-profit-services/core';

import Funnel from '~/schema/types/Funnel';

const FunnelEdge = new GraphQLObjectType({
  name: 'FunnelEdge',
  interfaces: () => [EdgeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<unknown, Context>> = {
      cursor: { type: new GraphQLNonNull(GraphQLString) },
      node: { type: new GraphQLNonNull(Funnel) },
    };

    return fields;
  },
});

export default FunnelEdge;
