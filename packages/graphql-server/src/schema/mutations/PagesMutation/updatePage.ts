import { Context } from '@via-profit-services/core';
import { GraphQLFieldConfig, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

import PageMutationPayload from '~/schema/unions/PageMutationPayload';

interface Args {
  readonly id: string;
  readonly statusCode?: number | null;
  readonly path?: string | null;
  readonly pid?: string | null;
  readonly template?: string | null;
  readonly name?: string | null;
  readonly order?: number | null;
}

const updatePage: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(PageMutationPayload),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    statusCode: { type: GraphQLInt },
    path: { type: GraphQLString },
    pid: { type: GraphQLID },
    template: { type: GraphQLID },
    name: { type: GraphQLString },
    order: { type: GraphQLInt },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader, services, emitter } = context;
    const { id, pid, path, template, name, order, statusCode } = args;

    // check the `page` does not exists
    const existedPage = await dataloader.webpages.load(id);
    if (!existedPage) {
      return {
        __typename: 'PageMutationError',
        name: 'PageDoesNotExists',
        msg: 'Page does not exists',
      };
    }

    // Check the `pid` page exists if pid was passed
    if (typeof pid === 'string') {
      const existesPidPage = await dataloader.webpages.load(pid);

      if (!existesPidPage) {
        return {
          __typename: 'PageMutationError',
          name: 'ParentPageDoesNotExists',
          msg: 'The parent page does not exists. Make sure that the parent page exists',
        };
      }
    }

    // Check the `path` does not exists. Skip page with same ID
    const existedPathConn = await services.webpages.getPagesConnection({ path: [path], first: 1 });
    if (existedPathConn.edges.length) {
      const existedPage = existedPathConn.edges.find(({ node }) => node.id !== id)?.node;
      if (existedPage) {
        return {
          __typename: 'PageMutationError',
          name: 'PageWithSamePathAlreadyExists',
          msg: `The page with same path already exists. Existed page: ${existedPage?.name}`,
        };
      }
    }

    // Check the `template` exists
    if (typeof template === 'string') {
      const existedTemplate = await dataloader.templates.load(template);
      if (!existedTemplate) {
        return {
          __typename: 'PageMutationError',
          name: 'TemplateDowsNotExists',
          msg: `Template with id «${template}» does not exists`,
        };
      }
    }

    // Page update
    const updatedAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      }),
    ).toISOString();

    try {
      await services.webpages.updatePage(id, {
        updatedAt,
        template,
        statusCode,
        order,
        pid,
        name,
        path,
      });
    } catch (err) {
      emitter.emit('log-error', 'pages', err instanceof Error ? err.message : 'Unknown Error');

      return {
        __typename: 'PageMutationError',
        name: 'UnknownError',
        msg: `Unknown error`,
      };
    }

    const newPage = await dataloader.webpages.clear(id).load(id);

    return {
      __typename: 'PageMutationSuccess',
      page: newPage,
    };
  },
};

export default updatePage;
