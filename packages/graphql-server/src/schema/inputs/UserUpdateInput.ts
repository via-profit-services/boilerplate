import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { FileUploadScalarType } from '@via-profit-services/core';

import UserFileInfo from '~/schema/inputs/UserFileInfo';

const UserUpdateInput = new GraphQLInputObjectType({
  name: 'UserUpdateInput',
  fields: {
    name: { type: GraphQLString },
    avatar: { type: FileUploadScalarType },
    files: { type: new GraphQLList(new GraphQLNonNull(FileUploadScalarType)) },
    filesInfo: { type: new GraphQLList(new GraphQLNonNull(UserFileInfo)) },
  },
});

export default UserUpdateInput;
