import {
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import {
  Context,
  DateTimeScalarType,
  NodeInterfaceType,
  URLScalarType,
} from '@via-profit-services/core';

import PageWindowTarget from '~/schema/enums/PageWindowTarget';
import Page from '~/schema/types/Page';
import PageMenu from '~/schema/types/PageMenu';
import { Page as PageType, PageWindowTarget as Target } from 'webpages';
import { MenuItem as Parent } from 'webmenu';

interface Resolver {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly parent: Resolver | null;
  readonly menu: string;
  readonly page: PageType | null;
  readonly url: string | null;
  readonly visible: boolean;
  readonly order: number;
  readonly target: Target;
  readonly childs: Resolver[] | null;
}

const PageMenuItem = new GraphQLObjectType<Parent, Context>({
  name: 'PageMenuItem',
  interfaces: [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Resolver, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      order: { type: new GraphQLNonNull(GraphQLInt) },
      visible: { type: new GraphQLNonNull(GraphQLBoolean) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      target: { type: new GraphQLNonNull(PageWindowTarget) },
      url: { type: URLScalarType },
      name: { type: GraphQLString },
      parent: {
        type: PageMenuItem,
        resolve: async (parent, _args, context) => {
          const { pid } = parent;
          const { dataloader } = context;
          if (!pid) {
            return null;
          }

          return await dataloader.menuItems.load(pid);
        },
      },
      menu: {
        type: PageMenu,
        resolve: async (parent, _args, context) => {
          const { menu } = parent;
          const { dataloader } = context;

          return await dataloader.menus.load(menu);
        },
      },
      page: {
        type: Page,
        resolve: async (parent, _args, context) => {
          const { dataloader } = context;
          const { page } = parent;
          if (!page) {
            return null;
          }

          return await dataloader.webpages.load(page);
        },
      },
      childs: {
        type: new GraphQLList(new GraphQLNonNull(PageMenuItem)),
        resolve: async (parent, _args, context) => {
          const { childs } = parent;
          const { dataloader } = context;
          if (!childs) {
            return null;
          }

          const childsList = await dataloader.menuItems.loadMany(childs);

          childsList.sort((a, b) => {
            if (a instanceof Error || b instanceof Error) {
              return 0;
            }

            if (a.order < b.order) {
              return -1;
            }

            if (a.order > b.order) {
              return 1;
            }

            return 0;
          });

          return childsList;
        },
      },
    };

    return fields;
  },
});

export default PageMenuItem;
