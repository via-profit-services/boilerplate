import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import AccessTokenPayloadType from '~/schema/types/AccessTokenPayload';

const AccessToken = new GraphQLObjectType({
  name: 'AccessToken',
  description: 'Access token package',
  fields: () => ({
    token: { type: new GraphQLNonNull(GraphQLString) },
    payload: { type: new GraphQLNonNull(AccessTokenPayloadType) },
  }),
});

export default AccessToken;
