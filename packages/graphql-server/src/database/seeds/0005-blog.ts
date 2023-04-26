/* eslint-disable import/prefer-default-export */
import { Knex } from 'knex';
import https from 'node:https';
import stream from 'node:stream';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs';
import { URL } from 'node:url';
import dotenv from 'dotenv';

import type {
  PagesTableModel,
  ContentBlocksTableModel,
  TemplatesTableModel,
  TemplateName,
  ContentBlockPlainTextTableModel,
  ContentBlockImageTableModel,
  ContentBlockFormattedTextTableModel,
} from 'webpages';
import { BlogPostTableModel } from 'blog';
import FilesService from '~/services/FilesService';
import { FilesTableModel } from 'files';

export async function seed(knex: Knex): Promise<any> {
  enum PagesPath {
    BLOG = '/blog',
  }

  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  const getRandomFromArray = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];
  const projectRoot = path.resolve(__dirname, '../..');
  const parsedEnv = dotenv.parse(fs.readFileSync(path.resolve(projectRoot, '.env')));

  const filesPath = path.resolve(projectRoot, parsedEnv.FILE_STORAGE_STATIC_PATH);

  const imagesUrls: string[] = [
    'https://via-profit.ru/files/promoBlocks/1/promo-4.png',
    'https://via-profit.ru/files/promoBlocks/1/fondshipulina.png',
    'https://via-profit.ru/files/promoBlocks/1/glavdezcentr.png',
    'https://via-profit.ru/files/promoBlocks/1/cheap-kids.png',
    'https://via-profit.ru/files/promoBlocks/1/promo-5.png',
    'https://via-profit.ru/files/promoBlocks/1/gofly.png',
    'https://via-profit.ru/files/promoBlocks/1/promo-7.png',
    'https://via-profit.ru/files/promoBlocks/1/optimus196.png',
    'https://via-profit.ru/files/promoBlocks/1/sonya-ekb.png',
    'https://via-profit.ru/files/promoBlocks/1/stoffa.png',
    'https://via-profit.ru/files/promoBlocks/1/trubon.png',
    'https://via-profit.ru/files/promoBlocks/1/cheap-cosmetics.png',
    'https://via-profit.ru/files/promoBlocks/1/cheap-food.png',
    'https://via-profit.ru/files/promoBlocks/1/cheap-jewellery.png',
    'https://via-profit.ru/files/promoBlocks/1/crazy-vikings.png',
  ];

  const downloadFile = (props: {
    readonly sourceUrl: string;
    readonly owner: string;
    readonly name: string;
  }) =>
    new Promise<string>((resolve, reject) => {
      const { sourceUrl, owner, name } = props;
      console.debug(`Download file ${sourceUrl}`);

      const url = new URL(sourceUrl);
      const request = https
        .request(
          {
            host: url.hostname,
            port: Number(url.port),
            path: url.pathname,
            method: 'GET',
          },
          socket => {
            const payload: Buffer[] = [];
            socket.on('data', buffer => {
              payload.push(buffer);
            });
            socket.on('end', async () => {
              const fileID = uuidv4();
              const fileStream = stream.Readable.from(Buffer.concat(payload));
              const filename = path.resolve(filesPath, FilesService.getPathFromUuid(fileID));
              await FilesService.writeFile(fileStream, filename);

              const file: FilesTableModel = {
                id: fileID,
                mimeType: `image/${sourceUrl.split('.').reverse()[0]}`.replace(/jpg/, 'jpeg'),
                createdAt: new Date().toDateString(),
                updatedAt: new Date().toDateString(),
                owner,
                type: 'MEDIA',
                description: null,
                name,
                meta: null,
                access: JSON.stringify({
                  read: ['*'],
                  write: ['administrator'],
                  del: ['administrator'],
                }),
                pseudoPath: null,
              };

              await knex('files').insert(file);

              resolve(fileID);
            });
            socket.on('error', err => {
              console.debug(`Failed to download file ${sourceUrl}`);
              reject(err);
            });
          },
        )
        .on('error', () => {
          console.debug(`Failed to download file ${sourceUrl}`);

          reject();
        });

      request.end();
    });

  type CbInfoPlain = {
    type: 'PLAIN_TEXT';
    id: string;
    template: string;
    page: string | null;
    name: string;
    text: string;
  };
  type CbInfoFormatted = {
    type: 'FORMATTED_TEXT';
    id: string;
    template: string;
    page: string | null;
    name: string;
    lexical: string;
  };
  type CbInfoImage = {
    type: 'IMAGE';
    id: string;
    template: string;
    page: string | null;
    name: string;
    file: string;
    alt: string | null;
    title: string | null;
  };

  const templates: TemplatesTableModel[] = [
    {
      id: uuidv4(),
      name: 'TemplateBlogPage',
      displayName: 'Blog post page template',
    },
    {
      id: uuidv4(),
      name: 'TemplateBlogPostPage',
      displayName: 'Blog post page template',
    },
  ];

  const getTemplateIDByTemplateName = (tplName: TemplateName): string => {
    const founded = templates.find(t => t.name === tplName);

    return typeof founded !== 'undefined' ? founded.id : templates[0].id;
  };

  const pages: PagesTableModel[] = [
    {
      id: uuidv4(),
      pid: null,
      name: 'Blog',
      path: PagesPath.BLOG,
      template: getTemplateIDByTemplateName('TemplateBlogPage'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusCode: 200,
      order: 0,
    },
  ];

  const cbList: (CbInfoImage | CbInfoPlain | CbInfoFormatted)[] = [
    {
      id: uuidv4(),
      page: pages.find(p => p.path === PagesPath.BLOG).id,
      name: 'blog:heading',
      type: 'PLAIN_TEXT',
      template: getTemplateIDByTemplateName('TemplateBlogPage'),
      text: 'Blog page',
    },
  ];

  const contentBlocks: ContentBlocksTableModel[] = [];
  const contentBlockPlainText: ContentBlockPlainTextTableModel[] = [];
  const contentBlockImage: ContentBlockImageTableModel[] = [];
  const contentBlockFormattedText: ContentBlockFormattedTextTableModel[] = [];
  const createdAt = new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      timeZoneName: 'short',
    }),
  ).toISOString();

  cbList.forEach(cb => {
    if (cb.type === 'PLAIN_TEXT') {
      const { text, id, ...cbCommon } = cb;
      contentBlockPlainText.push({ id, text });
      contentBlocks.push({ id, ...cbCommon, createdAt, updatedAt: createdAt });
    }
    if (cb.type === 'FORMATTED_TEXT') {
      const { lexical, id, ...cbCommon } = cb;
      contentBlockFormattedText.push({ id, lexical });
      contentBlocks.push({ id, ...cbCommon, createdAt, updatedAt: createdAt });
    }
    if (cb.type === 'IMAGE') {
      const { alt, title, file, id, ...cbCommon } = cb;
      contentBlockImage.push({ id, alt, title, file });
      contentBlocks.push({ id, ...cbCommon, createdAt, updatedAt: createdAt });
    }
  });

  await knex('templates')
    .del()
    .whereIn(
      'name',
      templates.map(t => t.name),
    );

  await knex('pagesList').del().whereIn('path', [PagesPath.BLOG]);
  await knex('contentBlocks')
    .del()
    .whereIn(
      'name',
      contentBlocks.map(cb => cb.name),
    );

  await knex('blogPosts').del();

  // const images = await knex('files').select('id').where({ name: 'blog:image' });
  await knex('files').del().where({ name: 'blog:image' });
  // await FilesService.de

  await knex('templates').insert(templates);
  await knex('pagesList').insert(pages);

  if (contentBlocks.length) {
    await knex('contentBlocks').insert(contentBlocks);
  }
  if (contentBlockPlainText.length) {
    await knex('contentBlockPlainText').insert(contentBlockPlainText);
  }
  if (contentBlockImage.length) {
    await knex('contentBlockImage').insert(contentBlockImage);
  }
  if (contentBlockFormattedText.length) {
    await knex('contentBlockFormattedText').insert(contentBlockFormattedText);
  }

  // Generate blog posts
  const postLength = 10;
  // const postLength = 300;
  let loopIndex = 0;

  await [...new Array(1000).keys()].reduce(async prev => {
    await prev;

    const postPID = pages.find(p => p.path === PagesPath.BLOG).id;
    const postPages: PagesTableModel[] = [];
    const blogPosts: BlogPostTableModel[] = [];
    const postCbList: (CbInfoImage | CbInfoPlain | CbInfoFormatted)[] = [];

    await Promise.all(
      [...new Array(Math.floor(postLength / 10)).keys()].map(() => {
        loopIndex += 1;
        const pageID = uuidv4();
        const templateID = getTemplateIDByTemplateName('TemplateBlogPostPage');

        postPages.push({
          id: pageID,
          path: `${PagesPath.BLOG}/post-${loopIndex}`,
          name: `Post ${loopIndex}`,
          order: 0,
          statusCode: 200,
          pid: postPID,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          template: templateID,
        });

        blogPosts.push({
          id: uuidv4(),
          page: pageID,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          name: `Post ${loopIndex}`,
          author: null,
        });

        postCbList.push({
          id: uuidv4(),
          page: pageID,
          template: templateID,
          name: 'blog:post:heading',
          type: 'PLAIN_TEXT',
          text: `Heading of post ${loopIndex}`,
        });

        const imageBlockID = uuidv4();
        const fileSrc = getRandomFromArray(imagesUrls);

        if (Math.floor(Math.random() * 10) % 9.6 === 0) {
          return downloadFile({
            sourceUrl: fileSrc,
            owner: imageBlockID,
            name: 'blog:image',
          })
            .then(fileID => {
              postCbList.push({
                id: uuidv4(),
                page: pageID,
                template: templateID,
                name: 'blog:post:image',
                type: 'IMAGE',
                file: fileID,
                alt: `alternative text for ${loopIndex}`,
                title: `title for ${loopIndex}`,
              });

              return true;
            })
            .catch(() => {
              // do nothng
              console.debug('Failed image download');
            });
        }

        return true;
      }),
    );
    // [...new Array(Math.floor(postLength / 10)).keys()].forEach(async () => {

    // });

    const contentBlocks: ContentBlocksTableModel[] = [];
    const contentBlockPlainText: ContentBlockPlainTextTableModel[] = [];
    const contentBlockImage: ContentBlockImageTableModel[] = [];
    const contentBlockFormattedText: ContentBlockFormattedTextTableModel[] = [];

    postCbList.forEach(cb => {
      if (cb.type === 'PLAIN_TEXT') {
        const { text, id, ...cbCommon } = cb;
        contentBlockPlainText.push({ id, text });
        contentBlocks.push({ id, ...cbCommon, createdAt, updatedAt: createdAt });
      }
      if (cb.type === 'FORMATTED_TEXT') {
        const { lexical, id, ...cbCommon } = cb;
        contentBlockFormattedText.push({ id, lexical });
        contentBlocks.push({ id, ...cbCommon, createdAt, updatedAt: createdAt });
      }
      if (cb.type === 'IMAGE') {
        const { alt, title, file, id, ...cbCommon } = cb;
        contentBlockImage.push({ id, alt, title, file });
        contentBlocks.push({ id, ...cbCommon, createdAt, updatedAt: createdAt });
      }
    });

    await knex('pagesList').insert(postPages);
    if (contentBlocks.length) {
      await knex('contentBlocks').insert(contentBlocks);
    }
    if (contentBlockPlainText.length) {
      await knex('contentBlockPlainText').insert(contentBlockPlainText);
    }
    if (contentBlockImage.length) {
      await knex('contentBlockImage').insert(contentBlockImage);
    }
    if (contentBlockFormattedText.length) {
      await knex('contentBlockFormattedText').insert(contentBlockFormattedText);
    }
    await knex('blogPosts').insert(blogPosts);
  }, Promise.resolve());
}
