import { GraphQLEnumType } from 'graphql';

const ImageTransformFormatType = new GraphQLEnumType({
  name: 'ImageTransformFormatType',
  values: {
    PNG: { value: 'png' },
    JPEG: { value: 'jpeg' },
    WEBP: { value: 'webp' },
  },
});

export default ImageTransformFormatType;
