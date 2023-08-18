import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLFieldConfig,
  GraphQLList,
} from 'graphql';
import {
  Context,
  DateTimeScalarType,
  NodeInterfaceType,
  MoneyScalarType,
} from '@via-profit-services/core';

import type { Deal as Parent } from 'deals';
import FunnelStep from '~/schema/types/FunnelStep';
import Funnel from '~/schema/types/Funnel';
import Client from '~/schema/types/Client';

const Deal = new GraphQLObjectType<Parent, Context>({
  name: 'Deal',
  interfaces: () => [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Parent, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      label: { type: new GraphQLNonNull(GraphQLString) },
      amount: { type: new GraphQLNonNull(MoneyScalarType) },
      comment: { type: GraphQLString },
      step: {
        type: new GraphQLNonNull(FunnelStep),
        resolve: async (parent, _args, context) => {
          const { dataloader } = context;
          const { step } = parent;

          return await dataloader.funnelSteps.load(step);
        },
      },
      funnel: {
        type: new GraphQLNonNull(Funnel),
        resolve: async (parent, _args, context) => {
          const { dataloader } = context;
          const { funnel } = parent;

          return await dataloader.funnels.load(funnel);
        },
      },
      clients: {
        type: new GraphQLList(new GraphQLNonNull(Client)),
        resolve: async (parent, _args, context) => {
          const { dataloader } = context;
          const { clients } = parent;

          if (clients === null) {
            return null;
          }

          return Promise.all(clients.map(client => dataloader.clients.load(client)));
        },
      },
    };

    return fields;
  },
});

export default Deal;
