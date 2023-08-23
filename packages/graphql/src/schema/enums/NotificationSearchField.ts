import { GraphQLEnumType } from 'graphql';

const NotificationSearchField = new GraphQLEnumType({
  name: 'NotificationSearchField',
  values: {
    TEXT: { value: 'text' },
    TITLE: { value: 'title' },
  },
});

export default NotificationSearchField;
