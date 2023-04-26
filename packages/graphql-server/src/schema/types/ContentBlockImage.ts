import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLString,
} from 'graphql';
import { Context, DateTimeScalarType } from '@via-profit-services/core';

import { ContentBlockImagePayload, ContentBlockBase } from 'webpages';
import ContentBlockPlainText, {
  contentBlockPlainTextFields,
} from '~/schema/types/ContentBlockPlainText';
import ContentBlockType from '~/schema/enums/ContentBlockType';
import File from '~/schema/types/File';
import Page from '~/schema/types/Page';
import PageTemplate from '~/schema/types/PageTemplate';

export interface ContentBlockImageContentPayload {
  readonly file: string;
  readonly alt: string | null;
  readonly title: string | null;
}

type Parent = ContentBlockBase & ContentBlockImagePayload;

const ContentBlockImage = new GraphQLObjectType({
  name: 'ContentBlockImage',
  interfaces: ContentBlockPlainText.getInterfaces(),
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      type: { type: new GraphQLNonNull(ContentBlockType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      page: { type: Page, resolve: contentBlockPlainTextFields.page.resolve },
      template: { type: PageTemplate, resolve: contentBlockPlainTextFields.template.resolve },
      alt: { type: GraphQLString },
      title: { type: GraphQLString },
      file: {
        type: new GraphQLNonNull(File),
        resolve: async (parent, _args, context) => {
          const { file: fileID } = parent;
          const { dataloader } = context;

          const file = await dataloader.files.load(fileID);

          if (file === null) {
            throw new Error(
              `ContentBlockImage must contain a file reference, but file with id «${fileID}» not found`,
            );
          }

          return file;
        },
      },
      // file: {
      //   resolve: parent => parent,
      //   type: new GraphQLNonNull(
      //     new GraphQLObjectType({
      //       name: 'ContentBlockImagePayload',
      //       fields: () => {
      //         const fields: Record<string, GraphQLFieldConfig<Parent, Context>> = {
      //           id: {
      //             type: new GraphQLNonNull(GraphQLID),
      //             resolve: parent => `fakeID${parent.id}${parent.file}`,
      //           },
      //           alt: { type: GraphQLString },
      //           title: { type: GraphQLString },
      //           file: {
      //             type: new GraphQLNonNull(File),
      //             resolve: async (parent, _args, context) => {
      //               const { file: fileID } = parent;
      //               const { dataloader } = context;

      //               const file = await dataloader.files.load(fileID);

      //               if (file === null) {
      //                 throw new Error(
      //                   `ContentBlockImage must contain a file reference, but file with id «${fileID}» not found`,
      //                 );
      //               }

      //               return file;
      //             },
      //           },
      //         };

      //         return fields;
      //       },
      //     }),
      //   ),
      // },
    };

    return fields;
  },
});

export default ContentBlockImage;
