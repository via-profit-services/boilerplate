import { GraphQLEnumType } from 'graphql';

const NotificationActionName = new GraphQLEnumType({
  name: 'NotificationActionName',
  values: {
    VOID: { value: 'void' },
  },
});

export default NotificationActionName;
