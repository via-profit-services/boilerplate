import { GraphQLEnumType } from 'graphql';

const NotificationStatus = new GraphQLEnumType({
  name: 'NotificationStatus',
  values: {
    CREATED: { value: 'created' },
    READ: { value: 'read' },
  },
});

export default NotificationStatus;
