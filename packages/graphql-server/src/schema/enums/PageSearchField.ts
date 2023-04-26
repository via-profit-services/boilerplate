import { GraphQLEnumType } from 'graphql';

const PageSearchField = new GraphQLEnumType({
  name: 'PageSearchField',
  values: {
    NAME: { value: 'name' },
  },
});

export default PageSearchField;
