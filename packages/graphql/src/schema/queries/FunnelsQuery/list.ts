import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  Context,
  OrderBy,
  buildCursorConnection,
  buildQueryFilter,
} from '@via-profit-services/core';

import FunnelsConnection from '~/schema/connections/FunnelsConnection';
import FunnelsOrderBy from '~/schema/inputs/FunnelsOrderBy';
import FunnelsFilterSearch from '~/schema/inputs/FunnelsFilterSearch';
import FunnelFilter from '~/schema/inputs/FunnelsFilter';

type Args = {
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
  orderBy?: OrderBy | null;
  search?:
    | {
        field: 'label';
        query: string;
      }[]
    | null;
  filter?: {
    id?: string[] | null;
  } | null;
};

const list: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(FunnelsConnection),
  args: {
    first: { type: GraphQLInt },
    last: { type: GraphQLInt },
    after: { type: GraphQLString },
    before: { type: GraphQLString },
    orderBy: { type: new GraphQLList(new GraphQLNonNull(FunnelsOrderBy)) },
    search: { type: new GraphQLList(new GraphQLNonNull(FunnelsFilterSearch)) },
    filter: { type: FunnelFilter },
  },
  resolve: async (_parent, args, context) => {
    const { services } = context;
    const filter = buildQueryFilter(args);

    try {
      const funnel = await services.deals.getFunnels(filter);
      const connection = buildCursorConnection(funnel, 'funnels');

      return connection;
    } catch (err) {
      throw new Error(`Failed to get funnels list. ${err.message}`);
    }
  },
};

export default list;
