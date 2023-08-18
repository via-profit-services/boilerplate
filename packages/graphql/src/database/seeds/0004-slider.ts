/* eslint-disable import/prefer-default-export */
import crypto from 'node:crypto';
import stream from 'node:stream';
import https from 'node:https';
import path from 'node:path';
import fs from 'node:fs';
import { URL } from 'node:url';
import type { Knex } from 'knex';
import dotenv from 'dotenv';

import FilesService from '~/services/FilesService';
import type { FilesTableModel } from 'files';
import type {
  ContentBlockFormattedTextTableModel,
  ContentBlockImageTableModel,
  ContentBlockPlainTextTableModel,
  ContentBlocksTableModel,
  PagesTableRecord,
} from 'webpages';
import type { SliderSlidesTableModel, SliderSlidesTableRecord, SliderTableModel } from 'slider';

export async function seed(knex: Knex): Promise<any> {
  const projectRoot = path.resolve(__dirname, '../..');
  const parsedEnv = dotenv.parse(fs.readFileSync(path.resolve(projectRoot, '.env')));
  const contentBlockSlideName = 'slider:slide';
  const homePage = await knex
    .select<PagesTableRecord>('*')
    .from('pagesList')
    .where({ path: '/' })
    .first();

  const sliders: SliderTableModel[] = [
    {
      id: crypto.randomUUID(),
      page: homePage.id,
      template: homePage.template,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      displayName: 'For home page',
      slidesToShow: 1,
      pauseOnHover: false,
      autoplaySpeed: 0,
    },
  ];

  const slides: SliderSlidesTableModel[] = [];

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

  const cbList: (CbInfoImage | CbInfoPlain | CbInfoFormatted)[] = [];

  // download files
  const filesPath = path.resolve(projectRoot, parsedEnv.FILE_STORAGE_STATIC_PATH);
  const files: FilesTableModel[] = [];
  await Promise.all(
    [
      'https://via-profit.ru/files/ImagesSlider/5b21fa8ba8ef9.png',
      'https://via-profit.ru/files/ImagesSlider/5c35bcf4919dc.png',
    ].map(
      sourceUrl =>
        new Promise<void>((resolve, reject) => {
          const url = new URL(sourceUrl);
          const request = https.request(
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
                const fileID = crypto.randomUUID();
                const fileStream = stream.Readable.from(Buffer.concat(payload));
                const filename = path.resolve(filesPath, FilesService.getPathFromUuid(fileID));
                await FilesService.writeFile(fileStream, filename);
                const contentBlockID = crypto.randomUUID();

                cbList.push({
                  id: contentBlockID,
                  type: 'IMAGE',
                  page: homePage.id,
                  template: homePage.template,
                  name: contentBlockSlideName,
                  alt: '',
                  title: '',
                  file: fileID,
                });

                const slide: SliderSlidesTableModel = {
                  id: crypto.randomUUID(),
                  slider: sliders[0].id,
                  createdAt: new Date().toDateString(),
                  updatedAt: new Date().toDateString(),
                  order: slides.length + 1,
                  enabled: true,
                  image: contentBlockID,
                };
                const file: FilesTableModel = {
                  id: fileID,
                  mimeType: `image/${sourceUrl.split('.').reverse()[0]}`.replace(/jpg/, 'jpeg'),
                  createdAt: new Date().toDateString(),
                  updatedAt: new Date().toDateString(),
                  owner: slide.id,
                  type: 'MEDIA',
                  description: null,
                  name: 'Slide',
                  meta: null,
                  access: JSON.stringify({
                    read: ['*'],
                    write: ['administrator'],
                    del: ['administrator'],
                  }),
                  pseudoPath: null,
                };
                slides.push(slide);
                files.push(file);

                resolve();
              });
              socket.on('error', err => {
                reject(err);
              });
            },
          );

          request.end();
        }),
    ),
  );

  const existSlides = await knex.select<SliderSlidesTableRecord[]>(['id']).from('sliderSlides');
  const toDeleteFiles = existSlides.map(s => s.id);
  if (toDeleteFiles.length) {
    await knex('files').del().whereIn('id', toDeleteFiles);
  }

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

  await knex('contentBlocks').del().where('name', contentBlockSlideName);
  await knex('slider').del();
  await knex('sliderSlides').del();

  await knex('files').insert(files);
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
  await knex('slider').insert(sliders);
  await knex('sliderSlides').insert(slides);
}
