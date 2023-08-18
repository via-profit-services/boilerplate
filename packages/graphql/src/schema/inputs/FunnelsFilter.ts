import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from 'graphql';

const FunnelsFilter = new GraphQLInputObjectType({
  name: 'FunnelsFilter',
  fields: () => ({
    id: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
  }),
});

export default FunnelsFilter;
