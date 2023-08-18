import { GraphQLEnumType } from 'graphql';

const FunnelStepsFilterSearchField = new GraphQLEnumType({
  name: 'FunnelStepsFilterSearchField',
  values: {
    LABEL: { value: 'label' },
  },
});

export default FunnelStepsFilterSearchField;
