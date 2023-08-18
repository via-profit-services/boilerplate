import { GraphQLEnumType } from 'graphql';

const PageMenuOrderField = new GraphQLEnumType({
  name: 'PageMenuOrderField',
  values: {
    ORDER: { value: 'order' },
    CREATED_AT: { value: 'createdAt' },
    UPDATED_AT: { value: 'updatedAt' },
  },
});

export default PageMenuOrderField;
