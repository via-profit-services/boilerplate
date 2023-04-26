import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import FunnelStepsOrderField from '~/schema/enums/FunnelStepsOrderField';

const FunnelStepsOrderBy = new GraphQLInputObjectType({
  name: 'FunnelStepsOrderBy',
  fields: {
    field: { type: new GraphQLNonNull(FunnelStepsOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  },
});

export default FunnelStepsOrderBy;
