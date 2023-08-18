import { GraphQLEnumType } from 'graphql';

const PageOrderField = new GraphQLEnumType({
  name: 'PageOrderField',
  values: {
    ORDER: { value: 'order' },
    NAME: { value: 'name' },
    CREATED_AT: { value: 'createdAt' },
    UPDATED_AT: { value: 'updatedAt' },
  },
});

export default PageOrderField;
