import { GraphQLFieldConfig, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context, EdgeInterfaceType } from '@via-profit-services/core';

import Deal from '~/schema/types/Deal';

const DealEdge = new GraphQLObjectType({
  name: 'DealEdge',
  interfaces: () => [EdgeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<unknown, Context>> = {
      cursor: { type: new GraphQLNonNull(GraphQLString) },
      node: { type: new GraphQLNonNull(Deal) },
    };

    return fields;
  },
});

export default DealEdge;
