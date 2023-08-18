import { GraphQLEnumType } from 'graphql';

const FunnelStepsOrderField = new GraphQLEnumType({
  name: 'FunnelStepsOrderField',
  values: {
    ORDER: { value: 'order' },
  },
});

export default FunnelStepsOrderField;
