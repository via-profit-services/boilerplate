import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import FilesEdge from '~/schema/connections/FileEdge';

const FilesConnection = new GraphQLObjectType({
  name: 'FilesConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(FilesEdge))) },
  }),
});

export default FilesConnection;
