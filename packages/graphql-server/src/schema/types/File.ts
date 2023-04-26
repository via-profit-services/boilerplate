import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLList,
} from 'graphql';
import {
  NodeInterfaceType,
  DateTimeScalarType,
  URLScalarType,
  JSONScalarType,
  Context,
} from '@via-profit-services/core';
import crypto from 'crypto';

import type {
  ImageTransform as ImageTransformType,
  FileMeta,
  FilesTableRecord,
  FileType as FileTypeType,
} from 'files';
import TransformedFile from '~/schema/types/TransformedFile';
import ImageTransform from '~/schema/inputs/ImageTransform';
import FileAccess from '~/schema/types/FileAccess';
import FileType from '~/schema/enums/FileType';

interface Resolver {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly mimeType: string;
  readonly type: FileTypeType;
  readonly name: string;
  readonly owner: string | null;
  readonly description: string | null;
  readonly meta: FileMeta | null;
  readonly url: string;
  readonly pseudoPath: string | null;
  readonly access: FilesTableRecord['access'];
  readonly transform: ImageTransformType;
}

const File = new GraphQLObjectType<FilesTableRecord, Context>({
  name: 'File',
  interfaces: [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Resolver, GraphQLFieldConfig<FilesTableRecord, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      owner: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'File owner ID',
      },
      mimeType: { type: new GraphQLNonNull(GraphQLString) },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'File display name',
      },
      description: { type: GraphQLString },
      type: {
        type: new GraphQLNonNull(FileType),
        description: 'File type: Avatar; Document, ...etc.',
      },
      pseudoPath: { type: GraphQLString },
      meta: { type: JSONScalarType },
      access: { type: new GraphQLNonNull(FileAccess) },
      url: {
        type: new GraphQLNonNull(URLScalarType),
        resolve: async (parent, _args, context) => {
          const { services } = context;
          const { id, mimeType, access, name } = parent;

          return services.files.compileFileUrl({
            id,
            access,
            name,
            mimeType,
          });
        },
      },
      transform: {
        type: TransformedFile,
        args: {
          input: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ImageTransform))),
          },
        },
        resolve: async (parent, args: { input: ImageTransformType[] }, context) => {
          const { services } = context;
          const { id, access, name } = parent;
          const { input } = args;

          if (!parent.mimeType.match(/^image\//)) {
            return null;
          }

          let mimeType = parent.mimeType;
          [...input].reverse().forEach(transform => {
            if (transform.format?.type) {
              mimeType = `image/${transform.format.type}`;
            }
          });

          input.forEach(transform => {
            if ('resize' in transform && transform.resize.w > 4000) {
              throw new Error(`The maximum allowed width is 4000, but got ${transform.resize.w}`);
            }

            if ('resize' in transform && transform.resize.h > 4000) {
              throw new Error(`The maximum allowed height is 4000, but got ${transform.resize.h}`);
            }

            if ('cover' in transform && transform.cover.w > 4000) {
              throw new Error(`The maximum allowed width is 4000, but got ${transform.cover.w}`);
            }

            if ('cover' in transform && transform.cover.h > 4000) {
              throw new Error(`The maximum allowed height is 4000, but got ${transform.cover.h}`);
            }

            if ('contain' in transform && transform.contain.w > 4000) {
              throw new Error(`The maximum allowed width is 4000, but got ${transform.contain.w}`);
            }

            if ('contain' in transform && transform.contain.h > 4000) {
              throw new Error(`The maximum allowed height is 4000, but got ${transform.contain.h}`);
            }

            if ('crop' in transform && transform.crop.w > 4000) {
              throw new Error(`The maximum allowed width is 4000, but got ${transform.crop.w}`);
            }

            if ('crop' in transform && transform.crop.h > 4000) {
              throw new Error(`The maximum allowed height is 4000, but got ${transform.crop.h}`);
            }

            if ('crop' in transform && transform.crop.x > 4000) {
              throw new Error(
                `The maximum allowed left position is 4000, but got ${transform.crop.x}`,
              );
            }

            if ('crop' in transform && transform.crop.y > 4000) {
              throw new Error(
                `The maximum allowed top position is 4000, but got ${transform.crop.y}`,
              );
            }

            if ('blur' in transform && transform.blur > 20) {
              throw new Error(`The maximum allowed blur is 20, but got ${transform.blur}`);
            }

            if ('blur' in transform && transform.blur < 1) {
              throw new Error(`The minimum allowed blur is 1, but got ${transform.blur}`);
            }

            if ('format' in transform && transform.format.quality < 1) {
              throw new Error(
                `The minimum allowed quality is 1, but got ${transform.format.quality}`,
              );
            }

            if ('format' in transform && transform.format.quality > 100) {
              throw new Error(`The maximum quality is 100, but got ${transform.format.quality}`);
            }
          });

          const transformedID = crypto
            .createHash('md5')
            .update(
              JSON.stringify({
                transform: input,
                access,
                mimeType,
                sourceID: id,
              }),
            )
            .digest('hex');

          return {
            ...parent,
            id: transformedID,
            mimeType,
            url: services.files.compileFileUrl({
              id: `${id}.${transformedID}`,
              name,
              access,
              mimeType,
              transform: input,
            }),
            reference: {
              id,
            },
          };
        },
      },
    };

    return fields;
  },
});

export default File;
