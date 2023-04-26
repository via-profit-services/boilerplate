import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFieldConfig,
} from 'graphql';
import {
  buildCursorConnection,
  buildQueryFilter,
  Context,
  DateTimeScalarType,
  NodeInterfaceType,
} from '@via-profit-services/core';

import type { FunnelStep as Parent } from 'deals';
import FunnelStepType from '~/schema/enums/FunnelStepType';
import DealsConnection from '~/schema/connections/DealsConnection';
import Funnel from '~/schema/types/Funnel';

type DealsArgs = {
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
};

const FunnelStep = new GraphQLObjectType<Parent, Context>({
  name: 'FunnelStep',
  interfaces: () => [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Parent | 'deals', GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      label: { type: new GraphQLNonNull(GraphQLString) },
      color: { type: new GraphQLNonNull(GraphQLString) },
      order: { type: new GraphQLNonNull(GraphQLInt) },
      type: { type: new GraphQLNonNull(FunnelStepType) },
      funnel: {
        type: new GraphQLNonNull(Funnel),
        resolve: async (parent, _args, context) => {
          const { funnel } = parent;
          const { dataloader } = context;

          return await dataloader.funnels.load(funnel);
        },
      },
      deals: {
        type: new GraphQLNonNull(DealsConnection),
        resolve: async (parent, args: DealsArgs, context) => {
          const { funnel, id } = parent;
          const { services } = context;
          const filter = buildQueryFilter(args);
          const { where } = filter;

          where.push(['funnel', '=', funnel]);
          where.push(['step', '=', id]);

          const deals = await services.deals.getDeals(filter);
          const connection = buildCursorConnection({ ...deals, where }, 'funnel-step-deals');

          return connection;
        },
      },
    };

    return fields;
  },
});

export default FunnelStep;
