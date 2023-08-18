import { GraphQLUnionType } from 'graphql';

import TokenRegistrationSuccess from '~/schema/types/TokenRegistrationSuccess';
import TokenRegistrationError from '~/schema/types/TokenRegistrationError';

const TokenRegistrationResponse = new GraphQLUnionType({
  name: 'TokenRegistrationResponse',
  types: () => [TokenRegistrationSuccess, TokenRegistrationError],
});

export default TokenRegistrationResponse;
