import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import DealsOrderField from '~/schema/enums/DealsOrderField';

const DealsOrderBy = new GraphQLInputObjectType({
  name: 'DealsOrderBy',
  fields: {
    field: { type: new GraphQLNonNull(DealsOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  },
});

export default DealsOrderBy;
