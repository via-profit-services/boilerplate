import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { ErrorInterfaceType } from '@via-profit-services/core';

const NotificationMutationUpdateError = new GraphQLObjectType({
  name: 'NotificationMutationUpdateError',
  interfaces: [ErrorInterfaceType],
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    msg: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default NotificationMutationUpdateError;
