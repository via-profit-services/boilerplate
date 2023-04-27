import { GraphQLObjectType } from 'graphql';

import blocks from '~/schema/queries/PagesQuery/blocks';
import list from '~/schema/queries/PagesQuery/list';
import menu from '~/schema/queries/PagesQuery/menu';
import menuItems from '~/schema/queries/PagesQuery/menuItems';
import resolve from '~/schema/queries/PagesQuery/resolve';

const PagesQuery = new GraphQLObjectType({
  name: 'PagesQuery',
  fields: () => ({
    blocks,
    list,
    menu,
    menuItems,
    resolve,
  }),
});

export default PagesQuery;
