import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from 'graphql';

const DealsFilter = new GraphQLInputObjectType({
  name: 'DealsFilter',
  fields: () => ({
    id: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
  }),
});

export default DealsFilter;
