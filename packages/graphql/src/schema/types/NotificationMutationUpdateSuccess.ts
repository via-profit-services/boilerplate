import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import Notification from '~/schema/types/Notification';

const NotificationMutationUpdateSuccess = new GraphQLObjectType({
  name: 'NotificationMutationUpdateSuccess',
  fields: () => ({
    notifications: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Notification))),
    },
  }),
});

export default NotificationMutationUpdateSuccess;
