import { GraphQLEnumType } from 'graphql';

const NotificationOrderField = new GraphQLEnumType({
  name: 'NotificationOrderField',
  values: {
    CREATED_AT: { value: 'createdAt' },
    UPDATED_AT: { value: 'updatedAt' },
  },
});

export default NotificationOrderField;
