import { CursorConnection } from '@via-profit-services/core';

import type FilesService from '~/services/FilesService';
import type {
  PagesServiceInterface,
  PagesTableModel,
  Page,
  PagesTableRecord,
  PagesMetaTableRecord,
  GetPagesConnectionProps,
  PagesConnectionCursor,
  PageMeta,
  GetContentBlocksConnectionProps,
  ContentBlock,
  ContentBlockConnectionCursor,
  ContentBlocksTableModel,
  ContentBlocksTableRecord,
  GetTemplatesConnectionProps,
  Template,
  TemplatesConnectionCursor,
  TemplatesTableModel,
  TemplatesTableRecord,
  ContentBlockPlainTextPayload,
  ContentBlockImagePayload,
  ContentBlockFormattedPayload,
  CreateContentBlockPlainTextProps,
  CreateContentBlockImageProps,
  CreateContentBlockFormattedTextProps,
  UpdateContentBlockPlainTextProps,
  UpdateContentBlockFormattedTextProps,
  UpdateContentBlockImageProps,
  ContentBlockImageTableModel,
  ContentBlockFormattedTextTableModel,
  ContentBlockPlainTextTableModel,
  ContentBlockImageTableRecord,
  PagesServiceProps,
} from 'webpages';

class PagesService implements PagesServiceInterface {
  #knex: PagesServiceProps['knex'];

  public constructor(props: PagesServiceProps) {
    this.#knex = props.knex;
  }

