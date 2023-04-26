import { Context, FileUploadScalarType, UploadedFile } from '@via-profit-services/core';
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

import ContentBlockMutationPayload from '~/schema/unions/ContentBlockMutationPayload';

interface Args {
  readonly id: string;
  readonly file?: UploadedFile;
  readonly alt?: string;
  readonly title?: string;
  readonly name?: string | null;
  readonly page?: string | null;
  readonly template?: string | null;
}

const updateContentBlockImage: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(ContentBlockMutationPayload),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    alt: { type: GraphQLString },
    title: { type: GraphQLString },
    file: { type: FileUploadScalarType },
    name: { type: GraphQLString },
    page: { type: GraphQLString },
    template: { type: GraphQLString },
  },
  resolve: async (_parent, args, context) => {
    const { id, name, page, template, alt, title, file } = args;
    const { services, dataloader, emitter } = context;
    const updatedAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      }),
    ).toISOString();

    // check content block exists
    const cb = await dataloader.contentBlocks.load(id);
    if (!cb) {
      return {
        __typename: 'ContentBlockMutationError',
        name: 'ContentBlockNotExists',
        msg: 'Content block does not exists',
      };
    }
    if (cb.type !== 'IMAGE') {
      return {
        __typename: 'ContentBlockMutationError',
        name: 'ContentBlockInvalidType',
        msg: 'This content block are not an image type',
      };
    }

    // Replace image
    if (typeof file !== 'undefined') {
      try {
        // Upload image
        const { createReadStream, mimeType } = await file;
        const fileID = uuidv4();

        await services.files.createFile(createReadStream(), {
          type: 'MEDIA',
          id: fileID,
          mimeType,
          owner: id,
          access: {
            del: ['viewer'],
            read: ['viewer'],
            write: ['viewer'],
          },
        });

        await services.webpages.updateContentBlockImage({
          id,
          file: fileID,
          alt,
          title,
          name,
          page,
          template,
          updatedAt,
        });

        await services.files.deleteFiles([cb.file]);
        dataloader.files.clear(cb.file);
        dataloader.files.clear(fileID);
      } catch (err) {
        emitter.emit('log-error', 'pages', err instanceof Error ? err.message : 'Unknown Error');

        return {
          __typename: 'ContentBlockMutationError',
          name: 'UnknownError',
          msg: 'UnknownError',
        };
      }
    }

    dataloader.contentBlocks.clear(id);
    const updatedBlock = await dataloader.contentBlocks.load(id);

    return {
      __typename: 'ContentBlockMutationSuccess',
      contentBlock: updatedBlock,
    };
  },
};

export default updateContentBlockImage;
