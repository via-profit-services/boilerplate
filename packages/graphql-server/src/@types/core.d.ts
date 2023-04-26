declare module '@via-profit-services/core' {
  import { RedisPubSub } from 'graphql-redis-subscriptions';
  import Redis from 'ioredis';
  import { Knex } from 'knex';
  import DataLoader from 'dataloader';
  import {
    User,
    Account,
    UsersService,
    JwtConfig,
    AccessTokenPayload,
    AuthentificationService,
  } from 'users';
  import { Client, ClientsService, Person } from 'clients';
  import { Deal, Funnel, FunnelStep, DealsService } from 'deals';
  import { Page, ContentBlock, PagesService, Template } from 'webpages';
  import { MenuItem, Menu, MenuService } from 'webmenu';
  import { FilesTableRecord, FilesService } from 'files';
  import { BlogPost, BlogService } from 'blog';

  interface ServicesCollection {
    authentification: AuthentificationService;
    clients: ClientsService;
    deals: DealsService;
    files: FilesService;
    users: UsersService;
    webpages: PagesService;
    webmenu: MenuService;
    blog: BlogService;
  }

  interface DataLoaderCollection {
    accounts: DataLoader<string, Account>;
    clients: DataLoader<string, Client>;
    deals: DataLoader<string, Deal>;
    files: DataLoader<string, FilesTableRecord>;
    funnels: DataLoader<string, Funnel>;
    funnelSteps: DataLoader<string, FunnelStep>;
    menuItems: DataLoader<string, MenuItem>;
    menus: DataLoader<string, Menu>;
    persons: DataLoader<string, Person>;
    users: DataLoader<string, User>;
    webpages: DataLoader<string, Page>;
    contentBlocks: DataLoader<string, ContentBlock>;
    templates: DataLoader<string, Template>;
    blog: DataLoader<string, BlogPost>;
  }

  interface Context {
    dataloader: DataLoaderCollection;
    jwt: JwtConfig;
    pubsub: RedisPubSub;
    redis: Redis;
    token: AccessTokenPayload;
    knex: Knex;
  }

  interface CoreEmitter {
    on(event: 'log-error', listener: (tag: string, message: string) => void): this;
    once(event: 'log-error', listener: (tag: string, message: string) => void): this;
    addListener(event: 'log-error', listener: (tag: string, message: string) => void): this;
    removeListener(event: 'log-error', listener: (tag: string, message: string) => void): this;
    prependListener(event: 'log-error', listener: (tag: string, message: string) => void): this;
    prependOnceListener(event: 'log-error', listener: (tag: string, message: string) => void): this;
    emit(event: 'log-error', ...args: [tag: string, message: string]): boolean;
    removeAllListeners(event: 'log-error'): this;
    listeners(event: 'log-error'): Function[];
    listenerCount(event: 'log-error'): number;

    on(event: 'log-warn', listener: (tag: string, message: string) => void): this;
    once(event: 'log-warn', listener: (tag: string, message: string) => void): this;
    addListener(event: 'log-warn', listener: (tag: string, message: string) => void): this;
    removeListener(event: 'log-warn', listener: (tag: string, message: string) => void): this;
    prependListener(event: 'log-warn', listener: (tag: string, message: string) => void): this;
    prependOnceListener(event: 'log-warn', listener: (tag: string, message: string) => void): this;
    emit(event: 'log-warn', ...args: [tag: string, message: string]): boolean;
    removeAllListeners(event: 'log-warn'): this;
    listeners(event: 'log-warn'): Function[];
    listenerCount(event: 'log-warn'): number;

    on(event: 'log-debug', listener: (tag: string, message: string) => void): this;
    once(event: 'log-debug', listener: (tag: string, message: string) => void): this;
    addListener(event: 'log-debug', listener: (tag: string, message: string) => void): this;
    removeListener(event: 'log-debug', listener: (tag: string, message: string) => void): this;
    prependListener(event: 'log-debug', listener: (tag: string, message: string) => void): this;
    prependOnceListener(event: 'log-debug', listener: (tag: string, message: string) => void): this;
    emit(event: 'log-debug', ...args: [tag: string, message: string]): boolean;
    removeAllListeners(event: 'log-debug'): this;
    listeners(event: 'log-debug'): Function[];
    listenerCount(event: 'log-debug'): number;

    on(event: 'log-info', listener: (tag: string, message: string) => void): this;
    once(event: 'log-info', listener: (tag: string, message: string) => void): this;
    addListener(event: 'log-info', listener: (tag: string, message: string) => void): this;
    removeListener(event: 'log-info', listener: (tag: string, message: string) => void): this;
    prependListener(event: 'log-info', listener: (tag: string, message: string) => void): this;
    prependOnceListener(event: 'log-info', listener: (tag: string, message: string) => void): this;
    emit(event: 'log-info', ...args: [tag: string, message: string]): boolean;
    removeAllListeners(event: 'log-info'): this;
    listeners(event: 'log-info'): Function[];
    listenerCount(event: 'log-info'): number;

    on(event: 'knex-debug', listener: (message: string) => void): this;
    once(event: 'knex-debug', listener: (message: string) => void): this;
    addListener(event: 'knex-debug', listener: (message: string) => void): this;
    removeListener(event: 'knex-debug', listener: (message: string) => void): this;
    prependListener(event: 'knex-debug', listener: (message: string) => void): this;
    prependOnceListener(event: 'knex-debug', listener: (message: string) => void): this;
    emit(event: 'knex-debug', ...args: [message: string]): boolean;
    removeAllListeners(event: 'knex-debug'): this;
    listeners(event: 'knex-debug'): Function[];
    listenerCount(event: 'knex-debug'): number;

    on(event: 'knex-error', listener: (err: Error) => void): this;
    once(event: 'knex-error', listener: (err: Error) => void): this;
    addListener(event: 'knex-error', listener: (err: Error) => void): this;
    removeListener(event: 'knex-error', listener: (err: Error) => void): this;
    prependListener(event: 'knex-error', listener: (err: Error) => void): this;
    prependOnceListener(event: 'knex-error', listener: (err: Error) => void): this;
    emit(event: 'knex-error', ...args: [err: Error]): boolean;
    removeAllListeners(event: 'knex-error'): this;
    listeners(event: 'knex-error'): Function[];
    listenerCount(event: 'knex-error'): number;

    on(event: 'redis-error', listener: (error: Error) => void): this;
    once(event: 'redis-error', listener: (error: Error) => void): this;
    addListener(event: 'redis-error', listener: (error: Error) => void): this;
    removeListener(event: 'redis-error', listener: (error: Error) => void): this;
    prependListener(event: 'redis-error', listener: (error: Error) => void): this;
    prependOnceListener(event: 'redis-error', listener: (error: Error) => void): this;
    emit(event: 'redis-error', ...args: [error: Error]): boolean;
    removeAllListeners(event: 'redis-error'): this;
    listeners(event: 'redis-error'): Function[];
    listenerCount(event: 'redis-error'): number;
  }
}
