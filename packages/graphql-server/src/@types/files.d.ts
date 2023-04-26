
declare module 'files' {
  import stream from 'node:stream';
  import { Knex } from 'knex';
  import { GraphQLSchema } from 'graphql';
  import { Middleware, CursorConnection } from '@via-profit-services/core';
  import { AccountRole } from 'users';
  import {Algorithm } from 'jsonwebtoken';

  export type FileType = 'MEDIA' | 'AVATAR' | 'DOCUMENT';
  export type FileMeta = Record<string, any>;

  export interface FilesTableModel {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly type: FileType;
    readonly mimeType: string;
    readonly name: string;
    readonly description: string | null;
    readonly owner: string | null;
    readonly meta: string | null;
    readonly pseudoPath: string | null;
    readonly access: string;
  }

  export interface FilesTableRecord {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly type: FileType;
    readonly mimeType: string;
    readonly name: string;
    readonly description: string | null;
    readonly owner: string | null;
    readonly meta: FileMeta | null;
    readonly pseudoPath: string | null;
    readonly access: FileAccess;
  }

  export interface FileAccess {
    readonly read: readonly AccountRole[] | null;
    readonly write: readonly AccountRole[] | null;
    readonly del: readonly AccountRole[] | null;
  }

  export interface FileTokenPayload {
    readonly access: FileAccess;
    readonly mimeType: string;
    readonly id: string;
    readonly name: string;
    readonly transform?: ImageTransform[] | null;
  }

  export interface CreateFileProps {
    readonly type: FileType;
    readonly access: FileAccess;
    readonly mimeType: string;
    readonly name?: string | null;
    readonly id?: string | null;
    readonly owner?: string | null;
    readonly meta?: FileMeta | null;
    readonly description?: string | null;
    readonly pseudoPath?: string | null;
  }

  export interface UpdateFileProps {
    readonly access?: FileAccess;
    readonly name?: string | null;
    readonly owner?: string | null;
    readonly meta?: FileMeta | null;
    readonly description?: string | null;
    readonly pseudoPath?: string | null;
  }

  export interface FilesConfig {
    /**
     * e.g. `https://www.example.com:9000`
     */
    readonly hostname: string;

    /**
     * Prefix path (e.g. `/static`)
     */
    readonly staticPrefix: string;

    /**
     * Static (e.g. `./files` or /home/user/files).
     */
    readonly storagePath: string;

    /**
     * Static path (e.g. `./.cache` or /home/user/.cache).
     */
    readonly cachePath: string;
  }

  export interface ImageTransform {
    readonly resize?: {
      readonly w: number;
      readonly h: number;
    } | null;
    readonly cover?: {
      readonly w: number;
      readonly h: number;
    } | null;
    readonly contain?: {
      readonly w: number;
      readonly h: number;
    } | null;
    readonly crop?: {
      readonly w: number;
      readonly h: number;
      readonly x: number;
      readonly y: number;
    } | null;
    readonly blur?: number | null;
    readonly greyscale?: boolean | null;
    readonly format?: {
      type: 'png' | 'jpeg';
      quality: number;
    } | null;
    readonly circle?: boolean | null;
  }

  export interface GetFilesConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly owner?: readonly string[] | null;
    readonly id?: readonly string[] | null;
    readonly type?: readonly FileType[] | null;
    readonly orderBy?:
      | {
          readonly field: 'name' | 'type' | 'mimeType' | 'createdAt' | 'updatedAt';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
    readonly search?:
      | {
          readonly field: 'name' | 'description';
          readonly query: string;
        }[]
      | null;
  }

  export interface FilesConnectionCursor {
    offset: number;
    owner?: readonly string[] | null;
    id?: readonly string[] | null;
    type?: readonly FileType[] | null;
    orderBy?: GetFilesConnectionProps['orderBy'] | null;
    search?: GetFilesConnectionProps['search'] | null;
  }

  export type FileStorageMiddlewareFactory = (config: FilesConfig) => Middleware;

  /**
   * FileStorage service constructor props
   */
  export interface FilesServiceProps {
    readonly knex: Knex;
    readonly hostname: string;
    readonly staticPrefix: string;
    readonly storagePath: string;
    readonly cachePath: string;
    readonly timezone: string;
    readonly jwt: {
      readonly algorithm?: Algorithm;
      readonly privateKey: Buffer;
      /**
       * Cert public key
       */
      readonly publicKey: Buffer;
      /**
       * A case-sensitive string or URI that is the unique identifier of the token-generating party
       */
      readonly issuer?: string;
    }
  }

  export type MimeTypes = Record<
    string,
    {
      extensions: string[];
    }
  >;

  export interface FilesServiceInterface {
    getFilesConnection(props: GetFilesConnectionProps): Promise<CursorConnection<FilesTableRecord>>;
    createFile(readableStream: stream.Readable, options: CreateFileProps): Promise<void>;
    updateFile(id: string, options: Partial<CreateFileProps>): Promise<void>;
    deleteFiles(ids: readonly string[]): Promise<void>;
    deleteFilesByOwners(ownerIDs: readonly string[]): Promise<void>;
    compileFileUrl(payload: FileTokenPayload): string;
  }

  export interface FilesService extends FilesServiceInterface {}

  class FilesService {
    constructor(props: FilesServiceProps);

    /**
     * Write readable stream to file
     */
    static writeFile(readableStream: stream.Readable, filename: string): Promise<void>;
    /**
     * Returns Full filename without extension (e.g. /path/to/file)
     */
    static getPathFromUuid(guid: string): string;

    /**
     * Returns full mime types list
     */
    static getMimeTypes(): MimeTypes;

    /**
     * Create new file with transformation
     */
    static applyTransform(
      sourceFilename: string,
      transformList: Partial<ImageTransform[]>,
    ): Promise<Buffer>;

    /**
     * Resolve extension by mimeType
     */
    static getExtensionByMimeType(mimeType: string): string;

    /**
     * Resolve mimeType by extension
     */
    static getMimeTypeByExtension(extension: string): string;

    /**
     * Clean filename\
     * **Note**: Extension will be removed
     */
    static cleanFilename(filename: string): string;

    /**
     * Remove only empty directories starts of passed directory path
     */
    static removeEmptyDirectories(directory: string): void;

    /**
     * Remove only transformed cache files
     */
    static clearTransformedCache(cachePath: string, fileID: string): Promise<void>;

    /**
     * Clear expired files
     */
    static clearExpiredCache(cachePath: string, ttlMs: number): Promise<void>;
  }

  export default GraphQLSchema;
}
