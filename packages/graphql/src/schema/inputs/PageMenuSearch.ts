import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import PageMenuSearchField from '~/schema/enums/PageMenuSearchField';

const PageMenuSearch = new GraphQLInputObjectType({
  name: 'PageMenuSearch',
  fields: {
    field: { type: new GraphQLNonNull(PageMenuSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default PageMenuSearch;
