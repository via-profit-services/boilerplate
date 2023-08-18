import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import PageMenuOrderField from '~/schema/enums/PageMenuOrderField';

const PageMenuOrderBy = new GraphQLInputObjectType({
  name: 'PageMenuOrderBy',
  fields: () => ({
    field: { type: new GraphQLNonNull(PageMenuOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  }),
});

export default PageMenuOrderBy;
