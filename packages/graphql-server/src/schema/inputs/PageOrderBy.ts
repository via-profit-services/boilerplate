import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import PageOrderField from '~/schema/enums/PageOrderField';

const PageOrderBy = new GraphQLInputObjectType({
  name: 'PageOrderBy',
  fields: () => ({
    field: { type: new GraphQLNonNull(PageOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  }),
});

export default PageOrderBy;
