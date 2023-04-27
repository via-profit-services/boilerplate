declare module 'webpages' {
  import type { Knex } from 'knex';
  import type { Middleware, CursorConnection } from '@via-profit-services/core';
  import type FilesService from '~/services/FilesService';

  export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

  export type ContentBlockType = 'IMAGE' | 'PLAIN_TEXT' | 'FORMATTED_TEXT';
  export type PageWindowTarget = 'SELF' | 'BLANK';
  export type TemplateName =
    | 'TemplateHomePage'
    | 'TemplateSecondPage'
    | 'TemplateFallbackPage'
    | 'TemplateBlogPage'
    | 'TemplateBlogPostPage';

  export interface Page {
    readonly id: string;
    readonly pid: string | null;
    readonly childs: readonly string[] | null;
    readonly path: string;
    readonly order: number;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly statusCode: number;
    readonly template: string;
    readonly meta: PageMeta;
    readonly contentBlocks: readonly string[];
  }

  export type PageParent = Page;

  export interface PageMeta {
    readonly page: string;
    readonly locale: string | null;
    readonly title: string | null;
    readonly description: string | null;
    readonly keywords: string | null;
  }

  export interface ContentBlockBase {
    readonly id: string;
    readonly page: string;
    readonly template: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly name: string;
  }

  export interface ContentBlockPlainTextPayload {
    readonly type: 'PLAIN_TEXT';
    readonly text: string;
  }

  export interface ContentBlockFormattedPayload {
    readonly type: 'FORMATTED_TEXT';
    readonly lexical: Record<string, any>;
  }

  export interface ContentBlockImagePayload {
    readonly type: 'IMAGE';
    readonly file: string;
    readonly alt: string;
    readonly title: string;
  }

  export type ContentBlock = ContentBlockBase &
    (ContentBlockPlainTextPayload | ContentBlockFormattedPayload | ContentBlockImagePayload);

  export interface Template {
    readonly id: string;
    readonly name: TemplateName;
    readonly displayName: string;
  }

  export interface TemplateParent extends Template {
    readonly __typename: TemplateName;
    readonly page: string | null;
    readonly contentBlocks: readonly ContentBlock[];
  }

  export interface PagesTableModel {
    readonly id: string;
    readonly pid: string | null;
    readonly path: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly template: string | null;
    readonly name: string;
    readonly order: number;
    readonly statusCode: number;
  }

  export interface PagesTableRecord {
    readonly id: string;
    readonly pid: string | null;
    readonly path: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly template: string;
    readonly name: string;
    readonly order: number;
    readonly statusCode: number;
  }

  export interface PagesMetaTableModel {
    readonly page: string;
    readonly locale: string | null;
    readonly title: string | null;
    readonly description: string | null;
    readonly keywords: string | null;
  }

  export interface PagesMetaTableRecord {
    readonly page: string;
    readonly locale: string | null;
    readonly title: string | null;
    readonly description: string | null;
    readonly keywords: string | null;
  }

  export interface TemplatesTableModel {
    readonly id: string;
    readonly name: TemplateName;
    readonly displayName: string;
  }

  export interface TemplatesTableRecord {
    readonly id: string;
    readonly name: TemplateName;
    readonly displayName: string;
  }

  export interface ContentBlocksTableModel {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly page: string | null;
    readonly name: string;
    readonly type: ContentBlockType;
    readonly template: string;
  }

  export interface ContentBlocksTableRecord {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly page: string | null;
    readonly name: string;
    readonly type: ContentBlockType;
    readonly template: string;
  }

  export interface ContentBlockPlainTextTableModel {
    readonly id: string;
    readonly text: string;
  }

  export interface ContentBlockFormattedTextTableModel {
    readonly id: string;
    readonly lexical: string;
  }

  export interface ContentBlockImageTableModel {
    readonly id: string;
    readonly alt: string | string;
    readonly title: string | string;
    readonly file: string;
  }

  export type ContentBlockPlainTextTableRecord = ContentBlockPlainTextTableModel;
  export type ContentBlockFormattedTextTableRecord = ContentBlockFormattedTextTableModel;
  export type ContentBlockImageTableRecord = ContentBlockImageTableModel;

  export interface WebSlider {
    readonly autoplay: boolean;
    readonly delay: number;
    readonly slides: {
      readonly id: string;
      readonly image: string;
    }[];
  }

  export interface PagesConnectionCursor {
    offset: number;
    id?: readonly string[] | null;
    path?: readonly string[] | null;
    template?: readonly string[] | null;
    statusCode?: readonly number[] | null;
    orderBy?: GetPagesConnectionProps['orderBy'];
    search?: GetPagesConnectionProps['search'];
  }

  export interface ContentBlockConnectionCursor {
    offset: number;
    id?: readonly string[] | null;
    name?: readonly string[] | null;
    page?: readonly string[] | null;
    template?: readonly string[] | null;
    type?: readonly ContentBlockType[] | null;
    orderBy?: GetContentBlocksConnectionProps['orderBy'];
  }

  export interface TemplatesConnectionCursor {
    offset: number;
    id?: readonly string[] | null;
    name?: readonly string[] | null;
    displayName?: readonly string[] | null;
    orderBy?: GetTemplatesConnectionProps['orderBy'];
  }

  export interface GetPagesConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly path?: readonly string[] | null;
    readonly template?: readonly string[] | null;
    readonly statusCode?: readonly number[] | null;
    readonly orderBy?:
      | {
          readonly field: 'name' | 'order' | 'createdAt' | 'updatedAt';
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

  export interface GetContentBlocksConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly page?: readonly string[] | null;
    readonly name?: readonly string[] | null;
    readonly template?: readonly string[] | null;
    readonly type?: readonly ContentBlockType[] | null;
    readonly orderBy?:
      | {
          readonly field: 'name' | 'type' |  'createdAt' | 'updatedAt';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
  }

  export interface GetTemplatesConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly name?: readonly string[] | null;
    readonly orderBy?:
      | {
          readonly field: 'displayName' | 'name';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
  }

  export interface CreateContentBlockPlainTextProps extends Omit<ContentBlocksTableModel, 'type'> {
    readonly text: string;
  }

  export interface CreateContentBlockFormattedTextProps
    extends Omit<ContentBlocksTableModel, 'type'> {
    readonly lexical: string;
  }

  export interface CreateContentBlockImageProps extends Omit<ContentBlocksTableModel, 'type'> {
    readonly alt: string | string;
    readonly title: string | string;
    readonly file: string;
  }

  export type UpdateContentBlockPlainTextProps = Partial<
    Omit<ContentBlocksTableModel, 'type'> & {
      readonly text?: string;
    }
  >;

  export type UpdateContentBlockFormattedTextProps = Partial<
    Omit<ContentBlocksTableModel, 'type'> & {
      readonly lexical?: string;
    }
  >;

  export type UpdateContentBlockImageProps = Partial<
    Omit<ContentBlocksTableModel, 'type'> & {
      readonly file?: string;
      readonly alt?: string | null;
      readonly title?: string | null;
    }
  >;

  type CreatePageProps = PagesTableModel;
  type UpdatePageProps = Partial<Omit<PagesTableModel, 'id'>>;

  export interface PagesServiceInterface {
    getPagesConnection(props: GetPagesConnectionProps): Promise<CursorConnection<Page>>;
    getContentBlocksConnection(
      props: GetContentBlocksConnectionProps,
    ): Promise<CursorConnection<ContentBlock>>;
    getTemplatesConnection(props: GetTemplatesConnectionProps): Promise<CursorConnection<Template>>;
    createContentBlockPlainText(props: CreateContentBlockPlainTextProps): Promise<void>;
    createContentBlockImage(props: CreateContentBlockImageProps): Promise<void>;
    createContentBlockFormatedText(props: CreateContentBlockFormattedTextProps): Promise<void>;
    updateContentBlockPlainText(props: UpdateContentBlockPlainTextProps): Promise<void>;
    updateContentBlockFormattedText(props: UpdateContentBlockFormattedTextProps): Promise<void>;
    updateContentBlockImage(props: UpdateContentBlockImageProps): Promise<void>;
    createPage(props: CreatePageProps): Promise<void>;
    updatePage(id: string, props: UpdatePageProps): Promise<void>;
    deleteContentBlocks(ids: readonly string[], filesServiceInstance: FilesService): Promise<void>;
    deleteContentBlock(id: string, filesServiceInstance: FilesService): Promise<void>;
  }

  interface PagesService extends PagesServiceInterface {}

  export interface PagesServiceProps {
    readonly knex: Knex;
  }

  export class PagesService {
    constructor(props: PagesServiceProps);
  }

  export type PagesMiddlewareFactory = () => Middleware;
}
