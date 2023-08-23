import { GraphQLUnionType } from 'graphql';

import NotificationMutationSuccess from '~/schema/types/NotificationMutationSuccess';
import NotificationMutationError from '~/schema/types/NotificationMutationError';

const NotificationMutationPayload = new GraphQLUnionType({
  name: 'NotificationMutationPayload',
  types: () => [NotificationMutationSuccess, NotificationMutationError],
});

export default NotificationMutationPayload;
