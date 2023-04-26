import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import UserOrderField from '~/schema/enums/UserOrderField';

const UserOrderBy = new GraphQLInputObjectType({
  name: 'UserOrderBy',
  fields: () => ({
    field: { type: new GraphQLNonNull(UserOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  }),
});

export default UserOrderBy;
