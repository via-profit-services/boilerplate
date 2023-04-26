import { defaultOutputFilter, ListResponse, OutputFilter } from '@via-profit-services/core';

import type {
  Deal,
  Funnel,
  DealsServiceInterface,
  DealsServiceProps,
  DealsTableModel,
  DealsTableRecord,
  FunnelsTableModel,
  FunnelsTableRecord,
  FunnelStep,
  FunnelStepTableModel,
  FunnelStepTableRecord,
} from 'deals';

class DealsService implements DealsServiceInterface {
  #knex: DealsServiceProps['knex'];

  public constructor(props: DealsServiceProps) {
    this.#knex = props.knex;
  }

  public async getDeals(filter: OutputFilter): Promise<ListResponse<Deal>> {
    const { limit, offset, orderBy, where } = filter;

    const response = await this.#knex
      .select([
        'deals.*',
        this.#knex.raw('count(*) over() as "totalCount"'),
        this.#knex.raw('json_agg(distinct "clients2deals"."client") as "clients"'),
      ])
      .from<
        DealsTableModel,
        (DealsTableRecord & {
          totalCount: number;
          clients: readonly (string | null)[];
        })[]
      >('deals')
      .leftJoin('clients2deals', 'clients2deals.deal', 'deals.id')
      .groupBy('deals.id')
      .limit(limit)
      .offset(offset);

    const records = response.map(record => {
      const clients = record.clients.filter(client => client !== null);

      return {
        ...record,
        clients: clients.length ? clients : null,
      };
    });

    const result: ListResponse<Deal> = {
      nodes: [],
      offset,
      limit,
      orderBy,
      where,
    };

    return result;
  }

  public async getFunnels(filter: OutputFilter): Promise<ListResponse<Funnel>> {
    const { limit, offset, orderBy, where, search, between } = filter;
    const aliases = {
      funnels: ['*'],
    };

    const request = this.#knex
      .select(['funnels.*', this.#knex.raw('count(*) over() as "totalCount"')])
      .from<FunnelsTableModel, (FunnelsTableRecord & { totalCount: number })[]>('funnels')

      .groupBy('funnels.id')
      .limit(limit)
      .offset(offset);

    const response = await request;

    const result: ListResponse<Funnel> = {
      nodes: [],
      offset,
      limit,
      orderBy,
      where,
    };

    return result;
  }

  public async getFunnelSteps(filter: OutputFilter): Promise<ListResponse<FunnelStep>> {
    const { limit, offset, orderBy, where } = filter;
    const aliases = {
      funnelSteps: ['*'],
    };

    const request = this.#knex
      .select(['funnelSteps.*', this.#knex.raw('count(*) over() as "totalCount"')])
      .from<FunnelStepTableModel, (FunnelStepTableRecord & { totalCount: number })[]>('funnelSteps')
      .limit(limit)
      .offset(offset);

    const response = await request;

    const result: ListResponse<FunnelStep> = {
      nodes: [],
      offset,
      limit,
      orderBy,
      where,
    };

    return result;
  }

  public async getDealsByIds(ids: readonly string[]): Promise<Deal[]> {
    const { nodes } = await this.getDeals({
      ...defaultOutputFilter,
      where: [['id', 'in', ids]],
      limit: ids.length,
    });

    return nodes;
  }

  public async getFunnelsByIds(ids: readonly string[]): Promise<Funnel[]> {
    const { nodes } = await this.getFunnels({
      ...defaultOutputFilter,
      where: [['id', 'in', ids]],
      limit: ids.length,
    });

    return nodes;
  }

  public async getFunnelStepsByIds(ids: readonly string[]): Promise<FunnelStep[]> {
    const { nodes } = await this.getFunnelSteps({
      ...defaultOutputFilter,
      where: [['id', 'in', ids]],
      limit: ids.length,
    });

    return nodes;
  }

  public async getDeal(id: string): Promise<false | Deal> {
    const { nodes } = await this.getDeals({
      ...defaultOutputFilter,
      where: [['id', '=', id]],
      limit: 1,
    });

    return nodes.length ? nodes[0] : false;
  }

  public async getFunnel(id: string): Promise<false | Funnel> {
    const { nodes } = await this.getFunnels({
      ...defaultOutputFilter,
      where: [['id', '=', id]],
      limit: 1,
    });

    return nodes.length ? nodes[0] : false;
  }

  public async getFunnelStep(id: string): Promise<false | FunnelStep> {
    const { nodes } = await this.getFunnelSteps({
      ...defaultOutputFilter,
      where: [['id', '=', id]],
      limit: 1,
    });

    return nodes.length ? nodes[0] : false;
  }
}

export default DealsService;
