import { GraphQLEnumType } from 'graphql';

const NotificationEntityType = new GraphQLEnumType({
  name: 'NotificationEntityType',
  values: {
    USER: { value: 'User' },
  },
});

export default NotificationEntityType;
