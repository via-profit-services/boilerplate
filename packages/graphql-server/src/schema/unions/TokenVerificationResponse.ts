import { GraphQLUnionType } from 'graphql';

import TokenVerificationSuccess from '~/schema/unions/TokenVerificationSuccess';
import TokenVerificationError from '~/schema/types/TokenVerificationError';

const TokenVerificationResponse = new GraphQLUnionType({
  name: 'TokenVerificationResponse',
  types: () => [TokenVerificationSuccess, TokenVerificationError],
});

export default TokenVerificationResponse;
