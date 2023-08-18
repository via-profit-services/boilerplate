import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import AccountRole from '~/schema/enums/AccountRole';

const FileAccess = new GraphQLObjectType({
  name: 'FileAccess',
  fields: () => ({
    read: { type: new GraphQLList(new GraphQLNonNull(AccountRole)) },
    write: { type: new GraphQLList(new GraphQLNonNull(AccountRole)) },
    del: { type: new GraphQLList(new GraphQLNonNull(AccountRole)) },
  }),
});

export default FileAccess;
