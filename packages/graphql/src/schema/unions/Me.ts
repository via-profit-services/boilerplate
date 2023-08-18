import { GraphQLUnionType } from 'graphql';

import User from '~/schema/types/User';

const Me = new GraphQLUnionType({
  name: 'Me',
  types: () => [User],
});

export default Me;
