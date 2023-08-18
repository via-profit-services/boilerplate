import { GraphQLEnumType } from 'graphql';

const FunnelsFilterSearchField = new GraphQLEnumType({
  name: 'FunnelsFilterSearchField',
  values: {
    LABEL: { value: 'label' },
  },
});

export default FunnelsFilterSearchField;
