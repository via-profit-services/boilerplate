import { CursorConnection } from '@via-profit-services/core';

import type {
  MenuServiceInterface,
  MenuConnectionProps,
  MenuTableRecord,
  MenuItemConnectionProps,
  MenuItemTableRecord,
  MenuItemTableModel,
  MenuItemConnectionCursor,
  MenuItem,
  MenuConnectionCursor,
  MenuTableModel,
  MenuServiceProps,
} from 'webmenu';

class MenuService implements MenuServiceInterface {
  #knex: MenuServiceProps['knex'];

  public constructor(props: MenuServiceProps) {
    this.#knex = props.knex;
  }

  public async getMenuConnection(
    props: MenuConnectionProps,
  ): Promise<CursorConnection<MenuTableRecord>> {
    const { first, after, last, before, id, orderBy, search } = props;

    let limit = 0;
    let offset = 0;
    let cursor: MenuConnectionCursor = {
      offset: 0,
      id,
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
        knexOrderBy.orderBy(`pagesMenu.${field}`, direction);
      });
    }

    const request = this.#knex
      .select(['pagesMenu.*'])
      .groupBy(['pagesMenu.id'])
      .limit(limit)
      .offset(offset)
      .from<
        MenuTableModel,
        ReadonlyArray<
          MenuTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
          }
        >
      >('pagesMenu');

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`pagesMenu.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['pagesMenu.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['pagesMenu.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['pagesMenu.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['pagesMenu.id']),
      ]);
    }

    if (id) {
      request.whereIn('pagesMenu.id', id);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`pagesMenu.${field}`, `%${query}%`]);
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

  public async getMenuItemsConnection(
    props: MenuItemConnectionProps,
  ): Promise<CursorConnection<MenuItem>> {
    const { first, after, last, before, orderBy, search, id, menu, pid, page, firstChildOnly } =
      props;

    let limit = 0;
    let offset = 0;
    let cursor: MenuItemConnectionCursor = {
      offset: 0,
      orderBy,
      search,
      id,
      menu,
      pid,
      page,
      firstChildOnly,
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
        knexOrderBy.orderBy(`pagesMenuItems.${field}`, direction);
      });
    }

    const request = this.#knex
      .select([
        'pagesMenuItems.*',
        this.#knex.raw('json_agg(distinct ??) as ??', ['childsList.id', 'childs']),
      ])
      .groupBy(['pagesMenuItems.id'])
      .limit(limit)
      .offset(offset)
      .from<
        MenuItemTableModel,
        ReadonlyArray<
          MenuItemTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
            readonly childs: ReadonlyArray<string | null>;
          }
        >
      >('pagesMenuItems')
      .leftJoin('pagesList', 'pagesMenuItems.page', 'pagesList.id')
      .leftJoin({ childsList: 'pagesMenuItems' }, 'childsList.pid', 'pagesMenuItems.id');

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`pagesMenuItems.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['pagesMenuItems.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['pagesMenuItems.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['pagesMenuItems.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['pagesMenuItems.id']),
      ]);
    }

    if (id) {
      request.whereIn('pagesMenuItems.id', id);
    }

    if (menu) {
      request.whereIn('pagesMenuItems.menu', menu);
    }

    if (pid) {
      request.whereIn('pagesMenuItems.pid', pid);
    }

    if (firstChildOnly) {
      request.whereNull('pagesMenuItems.pid');
    }

    if (page) {
      request.whereIn('pagesMenuItems.page', page);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`pagesMenuItems.${field}`, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((record, index) => {
      const childs = record.childs.filter(p => p !== null);

      return {
        node: {
          ...record,
          childs: childs.length ? childs : null,
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
}

export default MenuService;
