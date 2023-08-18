import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import AccessTokenPayload from '~/schema/types/AccessTokenPayload';

const TokenVerificationSuccess = new GraphQLObjectType({
  name: 'TokenVerificationSuccess',
  fields: () => ({
    payload: { type: new GraphQLNonNull(AccessTokenPayload) },
  }),
});

export default TokenVerificationSuccess;
