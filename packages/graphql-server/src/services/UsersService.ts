import type {
  UsersServiceProps,
  UsersServiceInterface,
  AccountsTableModel,
  AccountsTableRecord,
  UsersTableModel,
  UsersTableRecord,
  GetUsersConnectionProps,
  User,
  UsersConnectionCursor,
  Role2PrivilegesTableRecord,
  Account2RolesTableRecord,
  Account,
  GetAccountsConnectionProps,
  AccountsConnectionCursor,
} from 'users';
import { CursorConnection } from '@via-profit-services/core';

class UsersService implements UsersServiceInterface {
  #knex: UsersServiceProps['knex'];

  public constructor(props: UsersServiceProps) {
    this.#knex = props.knex;
  }

  public async updateAccount(id: string, accountData: Partial<AccountsTableModel>) {
    await this.#knex('accounts').update<AccountsTableModel>(accountData).where('id', id);
  }

  public async createAccount(accountData: AccountsTableModel) {
    const result = await this.#knex('accounts')
      .insert<AccountsTableModel>(accountData)
      .returning<AccountsTableRecord[]>('id');

    return result[0].id;
  }

  public async deleteAccounts(ids: string[]) {
    await this.#knex('accounts').del().whereIn('id', ids);
  }

  public async deleteAccount(id: string) {
    return this.deleteAccounts([id]);
  }

  public async checkLoginExists(login: string, skipId?: string): Promise<boolean> {
    const request = this.#knex
      .select<AccountsTableRecord[]>('id')
      .from<AccountsTableRecord>('accounts')
      .where({
        login,
      });

    if (skipId) {
      request.whereNotIn('id', [skipId]);
    }

    const list = await request;

    return !!list.length;
  }

  public async deleteUsers(ids: readonly string[]): Promise<void> {
    await this.#knex('users').del().whereIn('id', ids);
  }

  public async deleteUser(id: string): Promise<void> {
    return this.deleteUsers([id]);
  }

  public async createUser(data: UsersTableModel): Promise<string> {
    const [{ id }] = await this.#knex('users')
      .insert<UsersTableModel>(data)
      .returning<UsersTableRecord[]>('id');

    return id;
  }

  public async updateUser(id: string, data: Partial<UsersTableModel>): Promise<void> {
    await this.#knex('users').update<UsersTableModel>(data).where('id', id);
  }

  public async getUsersConnection(props: GetUsersConnectionProps): Promise<CursorConnection<User>> {
    const { first, after, last, before, id, account, orderBy, search } = props;

    let limit = 0;
    let offset = 0;
    let cursor: UsersConnectionCursor = {
      offset: 0,
      id,
      account,
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
        knexOrderBy.orderBy(`users.${field}`, direction);
      });
    }

    const request = this.#knex
      .select(['users.*', this.#knex.raw('json_agg(distinct ??) AS ??', ['files.id', 'avatars'])])
      .groupBy(['users.id'])
      .limit(limit)
      .offset(offset)
      .from<
        UsersTableModel,
        ReadonlyArray<
          UsersTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
            readonly avatars: readonly (string | null)[];
          }
        >
      >('users')
      .leftJoin('accounts', 'accounts.id', 'users.account')
      .leftJoin('files', builder =>
        builder
          .on('files.owner', '=', 'users.id')
          .andOn(this.#knex.raw('?? = ?', ['files.type', 'AVATAR'])),
      );

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`users.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['users.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['users.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['users.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['users.id']),
      ]);
    }

    if (account) {
      request.whereIn('accounts.id', account);
    }

    if (id) {
      request.whereIn('users.id', id);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`users.${field}`, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((record, index) => {
      const { avatars, ...nodeData } = record;
      const avatar = typeof avatars[0] === 'string' ? avatars[0] : null;

      return {
        node: {
          ...nodeData,
          avatar,
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

  public async getAccountsConnection(
    props: GetAccountsConnectionProps,
  ): Promise<CursorConnection<Account>> {
    const { first, after, last, before, id, user, orderBy, search } = props;

    let limit = 0;
    let offset = 0;
    let cursor: AccountsConnectionCursor = {
      offset: 0,
      id,
      user,
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
        knexOrderBy.orderBy(field, direction);
      });
    }

    const request = this.#knex
      .select([
        'accounts.*',
        this.#knex.raw('json_agg(distinct ??) AS "roles"', ['account2roles.role']),
        this.#knex.raw('json_agg(distinct ??) AS "privileges"', ['role2privileges.privilege']),
        this.#knex.raw('json_agg(distinct ??) AS "users"', ['users.*']),
      ])
      .groupBy(['accounts.id'])
      .limit(limit)
      .offset(offset)
      .from<
        AccountsTableRecord,
        ReadonlyArray<
          AccountsTableRecord & {
            readonly prev: string | null;
            readonly next: string | null;
            readonly users: UsersTableRecord[] | [null];
            readonly privileges: Role2PrivilegesTableRecord['privilege'][] | [null];
            readonly roles: Account2RolesTableRecord['role'][] | [null];
          }
        >
      >('accounts')
      .leftJoin('users', 'users.account', 'accounts.id')
      .leftJoin('account2roles', 'account2roles.account', 'accounts.id')
      .leftJoin('role2privileges', 'role2privileges.role', 'account2roles.role');

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`files.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['accounts.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['accounts.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['accounts.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['accounts.id']),
      ]);
    }

    if (user) {
      request.whereIn('users.id', user);
    }

    if (id) {
      request.whereIn('accounts.id', id);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [`accounts.${field}`, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((row, index) => {
      const { users, ...node } = row;

      return {
        node: {
          ...node,
          privileges: node.privileges.filter(p => p !== null),
          roles: node.roles.filter(r => r !== null),
          user: users.filter(a => a !== null)[0]?.id || null,
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

export default UsersService;
