import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

export type NotificationCounterSubscriptionPayloadType = {
  readonly recipient: string;
  readonly counter: number;
};

const NotificationCounterSubscriptionPayload = new GraphQLObjectType({
  name: 'NotificationCounterSubscriptionPayload',
  fields: () => ({
    recipient: {
      type: new GraphQLNonNull(GraphQLID),
    },
    counter: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

export default NotificationCounterSubscriptionPayload;
