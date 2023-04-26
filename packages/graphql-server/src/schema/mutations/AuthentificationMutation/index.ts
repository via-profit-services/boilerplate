import { GraphQLObjectType } from 'graphql';

import create from '~/schema/mutations/AuthentificationMutation/create';
import refresh from '~/schema/mutations/AuthentificationMutation/refresh';
import revoke from '~/schema/mutations/AuthentificationMutation/revoke';

const AuthentificationMutation = new GraphQLObjectType({
  name: 'AuthentificationMutation',
  fields: () => ({
    create,
    refresh,
    revoke,
  }),
});

export default AuthentificationMutation;
