import http from 'node:http';

import type LoggerService from '~/services/LoggerService';
import type { ApplicationConfig } from 'common';

interface Props extends ApplicationConfig {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly loggerService: LoggerService;
}

const fallbackRoute = (props: Props) => {
  const { res, req, loggerService, debug } = props;
  const { method, url } = req;

  if (debug) {
    loggerService.log(
      'info',
      'router',
      `Fallback 404 error for method: «${method}» with url: «${url}»`,
    );
  }

  res.statusCode = 404;
  res.end();
};

export default fallbackRoute;
