import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import PageSearchField from '~/schema/enums/PageSearchField';

const PagesSearch = new GraphQLInputObjectType({
  name: 'PagesSearch',
  fields: {
    field: { type: new GraphQLNonNull(PageSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default PagesSearch;
