import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import ClientsOrderField from '~/schema/enums/ClientsOrderField';

const ClientsOrderBy = new GraphQLInputObjectType({
  name: 'ClientsOrderBy',
  fields: {
    field: { type: new GraphQLNonNull(ClientsOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  },
});

export default ClientsOrderBy;
