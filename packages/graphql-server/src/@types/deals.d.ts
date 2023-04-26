declare module 'deals' {
  import { Knex } from 'knex';
  import { ListResponse, Middleware, OutputFilter } from '@via-profit-services/core';

  export type FunnelStepType = 'standard' | 'unprocessed' | 'canceled' | 'finished';

  export type DealsTableModel = {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly step: string;
    readonly funnel: string;
    readonly label: string;
    readonly amount: number;
    readonly comment: string | null;
  };

  export type DealsTableRecord = Omit<DealsTableModel, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };

  export type FunnelsTableModel = {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly label: string;
    readonly comment: string | null;
  };

  export type FunnelsTableRecord = Omit<FunnelsTableModel, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };

  export type FunnelStepTableModel = {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly funnel: string;
    readonly label: string;
    readonly color: string;
    readonly order: number;
    readonly type: FunnelStepType;
  };

  export type FunnelStepTableRecord = Omit<FunnelStepTableModel, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };

  export type ClientsToDealsTableModel = {
    readonly client: string;
    readonly deal: string;
  };

  export type ClientsToDealsTableRecord = ClientsToDealsTableModel;

  export type Deal = {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly label: string;
    readonly amount: number;
    readonly comment: string | null;
    readonly step: string;
    readonly funnel: string;
    readonly clients: string[] | null;
  };

  export type Funnel = {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly label: string;
    readonly comment: string | null;
  };

  export type FunnelStep = {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly funnel: string;
    readonly label: string;
    readonly color: string;
    readonly order: number;
    readonly type: FunnelStepType;
  };

  export interface DealsServiceInterface {
    getDeals(filter: OutputFilter): Promise<ListResponse<Deal>>;
    getDeal(id: string): Promise<Deal | false>;
    getDealsByIds(ids: readonly string[]): Promise<Deal[]>;
    getFunnels(filter: OutputFilter): Promise<ListResponse<Funnel>>;
    getFunnel(id: string): Promise<Funnel | false>;
    getFunnelsByIds(ids: readonly string[]): Promise<Funnel[]>;
    getFunnelSteps(filter: OutputFilter): Promise<ListResponse<FunnelStep>>;
    getFunnelStep(id: string): Promise<FunnelStep | false>;
    getFunnelStepsByIds(ids: readonly string[]): Promise<FunnelStep[]>;
  }

  interface DealsService extends DealsServiceInterface {}
  export interface DealsServiceProps {
    readonly knex: Knex;
  }

  class DealsService {
    constructor(props: DealsServiceProps);
  }

  export type DealsMiddlewareFactory = () => Middleware;
}
