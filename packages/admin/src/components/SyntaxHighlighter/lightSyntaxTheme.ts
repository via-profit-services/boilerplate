const syntaxTheme = {
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
    background: '#f3f3f3',
    color: '#1e1e22',
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
    color: '#295c02',
    fontStyle: 'italic',
  },
  quote: {
    color: '#295c02',
    fontStyle: 'italic',
  },
  doctag: {
    color: '#8f128d',
  },
  keyword: {
    color: '#8f128d',
  },
  formula: {
    color: '#8f128d',
  },
  section: {
    color: '#8b0833',
  },
  name: {
    color: '#8b0833',
  },
  'selector-tag': {
    color: '#8b0833',
  },
  deletion: {
    color: '#8b0833',
  },
  subst: {
    color: '#8b0833',
  },
  literal: {
    color: '#0184bb',
  },
  string: {
    color: '#1f508b',
  },
  regexp: {
    color: '#1f508b',
  },
  addition: {
    color: '#1f508b',
  },
  attribute: {
    color: '#1f508b',
  },
  'meta-string': {
    color: '#1f508b',
  },
  built_in: {
    color: '#9f0000',
  },
  'class .title': {
    color: '#9f0000',
  },
  attr: {
    color: '#135c00',
  },
  'attr-name': {
    color: '#135c00',
  },
  'class-name': {
    color: '#8f128d',
  },
  'attr-value': {
    color: '#b05509',
  },
  variable: {
    color: '#135c00',
  },
  'template-variable': {
    color: '#135c00',
  },
  type: {
    color: '#135c00',
  },
  'selector-class': {
    color: '#135c00',
  },
  'selector-attr': {
    color: '#135c00',
  },
  'selector-pseudo': {
    color: '#135c00',
  },
  number: {
    color: '#135c00',
  },
  symbol: {
    color: '#4078f2',
  },
  bullet: {
    color: '#4078f2',
  },
  link: {
    color: '#4078f2',
    textDecoration: 'underline',
  },
  meta: {
    color: '#4078f2',
  },
  'selector-id': {
    color: '#4078f2',
  },
  title: {
    color: '#4078f2',
  },
  emphasis: {
    fontStyle: 'italic',
  },
  strong: {
    fontWeight: 'bold',
  },
};

export default syntaxTheme;
