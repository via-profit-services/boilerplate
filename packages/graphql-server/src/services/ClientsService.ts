import { CursorConnection } from '@via-profit-services/core';

import {
  Client,
  ClientsConnectionCursor,
  ClientsConnectionProps,
  ClientsServiceinterface,
  ClientsServiceProps,
  ClientsTableModel,
  ClientsTableRecord,
  Person,
  PersonsConnectionCursor,
  PersonsConnectionProps,
  PersonsTableModel,
  PersonsTableRecord,
} from 'clients';

class ClientsService implements ClientsServiceinterface {
  #knex: ClientsServiceProps['knex'];

  public constructor(props: ClientsServiceProps) {
    this.#knex = props.knex;
  }

  public async getClientsConnection(
    props: ClientsConnectionProps,
  ): Promise<CursorConnection<Client>> {
    const { first, after, last, before, id, orderBy, search, status } = props;

    let limit = 0;
    let offset = 0;
    let cursor: ClientsConnectionCursor = {
      offset: 0,
      id,
      status,
      orderBy,
      search,
    };

    if (first && !after) {
      limit = first;
      offset = 0;
      cursor.offset = 0;
    }

    if (first && after) {
      cursor = JSON.parse(Buffer.from(after, 'base64').toString('utf8'));
      limit = first;
      offset = Math.max(cursor.offset, 0) + 1;
      cursor.offset = Math.max(cursor.offset, 0) + 1;
    }

    if (last && before) {
      cursor = JSON.parse(Buffer.from(before, 'base64').toString('utf8'));
      limit = last;
      offset = Math.max(cursor.offset - last, 0);
      cursor.offset = Math.max(cursor.offset - last, 0);
    }

    const knexOrderBy = this.#knex.queryBuilder();
    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        knexOrderBy.orderBy(`clients.${field}`, direction);
      });
    }

    const request = this.#knex
      .select(['clients.*', this.#knex.raw('json_agg(distinct "persons"."id") as "persons"')])
      .groupBy(['clients.id'])
      .limit(limit)
      .offset(offset)
      .leftJoin('persons', 'persons.client', 'clients.id')
      .from<
        ClientsTableModel,
        ReadonlyArray<
          ClientsTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
            readonly persons: readonly (string | null)[];
          }
        >
      >('clients');

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`clients.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['clients.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['clients.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['clients.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['clients.id']),
      ]);
    }

    if (id) {
      request.whereIn('clients.id', id);
    }

    if (status) {
      request.whereIn('clients.status', status);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`clients.${field}`, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((record, index) => {
      const { persons, ...nodeData } = record;
      const personsList: string[] = persons.filter(Boolean);

      return {
        node: {
          ...nodeData,
          persons: personsList.length ? personsList : null,
        },
        cursor: Buffer.from(
          JSON.stringify({
            ...cursor,
            offset: cursor.offset + index,
          }),
        ).toString('base64'),
      };
    });

    const pageInfo = {
      hasPreviousPage: edges.length ? response[0].prev !== null : false,
      hasNextPage: edges.length ? response[response.length - 1].next !== null : false,
      startCursor: edges.length ? edges[0].cursor : undefined,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      pageInfo,
      edges,
    };
  }

  public async getPersonsConnection(
    props: PersonsConnectionProps,
  ): Promise<CursorConnection<Person>> {
    const { first, after, last, before, id, client, orderBy, search } = props;

    let limit = 0;
    let offset = 0;
    let cursor: PersonsConnectionCursor = {
      offset: 0,
      id,
      orderBy,
      client,
      search,
    };

    if (first && !after) {
      limit = first;
      offset = 0;
      cursor.offset = 0;
    }

    if (first && after) {
      cursor = JSON.parse(Buffer.from(after, 'base64').toString('utf8'));
      limit = first;
      offset = Math.max(cursor.offset, 0) + 1;
      cursor.offset = Math.max(cursor.offset, 0) + 1;
    }

    if (last && before) {
      cursor = JSON.parse(Buffer.from(before, 'base64').toString('utf8'));
      limit = last;
      offset = Math.max(cursor.offset - last, 0);
      cursor.offset = Math.max(cursor.offset - last, 0);
    }

    const knexOrderBy = this.#knex.queryBuilder();
    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        knexOrderBy.orderBy(`persons.${field}`, direction);
      });
    }

    const request = this.#knex
      .select(['persons.*'])
      .groupBy(['persons.id'])
      .limit(limit)
      .offset(offset)
      .from<
        PersonsTableModel,
        ReadonlyArray<
          PersonsTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
          }
        >
      >('persons');

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`persons.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['persons.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['persons.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['persons.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['persons.id']),
      ]);
    }

    if (id) {
      request.whereIn('persons.id', id);
    }

    if (client) {
      request.whereIn('clients.client', client);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`persons.${field}`, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((node, index) => ({
      node,
      cursor: Buffer.from(
        JSON.stringify({
          ...cursor,
          offset: cursor.offset + index,
        }),
      ).toString('base64'),
    }));

    const pageInfo = {
      hasPreviousPage: edges.length ? response[0].prev !== null : false,
      hasNextPage: edges.length ? response[response.length - 1].next !== null : false,
      startCursor: edges.length ? edges[0].cursor : undefined,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      pageInfo,
      edges,
    };
  }
}

export default ClientsService;
