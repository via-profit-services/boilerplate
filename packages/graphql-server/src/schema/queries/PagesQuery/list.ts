import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import { GetPagesConnectionProps } from 'webpages';
import PagesConnection from '~/schema/connections/PagesConnection';
import PageOrderBy from '~/schema/inputs/PageOrderBy';
import PagesSearch from '~/schema/inputs/PagesSearch';

const list: GraphQLFieldConfig<unknown, Context, GetPagesConnectionProps> = {
  type: new GraphQLNonNull(PagesConnection),
  args: {
    first: { type: GraphQLInt },
    last: { type: GraphQLInt },
    after: { type: GraphQLString },
    before: { type: GraphQLString },
    search: { type: new GraphQLList(new GraphQLNonNull(PagesSearch)) },
    orderBy: { type: new GraphQLList(new GraphQLNonNull(PageOrderBy)) },
    account: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    id: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
  },
  resolve: async (_parent, args, context) => {
    const { services } = context;
    const { first, last, before } = args;

    if (!first && !last) {
      throw new Error('Missing «first» or «last» argument. You must provide one of the argument');
    }

    if (first && last) {
      throw new Error('Got «first» and «last» arguments. You must provide one of the argument');
    }

    if (last && !before) {
      throw new Error('Missing «before» argument. You must provide cursor value');
    }

    if (typeof first === 'number' && first < 0) {
      throw new Error('Argument «first» must be a positive integer value');
    }

    if (typeof last === 'number' && last < 0) {
      throw new Error('Argument «last» must be a positive integer value');
    }

    return await services.webpages.getPagesConnection(args);
  },
};

export default list;
