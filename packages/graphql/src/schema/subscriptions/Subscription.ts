import { GraphQLObjectType } from 'graphql';
import { Context } from '@via-profit-services/core';

// import tokenWasRevoked from '~/schema/subscriptions/tokenWasRevoked';
import userWasUpdated from '~/schema/subscriptions/userWasUpdated';

const Subscription = new GraphQLObjectType<unknown, Context>({
  name: 'Subscription',
  fields: () => ({
    // tokenWasRevoked,
    userWasUpdated,
  }),
});

export default Subscription;
