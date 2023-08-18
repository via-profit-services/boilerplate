import { GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLBoolean } from 'graphql';

import ImageTransformFormatType from '~/schema/enums/ImageTransformFormatType';

const ImageTransform = new GraphQLInputObjectType({
  name: 'ImageTransform',
  fields: {
    resize: {
      type: new GraphQLInputObjectType({
        name: 'ImageTransformResize',
        fields: {
          w: { type: new GraphQLNonNull(GraphQLInt) },
          h: { type: new GraphQLNonNull(GraphQLInt) },
        },
      }),
    },
    cover: {
      type: new GraphQLInputObjectType({
        name: 'ImageTransformCover',
        fields: {
          w: { type: new GraphQLNonNull(GraphQLInt) },
          h: { type: new GraphQLNonNull(GraphQLInt) },
        },
      }),
    },
    contain: {
      type: new GraphQLInputObjectType({
        name: 'ImageTransformContain',
        fields: {
          w: { type: new GraphQLNonNull(GraphQLInt) },
          h: { type: new GraphQLNonNull(GraphQLInt) },
        },
      }),
    },
    crop: {
      type: new GraphQLInputObjectType({
        name: 'ImageTransformCrop',
        fields: {
          w: { type: new GraphQLNonNull(GraphQLInt) },
          h: { type: new GraphQLNonNull(GraphQLInt) },
          x: { type: new GraphQLNonNull(GraphQLInt) },
          y: { type: new GraphQLNonNull(GraphQLInt) },
        },
      }),
    },
    format: {
      type: new GraphQLInputObjectType({
        name: 'ImageTransformFormat',
        fields: {
          type: { type: new GraphQLNonNull(ImageTransformFormatType) },
          quality: { type: new GraphQLNonNull(GraphQLInt) },
        },
      }),
    },
    blur: {
      type: GraphQLInt,
    },
    greyscale: {
      type: GraphQLBoolean,
    },
  },
});

export default ImageTransform;
