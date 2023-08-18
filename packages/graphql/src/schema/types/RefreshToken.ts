import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import RefreshTokenPayload from '~/schema/unions/RefreshTokenPayload';

const RefreshToken = new GraphQLObjectType({
  name: 'RefreshToken',
  description: 'Refresh token package',
  fields: () => ({
    token: { type: new GraphQLNonNull(GraphQLString) },
    payload: { type: new GraphQLNonNull(RefreshTokenPayload) },
  }),
});

export default RefreshToken;
