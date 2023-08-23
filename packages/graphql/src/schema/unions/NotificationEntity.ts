import { GraphQLUnionType } from 'graphql';

import User from '~/schema/types/User';

const NotificationEntity = new GraphQLUnionType({
  name: 'NotificationEntity',
  types: () => [User],
});

export default NotificationEntity;
