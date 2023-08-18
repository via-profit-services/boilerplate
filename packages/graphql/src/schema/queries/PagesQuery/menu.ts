import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import { MenuConnectionProps } from 'webmenu';
import PagesMenuConnection from '~/schema/connections/PagesMenuConnection';
import PageMenuOrderBy from '~/schema/inputs/PageMenuOrderBy';
import PageMenuSearch from '~/schema/inputs/PageMenuSearch';

const menu: GraphQLFieldConfig<unknown, Context, MenuConnectionProps> = {
  type: new GraphQLNonNull(PagesMenuConnection),
  args: {
    first: { type: GraphQLInt },
    last: { type: GraphQLInt },
    after: { type: GraphQLString },
    before: { type: GraphQLString },
    search: { type: new GraphQLList(new GraphQLNonNull(PageMenuSearch)) },
    orderBy: { type: new GraphQLList(new GraphQLNonNull(PageMenuOrderBy)) },
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

    return await services.webmenu.getMenuConnection(args);
  },
};

export default menu;
