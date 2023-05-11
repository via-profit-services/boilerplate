![project-cover](./assets/via-profit-services-cover.png)

# GraphQL/Relay Boilerplate

> Boilerplate system containing in its distribution a GraphQL backend server, a Content Management System on RelayJS and a website on RelayJS with support for Server Side Render.


## Prepare to start

1. Create the PostgreSQL database like this:

```bash
$ sudo -u postgres psql # To go to psql shell
```


_Example of PostgreSQL database configuration_:

```sql
create database boilerplate; -- Create database
create user boilerplate with password 'admin'; -- Create user
alter database boilerplate owner to boilerplate; -- Grant all privileges
```

2. Copy the `.env.example` files to `.env` for each project:

```bash
$ cp ./packages/website/.env.example ./packages/website/.env && cp ./packages/web-admin/.env.example ./packages/web-admin/.env && cp ./packages/graphql-server/.env.example ./packages/graphql-server/.env && cp ./packages/graphql-server/.knex/.env.example ./packages/graphql-server/.knex/.env
```

Configure the `.env` files - fill in the correct data.

3. Setting up the JWT Keys.

For JWT to work, it is necessary to generate SSH keys using an algorithm, for example, **RS256**.

**Note:** _When requesting passphrase, just press Enter to leave this parameter empty. The same must be done when confirming passphrase._

At the root of the project (at the same level as package.json) create a keys directory and create keys in it by executing the commands:

```bash
$ mkdir -p ./packages/graphql-server/.keys
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key  # Don't add passphrase, just press Enter
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
$ mv ./jwtRS256.key ./packages/graphql-server/.keys/
$ mv ./jwtRS256.key.pub ./packages/graphql-server/.keys/
```

3. Build migrations.

```bash
$ npm run build:migrations
```

4. Apply migrations.

```bash
$ npm run migrate:latest
```

5. (optional) Apply the seeds.

```bash
$ npm run seed:run
```