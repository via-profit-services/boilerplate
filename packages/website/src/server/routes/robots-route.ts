import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

interface Props {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
}

const robotsRoute = (props: Props) => {
  const { res, req } = props;
  const { method } = req;

  const filename = path.resolve(__dirname, './public/assets/robots.txt');
  if (!fs.existsSync(filename)) {
    res.statusCode = 404;
    res.end();
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  if (method === 'GET') {
    return fs.createReadStream(filename).pipe(res);
  }

  return res.end();
};

export default robotsRoute;
