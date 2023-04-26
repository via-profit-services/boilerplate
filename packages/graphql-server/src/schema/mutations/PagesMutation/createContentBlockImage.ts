import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql';
import { Context, FileUploadScalarType, UploadedFile } from '@via-profit-services/core';
import { v4 as uuidv4 } from 'uuid';

import ContentBlockMutationPayload from '~/schema/unions/ContentBlockMutationPayload';

interface Args {
  readonly input: {
    readonly id?: string | null;
    readonly page?: string | null;
    readonly template?: string | null;
    readonly name: string;
    readonly alt?: string | null;
    readonly title?: string | null;
    readonly file: UploadedFile;
  };
}

const createContentBlockImage: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(ContentBlockMutationPayload),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'ContentBlockImageInputCreate',
        fields: {
          id: { type: GraphQLID },
          page: { type: GraphQLID },
          template: { type: GraphQLID },
          name: { type: new GraphQLNonNull(GraphQLString) },
          alt: { type: GraphQLString },
          title: { type: GraphQLString },
          file: { type: new GraphQLNonNull(FileUploadScalarType) },
        },
      }),
    },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader, services, emitter } = context;
    const { input } = args;
    const { id, name, page, template, alt, title, file } = input;
    const blockID = id || uuidv4();
    const fileID = uuidv4();
    const { createReadStream, mimeType } = await file;
    const createdAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      }),
    ).toISOString();

    // check content block exists
    const existed = await dataloader.contentBlocks.load(blockID);
    if (existed) {
      return {
        __typename: 'ContentBlockMutationError',
        name: 'ContentBlockAlreadyExists',
        msg: `Content Block with id ${blockID} already exists `,
      };
    }

    // Check Page exists
    if (typeof page === 'string') {
      const existedPage = await dataloader.webpages.load(page);
      if (!existedPage) {
        return {
          __typename: 'ContentBlockMutationError',
          name: 'PageDoesNotExists',
          msg: `The page with id «${page}» does not exists`,
        };
      }
    }

    try {
      await services.files.createFile(createReadStream(), {
        type: 'MEDIA',
        id: fileID,
        mimeType,
        owner: blockID,
        access: {
          del: ['viewer'],
          read: ['viewer'],
          write: ['viewer'],
        },
      });
    } catch (err) {
      emitter.emit('log-error', 'pages', err instanceof Error ? err.message : 'Unknown Error');

      return {
        __typename: 'ContentBlockMutationError',
        name: 'UnknownError',
        msg: 'Unknown Error',
      };
    }

    try {
      await services.webpages.createContentBlockImage({
        id: blockID,
        createdAt,
        updatedAt: createdAt,
        page: typeof page === 'undefined' ? null : page,
        template: typeof template === 'undefined' ? null : template,
        name,
        alt,
        title,
        file: fileID,
      });
    } catch (err) {
      emitter.emit('log-error', 'pages', err instanceof Error ? err.message : 'Unknown Error');

      return {
        __typename: 'ContentBlockMutationError',
        name: 'UnknownError',
        msg: 'Unknown Error',
      };
    }

    dataloader.contentBlocks.clear(blockID);
    const newBlock = await dataloader.contentBlocks.load(blockID);

    return {
      __typename: 'ContentBlockMutationSuccess',
      contentBlock: newBlock,
    };
  },
};

export default createContentBlockImage;
