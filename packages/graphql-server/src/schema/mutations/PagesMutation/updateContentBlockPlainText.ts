import { Context } from '@via-profit-services/core';
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';

import ContentBlockMutationPayload from '~/schema/unions/ContentBlockMutationPayload';

interface Args {
  readonly id: string;
  readonly text: string;
  readonly name?: string | null;
  readonly page?: string | null;
  readonly template?: string | null;
}

const updateContentBlockPlainText: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(ContentBlockMutationPayload),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    page: { type: GraphQLString },
    template: { type: GraphQLString },
  },
  resolve: async (_parent, args, context) => {
    const { id, text, name, page, template } = args;
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
    if (cb.type !== 'PLAIN_TEXT') {
      return {
        __typename: 'ContentBlockMutationError',
        name: 'ContentBlockInvalidType',
        msg: 'This content block are not a plain text type',
      };
    }

    try {
      await services.webpages.updateContentBlockPlainText({
        id,
        text,
        name,
        page,
        template,
        updatedAt,
      });
    } catch (err) {
      emitter.emit('log-error', 'pages', err instanceof Error ? err.message : 'Unknown Error');

      return {
        __typename: 'ContentBlockMutationError',
        name: 'UnknownError',
        msg: 'Unknown Error',
      };
    }

    dataloader.contentBlocks.clear(id);
    const updatedBlock = await dataloader.contentBlocks.load(id);

    return {
      __typename: 'ContentBlockMutationSuccess',
      contentBlock: updatedBlock,
    };
  },
};

export default updateContentBlockPlainText;