  public async getPagesConnection(props: GetPagesConnectionProps): Promise<CursorConnection<Page>> {
    const { first, after, last, before, id, path, orderBy, search, template, statusCode } = props;

    let limit = 0;
    let cursor: PagesConnectionCursor = {
      offset: 0,
      id,
      orderBy,
      search,
      path,
      template,
      statusCode,
    };

    if (first && !after) {
      limit = first;
      cursor.offset = 0;
    }

    if (first && after) {
      cursor = JSON.parse(Buffer.from(after, 'base64').toString('utf8'));
      limit = first;
      cursor.offset = cursor.offset + 1;
    }

    if (last && before) {
      cursor = JSON.parse(Buffer.from(before, 'base64').toString('utf8'));
      limit = last;
      cursor.offset = cursor.offset - last;
    }

    const knexOrderBy = this.#knex.queryBuilder();
    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        knexOrderBy.orderBy(`p.${field}`, direction);
      });
    }

    const request = this.#knex
      .select([
        'p.*',
        this.#knex.raw('jsonb_agg(??) as ??', ['pagesMeta.*', 'meta']),
        this.#knex.raw('jsonb_agg(distinct ??) as ??', ['childsList.id', 'childs']),
        this.#knex.raw("case when count(cb.id) > 0 then jsonb_agg(??) else '[]'::jsonb end as ??", [
          'cb.id',
          'contentBlocks',
        ]),
      ])
      .groupBy(['p.id'])
      .limit(limit)
      .offset(cursor.offset)
      .from<
        PagesTableModel,
        ReadonlyArray<
          PagesTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
            readonly meta: ReadonlyArray<PagesMetaTableRecord | null>;
            readonly childs: ReadonlyArray<string | null>;
            readonly contentBlocks: ReadonlyArray<string | null>;
          }
        >
      >({ p: 'pagesList' })
      .leftJoin('pagesMeta', 'pagesMeta.page', 'p.id')
      .leftJoin({ cb: 'contentBlocks' }, 'cb.page', 'p.id')
      .leftJoin({ childsList: 'pagesList' }, 'childsList.pid', 'p.id');

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

    if (cursor.id) {
      request.whereIn('p.id', cursor.id);
    }

    if (cursor.path) {
      request.whereIn('p.path', cursor.path);
    }

    if (cursor.template) {
      request.whereIn('p.template', cursor.template);
    }

    if (cursor.statusCode) {
      request.whereIn('p.statusCode', cursor.statusCode);
    }

    if (cursor.search) {
      request.where(builder => {
        cursor.search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`p.${field}`, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((record, index) => {
      const metaData: Partial<PageMeta> = record.meta[0] !== null ? record.meta[0] : {};
      const childs = record.childs.filter(p => p !== null);

      return {
        node: {
          ...record,
          childs: childs.length ? childs : null,
          meta: {
            page: record.id,
            locale: metaData?.locale || null,
            title: metaData?.title || null,
            description: metaData?.description || null,
            keywords: metaData?.keywords || null,
          },
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

  public async getContentBlocksConnection(
    props: GetContentBlocksConnectionProps,
  ): Promise<CursorConnection<ContentBlock>> {
    const { first, after, last, before, id, type, name, page, orderBy, template } = props;

    let limit = 0;
    let offset = 0;
    let cursor: ContentBlockConnectionCursor = {
      offset: 0,
      template,
      orderBy,
      id,
      type,
      page,
      name,
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
        knexOrderBy.orderBy(`cb.${field}`, direction);
      });
    }

    const request = this.#knex
      .select([
        'cb.*',
        // knex.raw(''),
        this.#knex.raw('case when count("cbplain") = 0 then null else jsonb_agg(??)->0 end as ??', [
          'cbplain.*',
          'cbPlainText',
        ]),
        this.#knex.raw('case when count("cbfrmt") = 0 then null else jsonb_agg(??)->0 end as ??', [
          'cbfrmt.*',
          'cbFormatted',
        ]),
        this.#knex.raw('case when count("cbimg") = 0 then null else jsonb_agg(??)->0 end as ??', [
          'cbimg.*',
          'cbImage',
        ]),
      ])
      .groupBy(['cb.id'])
      .limit(limit)
      .leftJoin({ cbplain: 'contentBlockPlainText' }, 'cb.id', 'cbplain.id')
      .leftJoin({ cbfrmt: 'contentBlockFormattedText' }, 'cb.id', 'cbfrmt.id')
      .leftJoin({ cbimg: 'contentBlockImage' }, 'cb.id', 'cbimg.id')
      .offset(offset)
      .from<
        ContentBlocksTableModel,
        ReadonlyArray<
          ContentBlocksTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
            readonly cbPlainText: ContentBlockPlainTextPayload | null;
            readonly cbFormatted: ContentBlockFormattedPayload | null;
            readonly cbImage: ContentBlockImagePayload | null;
          }
        >
      >({ cb: 'contentBlocks' });

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`cb.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['cb.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['cb.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['cb.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['cb.id']),
      ]);
    }

    if (id) {
      request.whereIn('cb.id', id);
    }

    if (name) {
      request.whereIn('cb.name', name);
    }

    if (type) {
      request.whereIn('cb.type', type);
    }

    if (page) {
      request.whereIn('cb.page', page);
    }

    if (template) {
      request.whereIn('cb.template', template);
    }

    // if (search) {
    //   request.where(builder => {
    //     search.forEach(({ field, query }) => {
    //       builder.orWhereRaw('??::text ilike ?', [`cb.${field}`, `%${query}%`]);
    //     });
    //   });
    // }

    const response = await request;
    const edges = response
      .map(({ prev, next, cbFormatted, cbImage, cbPlainText, ...record }, index) => {
        let node: ContentBlock;

        switch (true) {
          case record.type === 'PLAIN_TEXT' && cbPlainText !== null:
            node = {
              ...record,
              type: 'PLAIN_TEXT',
              text: cbPlainText.text,
            };
            break;
          case record.type === 'IMAGE' && cbImage !== null:
            node = {
              ...record,
              type: 'IMAGE',
              alt: cbImage.alt,
              title: cbImage.title,
              file: cbImage.file,
            };
            break;
          case record.type === 'FORMATTED_TEXT' && cbFormatted !== null:
            node = {
              ...record,
              type: 'FORMATTED_TEXT',
              lexical: cbFormatted.lexical,
            };
            break;
          default:
            // Do nothing
            break;
        }

        return {
          node,
          cursor: Buffer.from(
            JSON.stringify({
              ...cursor,
              offset: cursor.offset + index,
            }),
          ).toString('base64'),
        };
      })
      .filter(edge => typeof edge.node !== 'undefined');

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

  public async getTemplatesConnection(
    props: GetTemplatesConnectionProps,
  ): Promise<CursorConnection<Template>> {
    const { first, after, last, before, id, name, orderBy } = props;

    let limit = 0;
    let offset = 0;
    let cursor: TemplatesConnectionCursor = {
      offset: 0,
      orderBy,
      id,
      name,
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
        knexOrderBy.orderBy(`cb.${field}`, direction);
      });
    }

    const request = this.#knex
      .select(['t.*'])
      .groupBy(['t.id'])
      .limit(limit)
      .offset(offset)
      // .leftJoin({ cb: 'contentBlocks' }, 'cb.template', 't.id')
      .from<
        TemplatesTableModel,
        ReadonlyArray<
          TemplatesTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
            // readonly contentBlocks: readonly string[];
          }
        >
      >({ t: 'templates' });

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`t.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['t.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['t.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['t.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['t.id']),
      ]);
    }

    if (id) {
      request.whereIn('t.id', id);
    }

    if (name) {
      request.whereIn('t.name', name);
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

  public async createContentBlockPlainText(props: CreateContentBlockPlainTextProps): Promise<void> {
    const { id, text, ...baseData } = props;

    await this.#knex.transaction(async trx => {
      await trx.insert({ id, type: 'PLAIN_TEXT', ...baseData }).into('contentBlocks');
      await trx.insert({ id, text }).into('contentBlockPlainText');
      await trx.commit();
    });
  }

  public async createContentBlockImage(props: CreateContentBlockImageProps): Promise<void> {
    const { id, alt, title, file, ...baseData } = props;

    await this.#knex.transaction(async trx => {
      await trx.insert({ id, ...baseData, type: 'IMAGE' }).into('contentBlocks');
      await trx.insert({ id, alt, title, file }).into('contentBlockImage');
      await trx.commit();
    });
  }

  public async createContentBlockFormatedText(
    props: CreateContentBlockFormattedTextProps,
  ): Promise<void> {
    const { id, lexical, ...baseData } = props;

    await this.#knex.transaction(async trx => {
      await trx.insert({ id, ...baseData, type: 'FORMATTED_TEXT' }).into('contentBlocks');
      await trx.insert({ id, lexical }).into('contentBlockFormattedText');
      await trx.commit();
    });
  }

  public async updateContentBlockPlainText(props: UpdateContentBlockPlainTextProps): Promise<void> {
    const { id, text, ...baseData } = props;

    await this.#knex.transaction(async trx => {
      if (Object.keys(baseData).length > 0) {
        await this.#knex<ContentBlocksTableModel>('contentBlocks').update(baseData).where({ id });
      }
      if (typeof text !== 'undefined') {
        await this.#knex<ContentBlockPlainTextTableModel>('contentBlockPlainText')
          .update({ text })
          .where({ id });
      }

      await trx.commit();
    });
  }

  public async updateContentBlockFormattedText(
    props: UpdateContentBlockFormattedTextProps,
  ): Promise<void> {
    const { id, lexical, ...baseData } = props;

    await this.#knex.transaction(async trx => {
      if (Object.keys(baseData).length > 0) {
        await this.#knex<ContentBlocksTableModel>('contentBlocks').update(baseData).where({ id });
      }
      if (typeof lexical !== 'undefined') {
        await this.#knex<ContentBlockFormattedTextTableModel>('contentBlockFormattedText')
          .update({ lexical })
          .where({ id });
      }

      await trx.commit();
    });
  }

  public async updateContentBlockImage(props: UpdateContentBlockImageProps): Promise<void> {
    const { id, alt, title, file, ...baseData } = props;

    await this.#knex.transaction(async trx => {
      if (Object.keys(baseData).length > 0) {
        await this.#knex<ContentBlocksTableModel>('contentBlocks').update(baseData).where({ id });
      }
      if (
        typeof alt !== 'undefined' ||
        typeof title !== 'undefined' ||
        typeof file !== 'undefined'
      ) {
        await this.#knex<ContentBlockImageTableModel>('contentBlockImage')
          .update({ alt, title, file })
          .where({ id });
      }

      await trx.commit();
    });
  }

  public async deleteContentBlocks(
    ids: readonly string[],
    filesServiceInstance: FilesService,
  ): Promise<void> {
    const { edges } = await this.getContentBlocksConnection({
      first: 1,
      id: ids,
    });

    const nodes = edges.map(({ node }) => node);

    // Get only images content block IDs
    const filesIDs = nodes
      .filter((node): node is ContentBlock & ContentBlockImageTableRecord => node.type === 'IMAGE')
      .map(node => node.file);

    // remove content blocks
    await this.#knex.transaction(async trx => {
      // remove files
      if (filesIDs.length) {
        await filesServiceInstance.deleteFiles(filesIDs);
      }
      await trx<ContentBlocksTableModel>('contentBlocks').del().whereIn('id', ids);
      await trx.commit();
    });
  }

  public async deleteContentBlock(id: string, filesServiceInstance: FilesService): Promise<void> {
    return this.deleteContentBlocks([id], filesServiceInstance);
  }

  public async createPage(props: PagesTableModel): Promise<void> {
    await this.#knex<PagesTableModel>('pagesList').insert(props);
  }

  public async updatePage(id: string, props: Partial<Omit<PagesTableModel, 'id'>>): Promise<void> {
    await this.#knex<PagesTableModel>('pagesList').update(props).where({ id });
  }
}

export default PagesService;
