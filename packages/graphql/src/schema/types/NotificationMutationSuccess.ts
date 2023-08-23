import { GraphQLNonNull, GraphQLObjectType } from 'graphql';

import Notification from '~/schema/types/Notification';

const NotificationMutationSuccess = new GraphQLObjectType({
  name: 'NotificationMutationSuccess',
  fields: () => ({
    notification: {
      type: new GraphQLNonNull(Notification),
    },
  }),
});

export default NotificationMutationSuccess;
