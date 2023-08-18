import { GraphQLUnionType } from 'graphql';

import ContentBlockPlainText from '~/schema/types/ContentBlockPlainText';
import ContentBlockLexical from '~/schema/types/ContentBlockLexical';
import ContentBlockImage from '~/schema/types/ContentBlockImage';
import type { ContentBlock as ContentBlockType } from 'webpages';

const ContentBlock = new GraphQLUnionType({
  name: 'ContentBlock',
  types: () => [ContentBlockPlainText, ContentBlockLexical, ContentBlockImage],
  resolveType: (contentBlock: ContentBlockType) => {
    switch (contentBlock.type) {
      case 'PLAIN_TEXT':
        return 'ContentBlockPlainText';
      case 'IMAGE':
        return 'ContentBlockImage';
      case 'FORMATTED_TEXT':
        return 'ContentBlockLexical';
      default:
        return null;
    }
  },
});

export default ContentBlock;
