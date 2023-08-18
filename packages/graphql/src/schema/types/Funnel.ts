import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFieldConfig,
  GraphQLList,
} from 'graphql';
import {
  Context,
  DateTimeScalarType,
  NodeInterfaceType,
  buildQueryFilter,
  buildCursorConnection,
  OrderBy,
  InputSearch,
} from '@via-profit-services/core';

import type { Funnel as Parent, FunnelStepType } from 'deals';
import FunnelStepsConnection from '~/schema/connections/FunnelStepsConnection';
import FunnelStepsFilter from '~/schema/inputs/FunnelStepsFilter';
import FunnelStepsFilterSearch from '~/schema/inputs/FunnelStepsFilterSearch';
import FunnelStepsOrderBy from '~/schema/inputs/FunnelStepsOrderBy';
import DealsConnection from '~/schema/connections/DealsConnection';

type DealsArgs = {
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
};

type StepsArgs = {
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
  filter?: {
    id?: string[] | null;
    order?: number[] | null;
    type?: FunnelStepType[] | null;
  } | null;
  orderBy?: OrderBy | null;
  search?: InputSearch | null;
};

const Funnel = new GraphQLObjectType<Parent, Context>({
  name: 'Funnel',
  interfaces: () => [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Parent | 'deals' | 'steps', GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      label: { type: new GraphQLNonNull(GraphQLString) },
      comment: { type: GraphQLString },
      steps: {
        args: {
          first: { type: GraphQLInt },
          last: { type: GraphQLInt },
          after: { type: GraphQLString },
          before: { type: GraphQLString },
          filter: { type: FunnelStepsFilter },
          search: { type: new GraphQLList(new GraphQLNonNull(FunnelStepsFilterSearch)) },
          orderBy: { type: new GraphQLList(new GraphQLNonNull(FunnelStepsOrderBy)) },
        },
        type: new GraphQLNonNull(FunnelStepsConnection),
        resolve: async (parent, args: StepsArgs, context) => {
          const { services } = context;
          const { id } = parent;
          const filter = buildQueryFilter(args);
          const { where } = filter;

          where.push(['funnel', '=', id]);

          const steps = await services.deals.getFunnelSteps(filter);
          const connection = buildCursorConnection({ ...steps, where }, 'funnel-steps');

          return connection;
        },
      },
      deals: {
        args: {
          first: { type: GraphQLInt },
          last: { type: GraphQLInt },
          after: { type: GraphQLString },
          before: { type: GraphQLString },
        },
        type: new GraphQLNonNull(DealsConnection),
        resolve: async (parent, args: DealsArgs, context) => {
          const { services } = context;
          const { id } = parent;
          const filter = buildQueryFilter(args);
          const { where } = filter;

          filter.where.push(['funnel', '=', id]);
          try {
            const deals = await services.deals.getDeals(filter);
            const connection = buildCursorConnection(
              {
                ...deals,
                where,
              },
              'funnel-deals',
            );

            return connection;
          } catch (err) {
            throw new Error(`Failed to get funnel deals list. ${err.message}`);
          }
        },
      },
    };

    return fields;
  },
});

export default Funnel;
