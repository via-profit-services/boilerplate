declare module 'blog' {
  import type { Knex } from 'knex';
  import type { CursorConnection, Middleware } from '@via-profit-services/core';

  export interface BlogAuthorsTableModel {
    readonly id: string;
    readonly name: string;
  }

  export type BlogPostParent = BlogPost;

  export type BlogAuthorsTableRecord = BlogAuthorsTableModel;

  export interface BlogPostTableModel {
    readonly id: string;
    readonly page: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly author: string | null;
    readonly publishedAt: string;
    readonly name: string;
  }

  export type BlogPostTableRecord = Omit<
    BlogPostTableModel,
    'createdAt' | 'updatedAt' | 'publishedAt'
  > & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly publishedAt: Date;
  };

  export interface BlogConnectionCursor {
    offset: number;
    id?: readonly string[] | null;
    orderBy?: GetBlogConnectionProps['orderBy'];
    search?: GetBlogConnectionProps['search'];
  }

  export interface GetBlogConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly orderBy?:
      | {
          readonly field: 'publishedAt';
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

  export type BlogPost = BlogPostTableRecord;

  export interface BlogServiceInterface {
    getPostsConnection(props: GetBlogConnectionProps): Promise<CursorConnection<BlogPost>>;
  }

  interface BlogService extends BlogServiceInterface {}

  export interface BlogServiceProps {
    readonly knex: Knex;
  }

  class BlogService {
    constructor(props: BlogServiceProps);
  }

  export type BlogMiddlewareFactory = () => Middleware;
}
