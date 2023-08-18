import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import BlockOrderField from '~/schema/enums/BlockOrderField';

const BlocksOrderBy = new GraphQLInputObjectType({
  name: 'BlocksOrderBy',
  fields: () => ({
    field: { type: new GraphQLNonNull(BlockOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  }),
});

export default BlocksOrderBy;
