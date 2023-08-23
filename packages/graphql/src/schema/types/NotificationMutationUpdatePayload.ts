import { GraphQLUnionType } from 'graphql';

import NotificationMutationUpdateError from '~/schema/types/NotificationMutationUpdateError';
import NotificationMutationUpdateSuccess from '~/schema/types/NotificationMutationUpdateSuccess';

const NotificationMutationUpdatePayload = new GraphQLUnionType({
  name: 'NotificationMutationUpdatePayload',
  types: () => [NotificationMutationUpdateSuccess, NotificationMutationUpdateError],
});

export default NotificationMutationUpdatePayload;
