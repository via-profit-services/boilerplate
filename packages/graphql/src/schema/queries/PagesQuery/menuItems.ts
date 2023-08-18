import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import { MenuItemConnectionProps } from 'webmenu';
import PagesMenuItemsConnection from '~/schema/connections/PagesMenuItemsConnection';
import PageMenuItemOrderBy from '~/schema/inputs/PageMenuItemOrderBy';
import PageMenuItemSearch from '~/schema/inputs/PageMenuItemSearch';

const menuItems: GraphQLFieldConfig<unknown, Context, MenuItemConnectionProps> = {
  type: new GraphQLNonNull(PagesMenuItemsConnection),
  args: {
    first: { type: GraphQLInt },
    last: { type: GraphQLInt },
    after: { type: GraphQLString },
    before: { type: GraphQLString },
    search: { type: new GraphQLList(new GraphQLNonNull(PageMenuItemSearch)) },
    orderBy: { type: new GraphQLList(new GraphQLNonNull(PageMenuItemOrderBy)) },
    menu: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    pid: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    page: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    id: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
  },
  resolve: async (_parent, args, context) => {
    const { services } = context;
    const { first, last, before, pid, firstChildOnly } = args;

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

    if (typeof pid === 'object' && typeof firstChildOnly === 'boolean') {
      throw new Error(
        'Got «pid» and «firstChildOnly» arguments. You must provide one of the argument',
      );
    }

    return await services.webmenu.getMenuItemsConnection(args);
  },
};

export default menuItems;
