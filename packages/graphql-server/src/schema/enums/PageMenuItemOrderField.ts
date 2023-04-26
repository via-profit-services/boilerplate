import { GraphQLEnumType } from 'graphql';

const PageMenuItemOrderField = new GraphQLEnumType({
  name: 'PageMenuItemOrderField',
  values: {
    ORDER: { value: 'order' },
    CREATED_AT: { value: 'createdAt' },
    UPDATED_AT: { value: 'updatedAt' },
  },
});

export default PageMenuItemOrderField;
