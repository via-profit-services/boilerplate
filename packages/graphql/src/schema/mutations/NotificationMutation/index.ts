import { GraphQLObjectType } from 'graphql';

import create from '~/schema/mutations/NotificationMutation/create';
import markAllAsRead from '~/schema/mutations/NotificationMutation/markAllAsRead';
import setStatus from '~/schema/mutations/NotificationMutation/setStatus';

const NotificationMutation = new GraphQLObjectType({
  name: 'NotificationMutation',
  fields: () => ({
    create,
    markAllAsRead,
    setStatus,
  }),
});

export default NotificationMutation;
