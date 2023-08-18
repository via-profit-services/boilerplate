import crypto from 'node:crypto';
import { Context } from '@via-profit-services/core';
import { GraphQLFieldConfig, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

import PageMutationPayload from '~/schema/unions/PageMutationPayload';

interface Args {
  readonly path: string;
  readonly name: string;
  readonly statusCode?: number;
  readonly id?: string | null;
  readonly pid?: string | null;
  readonly template?: string | null;
  readonly order?: number | null;
}

const createPage: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(PageMutationPayload),
  args: {
    statusCode: { type: GraphQLInt },
    path: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    pid: { type: GraphQLID },
    template: { type: GraphQLID },
    order: { type: GraphQLInt },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader, services, emitter } = context;
    const { id, pid, path, template, name, order, statusCode } = args;
    const pageID = typeof id === 'string' ? id : crypto.randomUUID();

    // check the `page` does not exists
    const existedPage = await dataloader.webpages.load(pageID);
    if (existedPage) {
      return {
        __typename: 'PageMutationError',
        name: 'PageAlreadyExists',
        msg: 'Page with same id already exists',
      };
    }

    // Check the `pid` page exists
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

    // Check the `path` does not exists
    const existedPathConn = await services.webpages.getPagesConnection({ path: [path], first: 1 });
    if (existedPathConn.edges.length) {
      const existedPage = existedPathConn.edges.find(({ node }) => node.path === path)?.node;

      return {
        __typename: 'PageMutationError',
        name: 'PageWithSamePathAlreadyExists',
        msg: `The page with same path already exists. Existed page: ${existedPage?.name}`,
      };
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

    // Page creation
    const createdAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      }),
    ).toISOString();

    try {
      await services.webpages.createPage({
        id: pageID,
        statusCode: typeof statusCode === 'number' ? statusCode : 404,
        createdAt,
        updatedAt: createdAt,
        template,
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

    const newPage = await dataloader.webpages.clear(pageID).load(pageID);

    return {
      __typename: 'PageMutationSuccess',
      page: newPage,
    };
  },
};

export default createPage;
