# GraphQL boilerplate

> GraphQL server

1. Copy `.env.example` file to `.env`
2. Copy `./.knex/.env.example` file to `./.knex/.env`

```bash
$ cp ./.env.example ./.env
$ cp ./.knex/.env.example ./.knex/.env
```

3. Make a `./.keys` directory and generate keys

```bash
$ mkdir ./.keys && cd ./.keys
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key # Don't add passphrase, just press Enter
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
$ cd ..
```

4. Build migrations: `npm run build:migrations`
5. Apply migrations: `npm run migrate:latest`
5. Apply seeds: `npm run seed:run`


2. Start the project:

```bash
$ npm run start
```
