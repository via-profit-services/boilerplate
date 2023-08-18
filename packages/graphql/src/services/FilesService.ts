import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import stream from 'node:stream';
import jsonwebtoken from 'jsonwebtoken';
import { CursorConnection } from '@via-profit-services/core';

import type {
  ImageTransform,
  MimeTypes,
  FilesServiceProps,
  FilesServiceInterface,
  FilesConnectionCursor,
  GetFilesConnectionProps,
  FilesTableModel,
  FilesTableRecord,
  CreateFileProps,
  UpdateFileProps,
  FileTokenPayload,
} from 'files';
import mimeTypesCollection from '~/utils/mime-types.json';
import ImageMagickService from '~/services/ImageMagickService';

class FilesService implements FilesServiceInterface {
  #knex: FilesServiceProps['knex'];
  #hostname: FilesServiceProps['hostname'];
  #staticPrefix: FilesServiceProps['staticPrefix'];
  #storagePath: FilesServiceProps['storagePath'];
  #cachePath: FilesServiceProps['cachePath'];
  #timezone: FilesServiceProps['timezone'];
  #jwt: FilesServiceProps['jwt'];

  public constructor(props: FilesServiceProps) {
    this.#knex = props.knex;
    this.#hostname = props.hostname;
    this.#staticPrefix = props.staticPrefix;
    this.#storagePath = props.storagePath;
    this.#cachePath = props.cachePath;
    this.#timezone = props.timezone;
    this.#jwt = props.jwt;
  }

  public static writeFile(readableStream: stream.Readable, filename: string): Promise<void> {
    return new Promise<void>(resolve => {
      if (!fs.existsSync(path.dirname(filename))) {
        fs.mkdirSync(path.dirname(filename), {
          recursive: true,
        });
      }

      const writableStream = fs.createWriteStream(filename);
      writableStream.on('close', async () => {
        resolve();
      });

      readableStream.pipe(writableStream);
    });
  }

  public static removeEmptyDirectories(directory: string): void {
    if (!fs.existsSync(directory)) {
      return;
    }

    // lstat does not follow symlinks (in contrast to stat)
    const fileStats = fs.lstatSync(directory);
    if (!fileStats.isDirectory()) {
      return;
    }

    let fileNames = fs.readdirSync(directory);

    if (fileNames.length > 0) {
      fileNames.forEach(fileName => {
        FilesService.removeEmptyDirectories(path.resolve(directory, fileName));
      });

      // re-evaluate fileNames; after deleting subdirectory
      // we may have parent directory empty now
      fileNames = fs.readdirSync(directory);
    }

    if (fileNames.length === 0) {
      if (fs.existsSync(directory)) {
        fs.rmSync(directory, { recursive: true, force: true });
      }
    }
  }

  public static getMimeTypes(): MimeTypes {
    return mimeTypesCollection;
  }

  public static getPathFromUuid(guid: string): string {
    return [guid.substring(0, 2), guid.substring(4, 2), guid].join('/');
  }

  public static getExtensionByMimeType(mimeType: string) {
    const mimeTypes = FilesService.getMimeTypes();
    const data = mimeTypes[mimeType] || false;

    return data ? data.extensions[0] : 'txt';
  }

  public static async clearExpiredCache(cachePath: string, ttlMs: number): Promise<void> {
    if (!fs.existsSync(cachePath)) {
      return;
    }

    const visitDir = (directory: string) => {
      fs.readdirSync(directory).flatMap(item => {
        const filename = `${directory}/${item}`;

        if (fs.statSync(filename).isDirectory()) {
          return visitDir(filename);
        }

        const { mtimeMs } = fs.statSync(filename);
        if (new Date().getTime() - mtimeMs > ttlMs) {
          if (fs.existsSync(filename)) {
            fs.rmSync(filename, { force: true });
          }
        }

        return void 0;
      });
    };

    visitDir(cachePath);
    FilesService.removeEmptyDirectories(cachePath);
  }

  /**
   * Resolve mimeType by mime database or return default `text/plain` mimeType
   */
  public static getMimeTypeByExtension(extension: string) {
    const mimeTypes = FilesService.getMimeTypes();
    const record = Object.entries(mimeTypes).find(([_mimeType, data]) =>
      data.extensions.includes(extension),
    );

    return record ? record[0] : 'text/plain';
  }

  public static async clearTransformedCache(cachePath: string, fileID: string): Promise<void> {
    const directory = path.join(cachePath, path.dirname(FilesService.getPathFromUuid(fileID)));

    if (!fs.existsSync(cachePath) || !fs.existsSync(directory)) {
      return;
    }

    fs.readdirSync(directory).flatMap(item => {
      if (item.split('.')[0] === fileID) {
        const filename = path.join(directory, item);
        if (fs.existsSync(filename)) {
          fs.rmSync(filename, { force: true });
        }
      }
    });

    FilesService.removeEmptyDirectories(cachePath);
  }

