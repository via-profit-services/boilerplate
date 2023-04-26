import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import AccessToken from '~/schema/types/AccessToken';
import RefreshToken from '~/schema/types/RefreshToken';

const TokenBag = new GraphQLObjectType({
  name: 'TokenBag',
  description: 'Tokens pair (Access and Refresh)',
  fields: {
    accessToken: { type: new GraphQLNonNull(AccessToken) },
    refreshToken: { type: new GraphQLNonNull(RefreshToken) },
  },
});

export default TokenBag;
