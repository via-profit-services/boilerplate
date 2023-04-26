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
  InputSearch,
} from '@via-profit-services/core';

import DealsConnection from '~/schema/connections/DealsConnection';
import DealsOrderBy from '~/schema/inputs/DealsOrderBy';
import DealsFilterSearch from '~/schema/inputs/DealsFilterSearch';
import DealsFilter from '~/schema/inputs/DealsFilter';

type Args = {
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
  orderBy?: OrderBy | null;
  search?: InputSearch | null;
  filter?: {
    id?: string[] | null;
  } | null;
};

const list: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(DealsConnection),
  args: {
    first: { type: GraphQLInt },
    last: { type: GraphQLInt },
    after: { type: GraphQLString },
    before: { type: GraphQLString },
    orderBy: { type: new GraphQLList(new GraphQLNonNull(DealsOrderBy)) },
    search: { type: new GraphQLList(new GraphQLNonNull(DealsFilterSearch)) },
    filter: { type: DealsFilter },
  },
  resolve: async (_parent, args, context) => {
    const { services } = context;
    const filter = buildQueryFilter(args);

    try {
      const deal = await services.deals.getDeals(filter);
      const connection = buildCursorConnection(deal, 'deals');

      return connection;
    } catch (err) {
      throw new Error(`Failed to get deals list. ${err.message}`);
    }
  },
};

export default list;
