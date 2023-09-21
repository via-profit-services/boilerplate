import * as React from 'react';
import styled from '@emotion/styled';
import {
  $getSelection,
  FORMAT_TEXT_COMMAND,
  $isRangeSelection,
  EditorState,
  $createParagraphNode,
} from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $isListNode, ListNode } from '@lexical/list';
import { $wrapNodes } from '@lexical/selection';
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
  HeadingNode,
} from '@lexical/rich-text';
import { $getNearestNodeOfType } from '@lexical/utils';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TreeView } from '@lexical/react/LexicalTreeView';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { serializeToHtml } from './LixicalRender';

const Button = styled.button<{ $isActive?: boolean }>`
  font-weight: ${props => (props.$isActive ? 'bold' : 'normal')};
`;

const Toolbar = styled.div`
  display: flex;
`;

const Placeholder = styled.div`
  color: #999;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  top: 15px;
  left: 10px;
  font-size: 15px;
  user-select: none;
  display: inline-block;
  pointer-events: none;
`;

const EditorWrapper = styled.div`
  border-radius: 2px;
  max-width: 600px;
  color: #000;
  position: relative;
  line-height: 20px;
  font-weight: 400;
  background: #fff;
  border: 1px solid #bfbfbf;

  & .tree-view-output {
    background: #000;
    color: #fff;
  }

  & .editor-input {
    outline: none;
    min-height: 150px;
    resize: none;
    font-size: 15px;
    position: relative;
    tab-size: 1;
    padding: 0 10px;
    caret-color: #444;
  }

  & .editor-text-bold {
    font-weight: bold;
  }

  & .editor-text-italic {
    font-style: italic;
  }
`;

function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <TreeView
      treeTypeButtonClassName="tree-type-button"
      viewClassName="tree-view-output"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      editor={editor}
    />
  );
}

const initialState = {
  _nodeMap: [
    [
      'root',
      {
        __children: ['23', '17'],
        __dir: 'ltr',
        __format: 0,
        __indent: 0,
        __key: 'root',
        __parent: null,
        __type: 'root',
      },
    ],
    [
      '2',
      {
        __type: 'text',
        __parent: '23',
        __key: '2',
        __text: 'Hello world',
        __format: 0,
        __style: '',
        __mode: 0,
        __detail: 0,
      },
    ],
    [
      '17',
      {
        __type: 'paragraph',
        __parent: 'root',
        __key: '17',
        __children: ['18', '21', '22', '19', '20'],
        __format: 0,
        __indent: 0,
        __dir: 'ltr',
      },
    ],
    [
      '18',
      {
        __type: 'text',
        __parent: '17',
        __key: '18',
        __text: 'Some text here and ',
        __format: 0,
        __style: '',
        __mode: 0,
        __detail: 0,
      },
    ],
    [
      '19',
      {
        __type: 'text',
        __parent: '17',
        __key: '19',
        __text: 'italic',
        __format: 2,
        __style: '',
        __mode: 0,
        __detail: 0,
      },
    ],
    [
      '20',
      {
        __type: 'text',
        __parent: '17',
        __key: '20',
        __text: '.',
        __format: 0,
        __style: '',
        __mode: 0,
        __detail: 0,
      },
    ],
    [
      '21',
      {
        __type: 'text',
        __parent: '17',
        __key: '21',
        __text: 'bold',
        __format: 1,
        __style: '',
        __mode: 0,
        __detail: 0,
      },
    ],
    [
      '22',
      {
        __type: 'text',
        __parent: '17',
        __key: '22',
        __text: ' or ',
        __format: 0,
        __style: '',
        __mode: 0,
        __detail: 0,
      },
    ],
    [
      '23',
      {
        __type: 'heading',
        __parent: 'root',
        __key: '23',
        __children: ['2'],
        __format: 0,
        __indent: 0,
        __dir: 'ltr',
        __tag: 'h1',
      },
    ],
  ],
  _selection: {
    anchor: { key: '20', offset: 1, type: 'text' },
    focus: { key: '20', offset: 1, type: 'text' },
    type: 'range',
  },
};

function ToolbarPlugin() {
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [blockType, setBlockType] = React.useState<string>('paragraph');
  // const [selectedElementKey, setSelectedElementKey] = React.useState<string | null>(null);
  const [editor] = useLexicalComposerContext();

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }

    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
    const elementKey = element.getKey();
    const elementDOM = editor.getElementByKey(elementKey);
    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));

    if (elementDOM !== null) {
      // setSelectedElementKey(elementKey);
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element) ? element.getTag() : element.getType();
        setBlockType(type);
      }
    }
  }, [editor]);

  const handleBold = () => {
    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const handleItalic = () => {
    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const handleBlock = (headingSize: HeadingTagType) => () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () =>
          blockType !== headingSize ? $createHeadingNode(headingSize) : $createParagraphNode(),
        );
      }
    });
  };

  const handleParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  React.useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  return (
    <Toolbar>
      <Button type="button" $isActive={isBold} onClick={handleBold}>
        Bold
      </Button>
      <Button type="button" $isActive={isItalic} onClick={handleItalic}>
        Italic
      </Button>
      <Button type="button" $isActive={blockType === 'paragraph'} onClick={handleParagraph}>
        Paragraph
      </Button>
      <Button type="button" $isActive={blockType === 'h1'} onClick={handleBlock('h1')}>
        H1
      </Button>
      <Button type="button" $isActive={blockType === 'h2'} onClick={handleBlock('h2')}>
        H2
      </Button>
      <Button type="button" $isActive={blockType === 'h3'} onClick={handleBlock('h3')}>
        H3
      </Button>
      <Button type="button" $isActive={blockType === 'h4'} onClick={handleBlock('h4')}>
        H4
      </Button>
      <Button type="button" $isActive={blockType === 'h5'} onClick={handleBlock('h5')}>
        H5
      </Button>
    </Toolbar>
  );
}

const LoxicalEditorComponent: React.FC = () => {
  const editorStateRef = React.useRef<EditorState | null>(null);
  const [htmlOutput, setHTMLOutput] = React.useState('');
  const initialConfig = React.useRef({
    readOnly: false,
    namespace: 'dashboard',
    onError: (err: Error) => console.error(err),
    theme: {
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
      },
    },
    nodes: [HeadingNode],
  });

  return (
    <>
      <EditorWrapper>
        <LexicalComposer initialConfig={initialConfig.current}>
          <ToolbarPlugin />
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            // initialEditorState={JSON.stringify(initialState)}
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder>Enter some text...</Placeholder>}
          />
          <HistoryPlugin />
          <TreeViewPlugin />
        </LexicalComposer>
      </EditorWrapper>
      <button
        type="button"
        onClick={() => {
          if (editorStateRef.current) {
            // const json = JSON.stringify(editorStateRef.current.toJSON());
            serializeToHtml(editorStateRef.current)
              .then(html => setHTMLOutput(html))
              .catch(err => console.error(err));
          }
        }}
      >
        Export
      </button>
      <>{htmlOutput}</>
      {/* <LexicalRender editorState={editorStateRef.current} /> */}
    </>
  );
};

export default LoxicalEditorComponent;
