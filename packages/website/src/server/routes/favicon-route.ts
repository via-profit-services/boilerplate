import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import '~/assets/favicon.ico';

interface Props {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
}

const favIconRoute = (props: Props) => {
  const { res, req } = props;
  const { method } = req;

  const filename = path.resolve(__dirname, './public/assets/favicon.ico');
  if (!fs.existsSync(filename)) {
    res.statusCode = 404;

    return res.end();
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/x-icon');

  if (method === 'GET') {
    return fs.createReadStream(filename).pipe(res);
  }

  return res.end();
};

export default favIconRoute;
