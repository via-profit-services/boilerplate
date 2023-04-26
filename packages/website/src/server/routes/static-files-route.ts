import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import type { Redis } from 'ioredis';

interface Props {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly redis: Redis;
}

const staticFilesRoute = (props: Props) => {
  const { req, res } = props;
  const { method, url } = req;

  const mimeTypes: Record<string, string[]> = {
    'application/json': ['.json'],
    'application/javascript': ['.js'],
    'text/css': ['.css'],
    'text/html': ['.html'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/webp': ['.webp'],
    'video/mp4': ['.mp4'],
    'audio/mpeg': ['.mp3'],
    'text/plain': ['.txt'],
    'font/ttf': ['.ttf'],
    'font/otf': ['.otf'],
    'font/woff': ['.woff'],
    'font/woff2': ['.woff2'],
    'application/vnd.ms-fontobject': ['.eot'],
    'image/vnd.microsoft.iconplain': ['.ico'],
  };
  const publicPath = path.resolve(__dirname, './public/');
  const filename = path.join(__dirname, url || '');
  const relative = path.relative(publicPath, filename);
  const fileExists = fs.existsSync(filename);
  const ext = path.extname(filename);
  const acceptEncoding = String(req.headers?.['accept-encoding'] || '')
    .split(',')
    .map(value => value.trim());

  if (!fileExists || !relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    console.debug('File not found', { filename, url, method, ext });
    res.statusCode = 404;

    return res.end();
  }

  const mimeType = Object.entries(mimeTypes).find(([_mimeType, data]) => data.includes(ext))?.[0];
  res.setHeader('content-type', mimeType || 'plain/text');
  res.setHeader('cache-control', `max-age=${86400 * 30}`); // 30 days
  res.statusCode = 200;

  if (acceptEncoding.includes('gzip') && fs.existsSync(filename + '.gz')) {
    res.setHeader('content-encoding', 'gzip');
    if (method === 'GET') {
      return fs.createReadStream(filename + '.gz').pipe(res);
    }

    return res.end();
  }

  if (method === 'GET') {
    return fs.createReadStream(filename).pipe(res);
  }

  return res.end();
};

export default staticFilesRoute;
