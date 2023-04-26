/* eslint-disable import/prefer-default-export */
import bcryptjs from 'bcryptjs';
import { Knex } from 'knex';
import type {
  UsersTableModel,
  AccountsTableModel,
  PrivilegesTableModel,
  Role2PrivilegesTableModel,
  RolesTableModel,
  Account2RolesTableModel,
} from 'users';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<any> {
  const salt = bcryptjs.genSaltSync(10);

  const devUser: UsersTableModel = {
    id: 'ca8774c4-5fd3-4032-975d-67db9e864879',
    name: 'Developer',
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    account: 'dd59defa-eb48-4f27-b2b5-354799128f3d',
  };

  const devAccount: AccountsTableModel = {
    id: devUser.account,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    login: 'dev',
    password: bcryptjs.hashSync('dev.dev', salt),
    status: 'allowed',
  };

  const privileges: PrivilegesTableModel[] = [
    { privilege: 'Users_CreateEditUser' },
    { privilege: 'Users_PrivilegesAssignment' },
    { privilege: 'Users_UsersList' },
  ];

  const roles: RolesTableModel[] = [
    { role: 'developer' },
    { role: 'administrator' },
    { role: 'viewer' },
    { role: 'copywriter' },
    { role: 'optimizator' },
  ];

  const role2privileges: Role2PrivilegesTableModel[] = [
    { role: 'administrator', privilege: 'Users_CreateEditUser' },
    { role: 'administrator', privilege: 'Users_PrivilegesAssignment' },
    { role: 'administrator', privilege: 'Users_UsersList' },
  ];

  await knex('accounts').del();
  await knex('users').del();
  await knex('privileges').del();
  await knex('roles').del();
  await knex('role2privileges').del();
  await knex('account2roles').del();

  await knex('roles').insert(roles);
  await knex('privileges').insert(privileges);
  await knex('accounts').insert([devAccount]);
  await knex('users').insert([devUser]);
  await knex('role2privileges').insert(role2privileges);
  await knex<Account2RolesTableModel>('account2roles').insert([
    { account: devAccount.id, role: 'developer' },
  ]);

  const usersLength = 10;
  let loopIndex = 0;
  await [...new Array(10).keys()].reduce(async prev => {
    await prev;

    const accounts: AccountsTableModel[] = [];
    const users: UsersTableModel[] = [];
    const account2roles: Account2RolesTableModel[] = [];
    [...new Array(Math.floor(usersLength / 10)).keys()].forEach(() => {
      loopIndex += 1;
      const date = new Date();
      const accountID = uuidv4();
      const userID = uuidv4();
      const login = `0000${loopIndex}`.slice(-4);
      const password = bcryptjs.hashSync(`${login}.${login}`, salt);
      const createdAt = date.toDateString();
      const updatedAt = date.toDateString();
      const name = `Tester ${login}`;

      accounts.push({
        id: accountID,
        login,
        password,
        createdAt,
        updatedAt,
        status: 'allowed',
      });

      users.push({
        id: userID,
        account: accountID,
        createdAt,
        updatedAt,
        name,
      });

      account2roles.push({
        account: accountID,
        role: roles[Math.floor(Math.random() * roles.length)].role, // get random role name
      });
    });

    await knex('accounts').insert(accounts);
    await knex('users').insert(users);
    await knex('account2roles').insert(account2roles);
  }, Promise.resolve());
}
