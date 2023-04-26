import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';

import FunnelStepType from '~/schema/enums/FunnelStepType';

const FunnelStepsFilter = new GraphQLInputObjectType({
  name: 'FunnelStepsFilter',
  fields: () => ({
    id: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    order: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    type: { type: new GraphQLList(new GraphQLNonNull(FunnelStepType)) },
  }),
});

export default FunnelStepsFilter;
