import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { JSONObjectScalarType } from '@via-profit-services/core';

import FileType from '~/schema/enums/FileType';

const UserFileInfo = new GraphQLInputObjectType({
  name: 'UserFileInfo',
  fields: {
    id: { type: GraphQLID },
    type: { type: new GraphQLNonNull(FileType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    meta: { type: JSONObjectScalarType },
  },
});

export default UserFileInfo;
