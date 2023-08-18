import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import stream from 'node:stream';
import { Redis } from 'ioredis';
import jsonwebtoken from 'jsonwebtoken';

import type LoggerService from '~/services/LoggerService';
import AuthentificationService from '~/services/AuthentificationService';
import FilesService from '~/services/FilesService';
import { TOKEN_BEARER_KEY, TOKEN_BEARER } from '~/utils/constants';
import { ApplicationConfig } from 'common';
import { FileTokenPayload } from 'files';

interface Props extends ApplicationConfig {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly loggerService: LoggerService;
  readonly redisInstance: Redis;
}

const staticFilesRoute = async (props: Props) => {
  const { req, res, loggerService, jwt, redisInstance, files } = props;
  const { headers, url } = req;
  const { staticPrefix, storagePath, cachePath } = files;
  const logTag = 'files';
  const isStaticReg = new RegExp(`${staticPrefix}/(.+?)$`);
  const matches = isStaticReg.exec(url);
  if (!matches || matches.length < 1) {
    res.statusCode = 404;

    return res.end();
  }

  const fileToken = matches[1].split('.').reverse().slice(1).reverse().join('.');
  let fileTokenPayload: jsonwebtoken.JwtPayload | string;

  try {
    fileTokenPayload = jsonwebtoken.verify(fileToken, jwt.privateKey, {
      algorithms: [jwt.algorithm],
      issuer: jwt.issuer,
    });

    if (typeof fileTokenPayload === 'string') {
      throw new Error(fileTokenPayload);
    }
  } catch (err) {
    loggerService.log(
      'error',
      logTag,
      `Failed to get static file from URL «${url}». ${err.message}`,
    );
    res.statusCode = 404;

    return res.end();
  }

  const { id, mimeType, name, access, transform } = fileTokenPayload as FileTokenPayload;

  // if file has permissions
  // FIXME: Remove 1 > 2 condition
  if (1 > 2 && !access.read.includes('viewer')) {
    if (typeof headers.cookie === 'undefined') {
      res.statusCode = 403;
      loggerService.log(
        'info',
        logTag,
        `Failed to get static file from URL «${url}». Cookie for viewer not found`,
      );

      return res.end();
    }

    const cookies: Record<string, string> = {};
    // parse cookies
    String(headers.cookie)
      .split(';')
      .forEach(pair => {
        const index = pair.indexOf('=');
        if (index > -1) {
          const key = pair.substring(0, index).trim();

          let value = pair.substring(index + 1, pair.length).trim();
          if (value[0] === '"') {
            value = value.slice(1, -1);
          }
          cookies[key] = decodeURIComponent(value);
        }
      });

    if (!(TOKEN_BEARER_KEY in cookies)) {
      res.statusCode = 403;
      loggerService.log(
        'info',
        logTag,
        `Failed to get static file from URL «${url}». Token bearer key ${TOKEN_BEARER_KEY} not found`,
      );

      return res.end();
    }

    const [bearer, tokenFromCookies] = String(cookies[TOKEN_BEARER_KEY]).split(' ');

    if (bearer !== TOKEN_BEARER || tokenFromCookies === '') {
      res.statusCode = 403;
      loggerService.log(
        'info',
        logTag,
        `Failed to get static file from URL «${url}». Token bearer key ${TOKEN_BEARER} not found`,
      );

      return res.end();
    }

    try {
      // Extract access token
      const tokenPayload = await AuthentificationService.verifyToken({
        token: tokenFromCookies,
        jwt,
      });
      // Verify token
      if (!AuthentificationService.isAccessTokenPayload(tokenPayload)) {
        res.statusCode = 403;
        loggerService.log('info', logTag, 'Only Access token allowed');

        return res.end();
      }

      // Check to token revoked
      const has = await redisInstance.get(`revoked:${tokenPayload.id}`);
      if (has !== null) {
        loggerService.log('info', logTag, 'Token revoked');
        res.statusCode = 403;

        return res.end();
      }
      // Compare role in access token and role in file permission
      if (!access.read.some(role => tokenPayload.roles.includes(role))) {
        loggerService.log('info', logTag, 'The token does not contain the required roles');
        res.statusCode = 403;

        return res.end();
      }
    } catch (err) {
      loggerService.log('info', logTag, `${err.message}`);
      res.statusCode = 403;

      return res.end();
    }
  }

  /**
   * Is a transformed image
   */
  if (mimeType.match(/^image\//) && typeof transform === 'object') {
    const sourceID = id.split('.')?.[0] || '';
    const transformedExt = FilesService.getExtensionByMimeType(mimeType);
    const sourceFilename = path.resolve(storagePath, FilesService.getPathFromUuid(sourceID));
    const transformedFilename = path.resolve(cachePath, FilesService.getPathFromUuid(id));

    if (!fs.existsSync(sourceFilename)) {
      loggerService.log('info', logTag, `File ${sourceFilename} not found`);
      res.statusCode = 404;

      return res.end();
    }

    if (!fs.existsSync(transformedFilename)) {
      if (!fs.existsSync(path.dirname(transformedFilename))) {
        fs.mkdirSync(path.dirname(transformedFilename), { recursive: true });
      }

      try {
        const buffer = await FilesService.applyTransform(sourceFilename, transform);
        const readStream = stream.Readable.from(buffer);
        const writeStream = fs.createWriteStream(transformedFilename);
        readStream.pipe(writeStream);
        writeStream.on('error', err =>
          loggerService.log(
            'error',
            logTag,
            `Failed to create temporary transform file in path ${transformedFilename}. ${err.message}`,
          ),
        );

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', `max-age=${86400 * 30}`); // 30 days
        res.setHeader(
          'Content-Disposition',
          `inline; filename="${name || 'unnamed'}.${transformedExt}"`,
        );

        return readStream.pipe(res);
      } catch (e) {
        loggerService.log(
          'error',
          logTag,
          `Failed to create temporary transform file in path ${transformedFilename}. ${e.message}`,
        );
        res.statusCode = 500;

        return res.end();
      }
    }

    if (req.method === 'GET') {
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', `max-age=${86400 * 30}`); // 30 days
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${name || 'unnamed'}.${transformedExt}"`,
      );

      return fs.createReadStream(transformedFilename).pipe(res);
    }

    return res.end();
  }

  // Get original filename
  const filename = path.resolve(storagePath, FilesService.getPathFromUuid(id));

  if (!fs.existsSync(filename)) {
    loggerService.log('error', logTag, `File «${id}» does not found in location «${filename}»`);

    res.statusCode = 404;

    return res.end();
  }

  /**
   * If is an other documents or images
   */
  if (req.method === 'GET') {
    const ext = FilesService.getExtensionByMimeType(mimeType);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', `max-age=${86400 * 30}`); // 30 days
    res.setHeader('Content-Disposition', `inline; filename="${name || 'unnamed'}.${ext}"`);

    return fs.createReadStream(filename).pipe(res);
  }

  return res.end();
};

export default staticFilesRoute;
