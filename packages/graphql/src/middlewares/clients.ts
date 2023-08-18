import { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { ClientsMiddlewareFactory } from 'clients';
import ClientsService from '~/services/ClientsService';

const factory: ClientsMiddlewareFactory = () => {
  const middleware: Middleware = async ({ context }) => {
    const { services } = context;

    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    services.clients = new ClientsService({ knex: context.knex });

    context.dataloader.clients = new DataLoader(async ids => {
      const { edges } = await services.clients.getClientsConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });

    context.dataloader.persons = new DataLoader(async ids => {
      const { edges } = await services.clients.getPersonsConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });
  };

  return middleware;
};

export default factory;