  public static async applyTransform(
    sourceFilename: string,
    transformList: Partial<ImageTransform[]>,
  ): Promise<Buffer> {
    if (!fs.existsSync(sourceFilename)) {
      throw new Error(`Transform error. File «${sourceFilename}» does not found`);
    }

    const magick = new ImageMagickService(sourceFilename, {
      bin: process.env.IMAGE_MAGICK_BIN_PATH,
    });

    transformList.forEach(transform => {
      if ('cover' in transform) {
        const { w, h } = transform.cover;
        magick.cover(w, h);
      }

      if ('crop' in transform) {
        const { x, y, w, h } = transform.crop;
        magick.crop(x, y, w, h);
      }

      if ('contain' in transform) {
        const { w, h } = transform.contain;
        magick.contain(w, h);
      }

      if ('resize' in transform) {
        const { w, h } = transform.resize;
        magick.resize(w, h);
      }

      if ('blur' in transform) {
        const { blur } = transform;
        magick.blur(0, blur);
      }

      if ('greyscale' in transform && transform.greyscale === true) {
        magick.grayscale();
      }

      if ('format' in transform) {
        const { type, quality } = transform.format;
        magick.format(type, { quality });
      }
    });

    const buffer = await magick.toBuffer();

    return buffer;
  }

  public static cleanFilename(filename: string): string {
    return String(filename)
      .replace(/[`"|\\/:*<>]/g, '') // illegial
      .replace(/^(nul|ext[2-4]|con|prn|aux|com[0-9]|lpt[0-9])(\..*)?$/i, '') // devices
      .replace(/\.$/, '') // replace trailing dot
      .replace(/\s{1,}/, ' ') // replace multiple spaces
      .replace(/\.[a-z0-9-]+$/, ''); // replace ext
  }

  public async getFilesConnection(
    props: GetFilesConnectionProps,
  ): Promise<CursorConnection<FilesTableRecord>> {
    const { first, after, last, before, id, type, owner, orderBy, search } = props;

    let limit = 0;
    let offset = 0;
    let cursor: FilesConnectionCursor = {
      offset: 0,
      id,
      owner,
      orderBy,
      search,
      type,
    };

    if (first && !after) {
      limit = first;
      offset = 0;
      cursor.offset = 0;
    }

    if (first && after) {
      cursor = JSON.parse(Buffer.from(after, 'base64').toString('utf8'));
      limit = first;
      offset = Math.max(cursor.offset, 0) + 1;
      cursor.offset = Math.max(cursor.offset, 0) + 1;
    }

    if (last && before) {
      cursor = JSON.parse(Buffer.from(before, 'base64').toString('utf8'));
      limit = last;
      offset = Math.max(cursor.offset - last, 0);
      cursor.offset = Math.max(cursor.offset - last, 0);
    }

    const knexOrderBy = this.#knex.queryBuilder();
    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        knexOrderBy.orderBy(field, direction);
      });
    }

    const request = this.#knex.select(['files.*']).limit(limit).offset(offset).from<
      FilesTableModel,
      ReadonlyArray<
        FilesTableRecord & {
          readonly prev: string | null;
          readonly next: string | null;
        }
      >
    >('files');

    if (cursor.orderBy) {
      cursor.orderBy.forEach(({ field, direction }) => {
        request.orderBy(`files.${field}`, direction);
      });
      const orderRaw = knexOrderBy.toQuery().replace('select *', '').trim();
      request.select([
        this.#knex.raw(`lag(??) over(${orderRaw}) as "prev"`, ['files.id']),
        this.#knex.raw(`lead(??) over(${orderRaw}) as "next"`, ['files.id']),
      ]);
    } else {
      request.select([
        this.#knex.raw(`lag(??) over() as "prev"`, ['files.id']),
        this.#knex.raw(`lead(??) over() as "next"`, ['files.id']),
      ]);
    }

    if (Array.isArray(id)) {
      request.whereIn('files.id', id);
    }

    if (Array.isArray(owner)) {
      request.whereIn('files.owner', owner);
    }

    if (Array.isArray(type)) {
      request.whereIn('files.type', type);
    }

    if (search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          builder.orWhereRaw('??::text ilike ?', [field, `%${query}%`]);
        });
      });
    }

    const response = await request;
    const edges = response.map((node, index) => ({
      node,
      cursor: Buffer.from(
        JSON.stringify({
          ...cursor,
          offset: cursor.offset + index,
        }),
      ).toString('base64'),
    }));

    const pageInfo = {
      hasPreviousPage: edges.length ? response[0].prev !== null : false,
      hasNextPage: edges.length ? response[response.length - 1].next !== null : false,
      startCursor: edges.length ? edges[0].cursor : undefined,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      pageInfo,
      edges,
    };
  }

  public async createFile(
    readableStream: stream.Readable,
    options: CreateFileProps,
  ): Promise<void> {
    const { id, mimeType, name, owner, meta, description, access, type, pseudoPath } = options;
    const fileID = id || crypto.randomUUID();
    const filename = path.resolve(this.#storagePath, FilesService.getPathFromUuid(fileID));
    await FilesService.writeFile(readableStream, filename);
    const createdAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: this.#timezone,
        dateStyle: 'short',
        timeStyle: 'medium',
      }),
    ).toISOString();

    const data: FilesTableModel = {
      id: fileID,
      createdAt,
      updatedAt: createdAt,
      mimeType,
      type,
      name: FilesService.cleanFilename(name || ''),
      pseudoPath:
        typeof pseudoPath === 'string'
          ? pseudoPath.split('/').map(FilesService.cleanFilename).join('/')
          : null,
      access: JSON.stringify({
        read: Array.isArray(access.read) ? access.read : ['*'],
        write: Array.isArray(access.write) ? access.write : ['administrator'],
        del: Array.isArray(access.del) ? access.del : ['administrator'],
      }),
      meta: typeof meta === 'object' ? JSON.stringify(meta) : null,
      owner: typeof owner === 'string' ? owner : null,
      description:
        typeof description === 'string' && description.trim() !== '' ? description : null,
    };

    await this.#knex('files').insert(data);
  }

  public async updateFile(id: string, options: Partial<UpdateFileProps>): Promise<void> {
    const { name, owner, meta, description, access, pseudoPath } = options;

    const data: Partial<FilesTableModel> = {
      updatedAt: new Date(
        new Date().toLocaleString('en-US', {
          timeZone: this.#timezone,
          dateStyle: 'short',
          timeStyle: 'medium',
        }),
      ).toISOString(),
      name: typeof name !== 'undefined' ? FilesService.cleanFilename(name || '') : undefined,
      pseudoPath:
        typeof pseudoPath !== 'undefined'
          ? typeof pseudoPath === 'string'
            ? pseudoPath.split('/').map(FilesService.cleanFilename).join('/')
            : null
          : undefined,
      access:
        typeof access !== 'undefined'
          ? JSON.stringify({
              read: Array.isArray(access.read) ? access.read : ['*'],
              write: Array.isArray(access.write) ? access.write : ['administrator'],
              del: Array.isArray(access.del) ? access.del : ['administrator'],
            })
          : undefined,
      meta:
        typeof meta !== 'undefined'
          ? typeof meta === 'object'
            ? JSON.stringify(meta)
            : null
          : undefined,
      owner: typeof owner !== 'undefined' ? (typeof owner === 'string' ? owner : null) : undefined,
      description:
        typeof description !== 'undefined'
          ? typeof description === 'string' && description.trim() !== ''
            ? description
            : null
          : undefined,
    };

    await this.#knex('files').update(data).where({ id }).limit(1);
  }

  public async deleteFiles(ids: readonly string[]): Promise<void> {
    ids.forEach(id => {
      const filename = path.resolve(this.#storagePath, FilesService.getPathFromUuid(id));

      // delete transformed cache files
      FilesService.clearTransformedCache(this.#cachePath, id);

      // delete file
      if (fs.existsSync(filename)) {
        fs.rmSync(filename, { force: true });
      }
    });

    await this.#knex('files').del().whereIn('id', ids);

    FilesService.removeEmptyDirectories(this.#storagePath);
    FilesService.removeEmptyDirectories(this.#cachePath);
  }

  public async deleteFilesByOwners(ownerIDs: readonly string[]): Promise<void> {
    const fileIDs = await this.#knex<FilesTableRecord[]>('files')
      .select('id')
      .whereIn('owner', ownerIDs);
    if (fileIDs.length) {
      await this.deleteFiles(fileIDs);
    }
  }

  public compileFileUrl(fileTokenPayload: FileTokenPayload): string {
    const { issuer, privateKey, algorithm } = this.#jwt;
    const { mimeType } = fileTokenPayload;
    const ext = FilesService.getExtensionByMimeType(mimeType);

    const fileToken = jsonwebtoken.sign(fileTokenPayload, privateKey, {
      noTimestamp: true,
      algorithm,
      issuer,
    });

    return `${this.#hostname}${this.#staticPrefix}/${fileToken}.${ext}`;
  }
}

export default FilesService;
