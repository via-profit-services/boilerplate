import { GraphQLUnionType } from 'graphql';

import UserUpdateSuccess from '~/schema/types/UserUpdateSuccess';
import UserUpdateError from '~/schema/types/UserUpdateError';

const UserUpdateResponse = new GraphQLUnionType({
  name: 'UserUpdateResponse',
  types: () => [UserUpdateSuccess, UserUpdateError],
});

export default UserUpdateResponse;
