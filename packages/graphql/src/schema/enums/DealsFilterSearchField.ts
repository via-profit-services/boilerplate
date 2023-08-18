import { GraphQLEnumType } from 'graphql';

const DealsFilterSearchField = new GraphQLEnumType({
  name: 'DealsFilterSearchField',
  values: {
    LABEL: { value: 'label' },
  },
});

export default DealsFilterSearchField;
