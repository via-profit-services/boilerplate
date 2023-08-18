import { GraphQLObjectType } from 'graphql';
import { Context } from '@via-profit-services/core';

import verifyToken from '~/schema/queries/AuthentificationQuery/verifyToken';

const AuthentificationQuery = new GraphQLObjectType<unknown, Context>({
  name: 'AuthentificationQuery',
  fields: () => ({
    verifyToken,
  }),
});

export default AuthentificationQuery;
