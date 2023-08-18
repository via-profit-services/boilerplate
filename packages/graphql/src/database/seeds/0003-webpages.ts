/* eslint-disable import/prefer-default-export */
import crypto from 'node:crypto';
import type { Knex } from 'knex';

import type { MenuItemTableModel, MenuTableModel } from 'webmenu';
import type {
  PagesTableModel,
  PagesMetaTableModel,
  ContentBlocksTableModel,
  ContentBlockFormattedTextTableModel,
  ContentBlockPlainTextTableModel,
  ContentBlockImageTableModel,
  TemplatesTableModel,
  TemplateName,
} from 'webpages';

export async function seed(knex: Knex): Promise<any> {
  enum PagesPath {
    HOME = '/',
    HOME2 = '/home-2',
    FALLBACK = '/404',
    // BLOG = '/blog',
  }

  const templates: TemplatesTableModel[] = [
    {
      id: crypto.randomUUID(),
      name: 'TemplateHomePage',
      displayName: 'Home page template',
    },
    {
      id: crypto.randomUUID(),
      name: 'TemplateSecondPage',
      displayName: 'Second page template',
    },
    {
      id: crypto.randomUUID(),
      name: 'TemplateFallbackPage',
      displayName: '404 page template',
    },
  ];

  const getTemplateIDByTemplateName = (tplName: TemplateName): string => {
    const founded = templates.find(t => t.name === tplName);

    return typeof founded !== 'undefined' ? founded.id : templates[0].id;
  };

  const pages: PagesTableModel[] = [
    {
      id: crypto.randomUUID(),
      pid: null,
      name: 'Home page',
      path: PagesPath.HOME,
      template: getTemplateIDByTemplateName('TemplateHomePage'),
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      statusCode: 200,
      order: 0,
    },
    {
      id: crypto.randomUUID(),
      pid: null,
      name: 'Home page 2',
      path: PagesPath.HOME2,
      template: getTemplateIDByTemplateName('TemplateHomePage'),
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      statusCode: 200,
      order: 0,
    },
    {
      id: crypto.randomUUID(),
      pid: null,
      name: 'Error 404',
      path: PagesPath.FALLBACK,
      template: getTemplateIDByTemplateName('TemplateFallbackPage'),
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      statusCode: 404,
      order: 0,
    },
  ];

  const pagesMeta: PagesMetaTableModel[] = [
    {
      page: pages.find(page => page.path === PagesPath.HOME).id,
      title: 'Home page title with unicode ✓',
      description: 'Home page ©',
      locale: 'en-US',
      keywords: null,
    },
  ];

  const menuList: MenuTableModel[] = [
    {
      id: crypto.randomUUID(),
      name: 'Main menu',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    },
  ];

  const menuItems: MenuItemTableModel[] = [
    {
      id: crypto.randomUUID(),
      pid: null,
      menu: menuList.find(menu => menu.name === 'Main menu').id,
      page: pages.find(page => page.path === PagesPath.HOME).id,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      name: null,
      url: null,
      visible: true,
      order: 1,
      target: 'SELF',
    },
  ];

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

  const cbList: (CbInfoImage | CbInfoPlain | CbInfoFormatted)[] = [
    {
      id: crypto.randomUUID(),
      type: 'PLAIN_TEXT',
      page: pages.find(p => p.path === PagesPath.HOME).id,
      name: 'page:heading',
      text: 'Just page heading 1',
      template: getTemplateIDByTemplateName('TemplateHomePage'),
    },
    {
      id: crypto.randomUUID(),
      type: 'PLAIN_TEXT',
      page: pages.find(p => p.path === PagesPath.HOME).id,
      name: 'payments:heading',
      template: getTemplateIDByTemplateName('TemplateHomePage'),
      text: 'Payments title',
    },
    {
      id: crypto.randomUUID(),
      page: pages.find(p => p.path === PagesPath.FALLBACK).id,
      name: 'page:heading',
      type: 'PLAIN_TEXT',
      template: getTemplateIDByTemplateName('TemplateFallbackPage'),
      text: '404 Not Found',
    },
    {
      id: crypto.randomUUID(),
      page: pages.find(p => p.path === PagesPath.HOME).id,
      name: 'payments:subheading',
      type: 'PLAIN_TEXT',
      template: getTemplateIDByTemplateName('TemplateHomePage'),
      text: 'Payments subtitle',
    },
    {
      id: crypto.randomUUID(),
      page: pages.find(p => p.path === PagesPath.HOME).id,
      name: 'payments:content',
      type: 'FORMATTED_TEXT',
      template: getTemplateIDByTemplateName('TemplateHomePage'),
      lexical:
        '{"source": "Playground", "version": "0.7.6", "lastSaved": 1675011294810, "editorState": {"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Cillum ad pariatur ", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}, {"mode": "normal", "text": "laborum", "type": "text", "style": "", "detail": 0, "format": 2, "version": 1}, {"mode": "normal", "text": " minim sint ad culpa tempor laboris irure cupidatat exercitation. Ad est ullamco nisi aliqua aliqua. Ipsum nisi id non aliqua aliquip adipisicing do enim sunt in. Aute velit dolor excepteur sit ullamco veniam quis amet ipsum. Consequat elit mollit mollit commodo ea magna commodo laborum non cupidatat est ", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}, {"mode": "normal", "text": "nisi nostrud", "type": "text", "style": "", "detail": 0, "format": 1, "version": 1}, {"mode": "normal", "text": ".", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr"}], "direction": "ltr"}}}',
    },

    {
      id: crypto.randomUUID(),
      page: pages.find(p => p.path === PagesPath.FALLBACK).id,
      name: 'page:content',
      type: 'FORMATTED_TEXT',
      template: getTemplateIDByTemplateName('TemplateFallbackPage'),
      lexical:
        '{"editorState":{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Lorem ipsum for ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"404","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" not found page","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Whats is that?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nothing to do, just go away, bitch!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}},"lastSaved":1675347426473,"source":"Playground","version":"0.7.6"}',
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

  await knex('templates').del();
  await knex('pagesList').del();
  await knex('pagesMeta').del();
  await knex('pagesMenu').del();
  await knex('contentBlocks').del();
  await knex('contentBlockFormattedText').del();
  await knex('contentBlockImage').del();
  await knex('contentBlockPlainText').del();
  await knex('pagesMenuItems').del();
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
  await knex('pagesMeta').insert(pagesMeta);
  await knex('pagesMenu').insert(menuList);
  await knex('pagesMenuItems').insert(menuItems);
}
