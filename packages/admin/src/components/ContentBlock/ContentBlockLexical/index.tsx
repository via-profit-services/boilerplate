import React from 'react';
import { graphql, useFragment } from 'react-relay';
import { SerializedTextNode } from 'lexical';

import fragmentSpec, {
  ContentBlockLexicalFragment$key,
} from '~/relay/artifacts/ContentBlockLexicalFragment.graphql';

export interface ContentBlockLexicalProps {
  readonly fragmentRef: ContentBlockLexicalFragment$key | null;
  readonly containerTagName?:
    | 'div'
    | 'section'
    | 'aside'
    | 'address'
    | 'article'
    | 'footer'
    | 'main'
    | 'header';
}

type PType = SerializedTextNode & {
  children: PType[];
};

const renderLexical = (lexical: any) => {
  const renderText = (textNode: PType) => {
    if (textNode.type === 'text' && typeof textNode.text === 'string') {
      return textNode.text;
    }

    return '';
  };

  const renderHeading = (headingNode: PType & { tag: string }) => {
    let c = '';

    if (headingNode.type === 'heading') {
      c += `<${headingNode.tag}>`;

      if (Array.isArray(headingNode.children)) {
        c += headingNode.children.map(node => renderNode(node));
      }

      c += `</${headingNode.tag}>`;
    }

    return c;
  };

  const renderParagraph = (paragraphNode: PType): string => {
    let c = '';

    if (paragraphNode.type === 'paragraph') {
      c += '<p>';

      if (Array.isArray(paragraphNode.children)) {
        c += paragraphNode.children.map(node => renderNode(node));
      }

      c += '</p>';
    }

    return c;
  };

  const renderNode = (node: PType) => {
    let c = '';
    switch (node.type) {
      case 'paragraph':
        c += renderParagraph(node);
        break;
      case 'text':
        c += renderText(node);
        break;
      case 'heading':
        c += renderHeading(node as any);
        break;

      default:
        break;
    }

    return c;
  };

  // childs.map(lexical.editorState.root.children => renderParagraph(child)).join('');

  const content = lexical.editorState.root.children.map((node: any) => renderNode(node)).join('');

  return content;
};

const ContentBlockLexical: React.FC<ContentBlockLexicalProps> = props => {
  const { fragmentRef, containerTagName } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);
  const content = React.useMemo(
    () => (fragment?.lexical ? renderLexical(fragment.lexical) : null),
    [fragment],
  );

  if (!fragment || !fragment.lexical) {
    return null;
  }

  const component = React.createElement(containerTagName || 'div', {
    dangerouslySetInnerHTML: { __html: content },
  });

  return <>{component}</>;
};

export default ContentBlockLexical;

graphql`
  fragment ContentBlockLexicalFragment on ContentBlockLexical {
    id
    lexical
  }
`;
