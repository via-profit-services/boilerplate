import { GraphQLEnumType } from 'graphql';

const FunnelStepType = new GraphQLEnumType({
  name: 'FunnelStepType',
  values: {
    STANDARD: { value: 'standard' },
    UNPROCESSED: { value: 'unprocessed' },
    CANCELED: { value: 'canceled' },
    FINISHED: { value: 'finished' },
  },
});

export default FunnelStepType;
