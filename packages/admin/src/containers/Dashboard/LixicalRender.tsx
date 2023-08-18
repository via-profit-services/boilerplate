import * as React from 'react';
import {
  EditorState,
  $getRoot,
  ParagraphNode,
  RootNode,
  LexicalNode,
  TextNode,
  $isTextNode,
} from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';

interface Props {
  readonly editorState: EditorState | null;
}

export const serializeToHtml = async (editorState: EditorState): Promise<string> => {
  const renderText = (node: TextNode) => {
    switch (node.getFormat()) {
      case 1: // bold
        return `<strong>${node.getTextContent()}</strong>`;
      case 1 << 1: // italic
        return `<em>${node.getTextContent()}</em>`;
      case 1 << 2: // strikethrough
        return `<s>${node.getTextContent()}</s>`;
      case 1 << 3: // underline
        return `<u>${node.getTextContent()}</u>`;
      case 1 << 4: // code
        return `<code>${node.getTextContent()}</code>`;
      case 1 << 5: // subscript
        return `<sub>${node.getTextContent()}</sub>`;
      case 1 << 6: // superscript
        return `<sup>${node.getTextContent()}</sup>`;
      default:
        return node.getTextContent();
    }
  };

  const renderStyle = (format: number) => {
    switch (format) {
      case 1: // left
        return 'text-align: left;';
      case 2: // center
        return 'text-align: center;';
      case 3: // right
        return 'text-align: right;';
      case 4: // justify
        return 'text-align: justify;';
      default:
        // justify
        console.debug('unknown text-align', format);

        return '';
    }
  };

  const renderNode = (node: LexicalNode) => {
    switch (node.getType()) {
      case 'root':
        return (node as RootNode)
          .getChildren()
          .map(k => renderNode(k))
          .join('');
      case 'heading': {
        const headingNode = node as HeadingNode;

        return `<${headingNode.getTag()}>${headingNode
          .getChildren()
          .map(k => renderNode(k))
          .join('')}</${headingNode.getTag()}>`;
      }
      case 'list': {
        const listNode = node as ListNode;

        return `<${listNode.getTag()}>${listNode
          .getChildren()
          .map(k => renderNode(k))
          .join('')}</${listNode.getTag()}>`;
      }
      case 'text':
        if ($isTextNode(node)) {
          return renderText(node);
        }

        return '';
      case 'quote': {
        const quoteNode = node as QuoteNode;

        return `<blockquote>${quoteNode
          .getChildren()
          .map(k => renderNode(k))
          .join('')}</blockquote>`;
      }
      case 'paragraph': {
        const paragraphNode = node as ParagraphNode;

        return `<p${
          paragraphNode.getFormat() ? ` style="${renderStyle(paragraphNode.getFormat())}"` : ''
        }>${paragraphNode
          .getChildren()
          .map(k => renderNode(k))
          .join('')}</p>`;
      }
      case 'listitem': {
        const listItemNode = node as ListItemNode;

        return `<li>${listItemNode
          .getChildren()
          .map(k => renderNode(k))
          .join('')}</li>`;
      }
      case 'link': {
        const linkNode = node as LinkNode;

        return `<a href="${linkNode.getURL()}">${linkNode
          .getChildren()
          .map(k => renderNode(k))
          .join('')}</a>`;
      }
      default:
        console.debug('unknown type', node.getType());

        return '';
    }
  };

  return new Promise(resolve => {
    editorState.read(() => {
      resolve(renderNode($getRoot()));
    });
  });
};

const LexicalRender: React.FC<Props> = props => {
  const { editorState } = props;
  const editorStateRef = React.useRef<EditorState | null>(editorState);
  const [html, setHtml] = React.useState('');

  React.useEffect(() => {
    if (editorStateRef.current !== editorState) {
      editorStateRef.current = editorState;
      if (editorStateRef.current) {
        serializeToHtml(editorStateRef.current)
          .then(res => setHtml(res))
          .catch(err => console.error(err));
      }
    }
  }, [editorState]);

  return <div className="lexical-render">{html}</div>;
};

export default LexicalRender;
