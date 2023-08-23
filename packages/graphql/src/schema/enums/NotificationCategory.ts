import { GraphQLEnumType } from 'graphql';

const NotificationCategory = new GraphQLEnumType({
  name: 'NotificationCategory',
  values: {
    NORMAL: { value: 'normal' },
    WARN: { value: 'warn' },
    CRITICAL: { value: 'critical' },
  },
});

export default NotificationCategory;
