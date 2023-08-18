declare module 'clients' {
  import { Knex } from 'knex';
  import { Middleware, CursorConnection } from '@via-profit-services/core';

  export type ClientStatus = 'active' | 'inactive';
  export type ClientLegalStatus = 'person' | 'legal' | 'entrepreneur' | 'selfemployed';

  export interface ClientsTableModel {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly name: string;
    readonly comment: string | null;
    readonly status: ClientStatus;
    readonly legalStatus: ClientLegalStatus;
  }

  export type ClientsTableRecord = Omit<ClientsTableModel, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };

  export interface PersonsTableModel {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly name: string;
    readonly heldPost: string;
    readonly comment: string | null;
    readonly client: string;
  }

  export type PersonsTableRecord = Omit<PersonsTableModel, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };

  export interface Client {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly name: string;
    readonly comment: string | null;
    readonly status: ClientStatus;
    readonly legalStatus: ClientLegalStatus;
    readonly persons: string[] | null;
  }

  export type Person = {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly name: string;
    readonly heldPost: string;
    readonly client: string;
  };

  export interface ClientsConnectionCursor {
    offset: number;
    id?: readonly string[] | null;
    status?: readonly ClientStatus[] | null;
    legalStatus?: readonly ClientLegalStatus[] | null;
    orderBy?: ClientsConnectionProps['orderBy'];
    search?: ClientsConnectionProps['search'];
  }

  export interface ClientsConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly status?: readonly ClientStatus[] | null;
    readonly legalStatus?: readonly ClientLegalStatus[] | null;
    readonly orderBy?:
      | {
          readonly field: 'name' | 'createdAt' | 'updatedAt';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
    readonly search?:
      | {
          readonly field: 'name' | 'comment';
          readonly query: string;
        }[]
      | null;
  }

  export interface PersonsConnectionCursor {
    offset: number;
    id?: readonly string[] | null;
    client?: readonly string[] | null;
    orderBy?: PersonsConnectionProps['orderBy'];
    search?: PersonsConnectionProps['search'];
  }

  export interface PersonsConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly client?: readonly string[] | null;
    readonly orderBy?:
      | {
          readonly field: 'name' | 'createdAt' | 'updatedAt';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
    readonly search?:
      | {
          readonly field: 'name';
          readonly query: string;
        }[]
      | null;
  }

  export interface ClientsServiceinterface {
    getClientsConnection(props: ClientsConnectionProps): Promise<CursorConnection<Client>>;
    getPersonsConnection(props: PersonsConnectionProps): Promise<CursorConnection<Person>>;
  }

  interface ClientsService extends ClientsServiceinterface {}

  export interface ClientsServiceProps {
    readonly knex: Knex;
  }

  class ClientsService {
    constructor(props: ClientsServiceProps);
  }

  export type ClientsMiddlewareFactory = () => Middleware;
}
