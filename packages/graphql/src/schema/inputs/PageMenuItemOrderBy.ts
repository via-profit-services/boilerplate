import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import PageMenuItemOrderField from '~/schema/enums/PageMenuItemOrderField';

const PageMenuItemOrderBy = new GraphQLInputObjectType({
  name: 'PageMenuItemOrderBy',
  fields: () => ({
    field: { type: new GraphQLNonNull(PageMenuItemOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  }),
});

export default PageMenuItemOrderBy;
