import {
  BlogPostTableRecord,
  BlogServiceInterface,
  BlogServiceProps,
  GetBlogConnectionProps,
  BlogConnectionCursor,
  BlogPostTableModel,
} from 'blog';
import { CursorConnection } from '@via-profit-services/core';

class BlogService implements BlogServiceInterface {
  #knex: BlogServiceProps['knex'];
  constructor(props: BlogServiceProps) {
    this.#knex = props.knex;
  }

  public async getPostsConnection(
    props: GetBlogConnectionProps,
  ): Promise<CursorConnection<BlogPostTableRecord>> {
    const { first, after, last, before, id, orderBy, search } = props;

    let limit = 0;
    let offset = 0;
    let cursor: BlogConnectionCursor = {
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
        knexOrderBy.orderBy(`p.${field}`, direction);
      });
    }

    const request = this.#knex.select(['p.*']).groupBy(['p.id']).limit(limit).offset(offset).from<
      BlogPostTableModel,
      ReadonlyArray<
        BlogPostTableRecord & {
          readonly prev: string | null;
          readonly next: string | null;
        }
      >
    >({ p: 'blogPosts' });
    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`p.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['p.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['p.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['p.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['p.id']),
      ]);
    }

    if (id) {
      request.whereIn('p.id', id);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`p.${field}`, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((record, index) => ({
      node: {
        ...record,
      },
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

export default BlogService;
