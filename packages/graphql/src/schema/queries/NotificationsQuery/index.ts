import { GraphQLObjectType } from 'graphql';

import list from '~/schema/queries/NotificationsQuery/list';
import unreaded from '~/schema/queries/NotificationsQuery/unreaded';

const NotificationsQuery = new GraphQLObjectType({
  name: 'NotificationsQuery',
  fields: () => ({
    list,
    unreaded,
  }),
});

export default NotificationsQuery;
