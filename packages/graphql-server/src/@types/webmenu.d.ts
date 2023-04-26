declare module 'webmenu' {
  import { Knex } from 'knex';
  import { Middleware, CursorConnection } from '@via-profit-services/core';
  import { PageWindowTarget } from 'webpages';

  export interface MenuTableModel {
    readonly id: string;
    readonly name: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  }

  export interface MenuTableRecord {
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }

  export interface MenuItemTableModel {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly pid: string | null;
    readonly name: string | null;
    readonly menu: string;
    readonly page: string | null;
    readonly url: string | null;
    readonly visible: boolean;
    readonly order: number;
    readonly target: PageWindowTarget;
  }

  export interface MenuItemTableRecord {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly pid: string | null;
    readonly name: string | null;
    readonly menu: string;
    readonly page: string | null;
    readonly url: string | null;
    readonly visible: boolean;
    readonly order: number;
    readonly target: PageWindowTarget;
  }
  export interface MenuItem extends MenuItemTableRecord {
    readonly childs: readonly string[] | null;
  }

  export type Menu = MenuTableRecord;

  export interface MenuConnectionCursor {
    offset: number;
    user?: readonly string[] | null;
    id?: readonly string[] | null;
    orderBy?: MenuConnectionProps['orderBy'];
    search?: MenuConnectionProps['search'];
  }

  export interface MenuConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly orderBy?:
      | {
          readonly field: 'createdAt' | 'updatedAt';
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

  export interface MenuItemConnectionCursor {
    offset: number;
    user?: readonly string[] | null;
    id?: readonly string[] | null;
    menu?: readonly string[] | null;
    pid?: readonly string[] | null;
    firstChildOnly?: true | null;
    page?: readonly string[] | null;
    orderBy?: MenuItemConnectionProps['orderBy'];
    search?: MenuItemConnectionProps['search'];
  }

  export interface MenuItemConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly menu?: readonly string[] | null;
    readonly pid?: readonly string[] | null;
    readonly firstChildOnly?: true | null;
    readonly page?: readonly string[] | null;
    readonly orderBy?:
      | {
          readonly field: 'order' | 'createdAt' | 'updatedAt';
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

  export interface MenuServiceInterface {
    getMenuConnection(props: MenuConnectionProps): Promise<CursorConnection<Menu>>;
    getMenuItemsConnection(props: MenuItemConnectionProps): Promise<CursorConnection<MenuItem>>;
  }

  interface MenuService extends MenuServiceInterface {}

  export interface MenuServiceProps {
    readonly knex: Knex;
  }

  export class MenuService {
    constructor(props: MenuServiceProps);
  }

  export type WebMenuMiddlewareFactory = () => Middleware;
}
