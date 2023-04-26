import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFieldConfig,
} from 'graphql';
import {
  NodeInterfaceType,
  DateTimeScalarType,
  URLScalarType,
  JSONScalarType,
  Context,
} from '@via-profit-services/core';

import { FilesTableRecord, FileMeta, FileType as FileTypeType } from 'files';
import File from '~/schema/types/File';
import FileAccess from '~/schema/types/FileAccess';
import FileType from '~/schema/enums/FileType';

interface Resolver {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly mimeType: string;
  readonly type: FileTypeType;
  readonly owner: string | null;
  readonly description: string | null;
  readonly meta: FileMeta | null;
  readonly url: string;
  readonly access: FilesTableRecord['access'];
  readonly reference: FilesTableRecord;
}

const TransformedFile = new GraphQLObjectType<FilesTableRecord, Context>({
  name: 'TransformedFile',
  interfaces: [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Resolver, GraphQLFieldConfig<FilesTableRecord, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      owner: { type: new GraphQLNonNull(GraphQLID) },
      mimeType: { type: new GraphQLNonNull(GraphQLString) },
      type: { type: new GraphQLNonNull(FileType) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      meta: { type: new GraphQLNonNull(JSONScalarType) },
      access: { type: new GraphQLNonNull(FileAccess) },
      url: { type: new GraphQLNonNull(URLScalarType) },
      reference: {
        type: new GraphQLNonNull(File),
        resolve: async parent => parent,
      },
    };

    return fields;
  },
});

export default TransformedFile;
