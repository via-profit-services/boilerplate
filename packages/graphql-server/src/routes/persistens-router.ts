import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { HTTPListener } from '@via-profit-services/core';
import type LoggerService from '~/services/LoggerService';

import { ApplicationConfig } from 'common';

interface Props extends ApplicationConfig {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly graphqlHTTP: HTTPListener;
  readonly loggerService: LoggerService;
}

class PersistedMap {
  #persistedMap = new Map<string, string>();
  #filename = path.resolve(__dirname, '../relay/persisted-queries.json');

  public constructor() {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Development mode only');
    }

    if (!fs.existsSync(path.dirname(this.#filename))) {
      fs.mkdirSync(path.dirname(this.#filename), { recursive: true });
      fs.writeFileSync(this.#filename, '{}', { encoding: 'utf8' });
    }

    this.loadFromSource();
  }

  private loadFromSource() {
    const persistedPaylaod = fs.readFileSync(this.#filename, { encoding: 'utf8' });

    this.#persistedMap = new Map<string, string>(Object.entries(JSON.parse(persistedPaylaod)));
  }

  public clear() {
    this.#persistedMap = new Map();
    this.write();
  }

  public add(query: string): string {
    const id = crypto.createHash('md5').update(query).digest('hex');
    this.#persistedMap.set(id, query);
    this.write();

    return id;
  }

  public write() {
    const queryMapPayload: string[] = [];
    this.#persistedMap.forEach((value, key) => {
      queryMapPayload.push(`  ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
    });
    fs.writeFileSync(this.#filename, `{\n${queryMapPayload.join(',\n')}\n}`, {
      encoding: 'utf8',
    });
  }
}

const persistensRoute = async (props: Props) => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Development mode only');
  }

  const { req, res } = props;
  if (req.method !== 'POST') {
    res.statusCode = 400;

    return res.end();
  }

  const queryMap = new PersistedMap();
  const buffers: Buffer[] = [];

  const readQuery = async () =>
    new Promise<string>(resolve => {
      req.on('data', chunk => buffers.push(chunk));
      req.on('end', async () => {
        const data = Buffer.concat(buffers).toString();
        const text = new URLSearchParams(data).get('text');
        if (text === null) {
          throw new Error('Expected to have `text` parameter in the POST.');
        }

        const id = queryMap.add(text);

        resolve(id);
      });
    });

  const id = await readQuery();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  return res.end(JSON.stringify({ id: id }));
};

export default persistensRoute;
