import { GraphQLObjectType } from 'graphql';

import funnel from '~/schema/queries/FunnelsQuery/funnel';
import list from '~/schema/queries/FunnelsQuery/list';

const FunnelsQuery = new GraphQLObjectType({
  name: 'FunnelsQuery',
  fields: () => ({
    funnel,
    list,
  }),
});

export default FunnelsQuery;
