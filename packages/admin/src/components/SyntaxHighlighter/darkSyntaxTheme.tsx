import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import lightSyntaxTheme from './lightSyntaxTheme';

type NonUndefined<T> = T extends undefined ? never : T;

const syntaxTheme: NonUndefined<SyntaxHighlighterProps['style']> = {
  ...lightSyntaxTheme,
  'code[class*="language-"]': {
    display: 'block',
    overflow: 'auto',
    maxHeight: '600px',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    fontSize: '1em',
    lineHeight: '1.5em',
    tabSize: 4,
    hyphens: 'none',
    margin: 0,
  },
  'pre[class*="language-"]': {
    color: '#c3cee3',
    background: '#282a36',
    margin: '1rem 0',
    padding: '1em',
    borderRadius: '8px',
    hyphens: 'none',
    position: 'relative',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    fontSize: '1em',
    lineHeight: '1.5em',
    tabSize: 4,
  },
  ':not(pre) > code[class*="language-"]': {
    whiteSpace: 'normal',
    borderRadius: '8px',
    padding: '0.1em',
  },
  comment: {
    color: '#93b7f9',
    fontStyle: 'italic',
  },
  quote: {
    color: '#93b7f9',
    fontStyle: 'italic',
  },
  doctag: {
    color: '#c678dd',
  },
  keyword: {
    color: '#c678dd',
  },
  formula: {
    color: '#c678dd',
  },
  section: {
    color: '#f3a1a7',
  },
  name: {
    color: '#f3a1a7',
  },
  'selector-tag': {
    color: '#f3a1a7',
  },
  deletion: {
    color: '#f3a1a7',
  },
  subst: {
    color: '#f3a1a7',
  },
  literal: {
    color: '#56b6c2',
  },
  string: {
    color: '#98c379',
  },
  regexp: {
    color: '#98c379',
  },
  addition: {
    color: '#98c379',
  },
  attribute: {
    color: '#98c379',
  },
  'meta-string': {
    color: '#98c379',
  },
  built_in: {
    color: '#e6c07b',
  },
  'class .title': {
    color: '#e6c07b',
  },
  attr: {
    color: '#f1a769',
  },
  'attr-name': {
    color: '#135c00',
  },
  'class-name': {
    color: '#8f128d',
  },
  variable: {
    color: '#f1a769',
  },
  'template-variable': {
    color: '#f1a769',
  },
  type: {
    color: '#f1a769',
  },
  'selector-class': {
    color: '#f1a769',
  },
  'selector-attr': {
    color: '#f1a769',
  },
  'selector-pseudo': {
    color: '#f1a769',
  },
  number: {
    color: '#f1a769',
  },
  symbol: {
    color: '#61aeee',
  },
  bullet: {
    color: '#61aeee',
  },
  link: {
    color: '#61aeee',
    textDecoration: 'underline',
  },
  meta: {
    color: '#61aeee',
  },
  'selector-id': {
    color: '#61aeee',
  },
  title: {
    color: '#61aeee',
  },
  emphasis: {
    fontStyle: 'italic',
  },
  strong: {
    fontWeight: 'bold',
  },
};

export default syntaxTheme;
