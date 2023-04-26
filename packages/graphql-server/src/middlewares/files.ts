import { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { FileStorageMiddlewareFactory } from 'files';
import FilesService from '~/services/FilesService';

const factory: FileStorageMiddlewareFactory = props => {
  const middleware: Middleware = ({ context }) => {
    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    context.services.files = new FilesService({
      knex: context.knex,
      timezone: context.timezone,
      jwt: context.jwt,
      ...props,
    });

    // Files Dataloader
    context.dataloader.files = new DataLoader(async ids => {
      const { edges } = await context.services.files.getFilesConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });
  };

  return middleware;
};

export default factory;
