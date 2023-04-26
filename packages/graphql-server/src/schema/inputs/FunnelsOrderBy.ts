import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import FunnelsOrderField from '~/schema/enums/FunnelsOrderField';

const FunnelsOrderBy = new GraphQLInputObjectType({
  name: 'FunnelsOrderBy',
  fields: {
    field: { type: new GraphQLNonNull(FunnelsOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  },
});

export default FunnelsOrderBy;
