import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import PageMenuItemSearchField from '~/schema/enums/PageMenuItemSearchField';

const PageMenuItemSearch = new GraphQLInputObjectType({
  name: 'PageMenuItemSearch',
  fields: {
    field: { type: new GraphQLNonNull(PageMenuItemSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default PageMenuItemSearch;
