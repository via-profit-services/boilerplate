import {
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { Context, DateTimeScalarType, NodeInterfaceType } from '@via-profit-services/core';

import PageMenuItem from '~/schema/types/PageMenuItem';
import { Menu as Parent } from 'webmenu';

interface Resolver {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly items: any;
}

const PageMenu = new GraphQLObjectType<Parent, Context>({
  name: 'PageMenu',
  interfaces: [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Resolver, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      items: {
        type: new GraphQLList(new GraphQLNonNull(PageMenuItem)),
        resolve: async (parent, _args, context) => {
          const { services } = context;
          const { id } = parent;

          const { edges } = await services.webmenu.getMenuItemsConnection({
            menu: [id],
            first: Number.MAX_SAFE_INTEGER,
            firstChildOnly: true,
            orderBy: [
              {
                field: 'order',
                direction: 'asc',
              },
            ],
          });

          return edges.length ? edges.map(({ node }) => node) : null;
        },
      },
    };

    return fields;
  },
});

export default PageMenu;
