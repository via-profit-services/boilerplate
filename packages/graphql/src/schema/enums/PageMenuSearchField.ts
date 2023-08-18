import { GraphQLEnumType } from 'graphql';

const PageMenuSearchField = new GraphQLEnumType({
  name: 'PageMenuSearchField',
  values: {
    NAME: { value: 'name' },
  },
});

export default PageMenuSearchField;
