import { GraphQLEnumType } from 'graphql';

const AccountRole = new GraphQLEnumType({
  name: 'AccountRole',
  values: {
    DEVELOPER: { value: 'developer' },
    ADMINISTRATOR: { value: 'administrator' },
    VIEWER: { value: 'viewer' },
    OPTIMIZATOR: { value: 'optimizator' },
    COPYWRITER: { value: 'copywriter' },
  },
});

export default AccountRole;
