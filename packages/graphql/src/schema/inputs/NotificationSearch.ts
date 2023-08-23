import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import NotificationSearchField from '~/schema/enums/NotificationSearchField';

const NotificationSearch = new GraphQLInputObjectType({
  name: 'NotificationSearch',
  fields: () => ({
    field: { type: new GraphQLNonNull(NotificationSearchField) },
    query: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default NotificationSearch;
