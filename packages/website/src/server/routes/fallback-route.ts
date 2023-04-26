import http from 'node:http';

interface Props {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
}

const fallbackRoute = (props: Props) => {
  const { res, req } = props;
  const { method, url } = req;

  if (process.env.NODE_ENV === 'development') {
    console.debug(`Fallback 404 error for method: «${method}» with url: «${url}»`);
  }

  res.statusCode = 404;
  res.end();
};

export default fallbackRoute;
