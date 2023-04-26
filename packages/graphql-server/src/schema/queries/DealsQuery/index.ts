import { GraphQLObjectType } from 'graphql';

import deal from '~/schema/queries/DealsQuery/deal';
import list from '~/schema/queries/DealsQuery/list';

const DealsQuery = new GraphQLObjectType({
  name: 'DealsQuery',
  fields: () => ({
    deal,
    list,
  }),
});

export default DealsQuery;
