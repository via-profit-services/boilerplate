import { GraphQLEnumType } from 'graphql';

const PageMenuItemSearchField = new GraphQLEnumType({
  name: 'PageMenuItemSearchField',
  values: {
    NAME: { value: 'name' },
  },
});

export default PageMenuItemSearchField;
