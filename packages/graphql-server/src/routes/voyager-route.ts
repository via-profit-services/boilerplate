import http from 'node:http';

import { ApplicationConfig } from 'common';
import type LoggerService from '~/services/LoggerService';
import renderVoyager from '~/utils/voyager';

interface Props extends ApplicationConfig {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly loggerService: LoggerService;
}

const voyagerRoute = (props: Props) => {
  const { res, req, endpoint } = props;
  const { method } = req;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  if (method === 'GET') {
    res.write(renderVoyager({ endpoint }));
  }
  res.end();
};

export default voyagerRoute;
