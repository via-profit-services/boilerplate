import { GraphQLObjectType } from 'graphql';

import createContentBlockPlainText from './createContentBlockPlainText';
import createContentBlockFormattedText from './createContentBlockFormattedText';
import createContentBlockImage from './createContentBlockImage';
import updateContentBlockPlainText from './updateContentBlockPlainText';
import updateContentBlockFormattedText from './updateContentBlockFormattedText';
import updateContentBlockImage from './updateContentBlockImage';
import createPage from './createPage';
import updatePage from './updatePage';

const PagesMutation = new GraphQLObjectType({
  name: 'PagesMutation',
  fields: {
    createContentBlockPlainText,
    createContentBlockFormattedText,
    createContentBlockImage,
    updateContentBlockPlainText,
    updateContentBlockFormattedText,
    updateContentBlockImage,
    createPage,
    updatePage,
  },
});

export default PagesMutation;
