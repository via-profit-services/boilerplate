import http from 'node:http';
import { Readable } from 'node:stream';
import zlib from 'node:zlib';
import { HTTPListener } from '@via-profit-services/core';
import type LoggerService from '~/services/LoggerService';

import { ApplicationConfig } from 'common';

interface Props extends ApplicationConfig {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly graphqlHTTP: HTTPListener;
  readonly loggerService: LoggerService;
}

const graphqlRoute = async (props: Props) => {
  const { req, res, graphqlHTTP, debug } = props;
  const { headers, method } = req;
  const { data, errors, extensions } = await graphqlHTTP(req, res);
  const response = JSON.stringify({
    data,
    errors,
    extensions: debug ? extensions : undefined,
  });

  const acceptEncoding = String(headers?.['accept-encoding'] || '')
    .split(',')
    .map(value => value.trim());

  res.statusCode = 200;
  res.setHeader('content-type', 'application/json');

  if (['GET', 'POST'].includes(method)) {
    const stream = Readable.from([response]);

    switch (true) {
      case acceptEncoding.includes('gzip'):
        res.setHeader('content-encoding', 'gzip');

        return stream.pipe(zlib.createGzip()).pipe(res);

      default:
        return stream.pipe(res);
    }
  }

  return res.end();
};

export default graphqlRoute;
