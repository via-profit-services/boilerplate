import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';

import OpenInNewIcon from '~/components/Icons/OpenOutline';
import H1 from '~/components/Typography/H1';
import H2 from '~/components/Typography/H2';
import H3 from '~/components/Typography/H3';
import H4 from '~/components/Typography/H4';
import H5 from '~/components/Typography/H5';
import Strong from '~/components/Typography/Strong';
import Em from '~/components/Typography/Em';
import Paragraph from '~/components/Typography/Paragraph';
import { Ul, Ol } from '~/components/Typography/List';
import Blockquote from '~/components/Typography/Blockquote';
import SyntaxHighlighter from '~/components/SyntaxHighlighter';

interface Props {
  readonly children: string;
  readonly overrides?: MarkdownToJSX.Overrides;
}

const Img = styled.img`
  max-width: 100%;
`;

const Anchor = styled.a``;

const ExternalLink = styled.a``;

const ExternalLinkIcon = styled(OpenInNewIcon)`
  color: currentColor;
  font-size: 0.9em;
  margin-left: 0.1em;
`;

const MarkdownEm = styled(Em)`
  color: ${({ theme }) => theme.colors.text.default};
`;

const CodeInline = styled.code`
  background: ${({ theme }) => theme.colors.background.default};
  color: red;
  padding: 0em 0.4em;
  border-radius: 4px;
  font-size: 0.8em;
`;

const relativeToAbsolute = (base: string, rel: string): string => {
  const resultArray = base.split('/');

  if (!base.match(/\/$/)) {
    resultArray.pop();
  }

  rel.split('/').forEach(item => {
    if (item === '..') {
      resultArray.pop();

      return;
    }
    if (item === '.') {
      return;
    }

    resultArray.push(item);
  });

  return resultArray.join('/');
};

const titleToAnchor = (headername: string | React.ReactNode): string => {
  const anchorName = String(headername)
    .toLowerCase()
    .replace(/[\s,/]/g, '-')
    .replace(/[^0-9a-z-]/gi, '');

  return anchorName;
};

const MarkdownRender: React.FC<Props> = props => {
  const { children, overrides } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Markdown
      options={{
        overrides: {
          h1: p => (
            <H1>
              <Anchor aria-hidden="true" tabIndex={-1} id={titleToAnchor(p.children)} />
              {p.children}
            </H1>
          ),
          h2: p => (
            <H2>
              <Anchor aria-hidden="true" tabIndex={-1} id={titleToAnchor(p.children)} />
              {p.children}
            </H2>
          ),
          h3: p => (
            <H3>
              <Anchor aria-hidden="true" tabIndex={-1} id={titleToAnchor(p.children)} />
              {p.children}
            </H3>
          ),
          h4: p => (
            <H4>
              <Anchor aria-hidden="true" tabIndex={-1} id={titleToAnchor(p.children)} />
              {p.children}
            </H4>
          ),
          h5: p => (
            <H5>
              <Anchor aria-hidden="true" tabIndex={-1} id={titleToAnchor(p.children)} />
              {p.children}
            </H5>
          ),
          img: Img,
          blockquote: Blockquote,
          b: Strong,
          em: MarkdownEm,
          p: Paragraph,
          ul: Ul,
          ol: Ol,
          a: ({ href, title, children }) => {
            if (String(href || '').match(/^(http|https):\/\//)) {
              return (
                <ExternalLink
                  target="_blank"
                  rel="noopener noreferrer"
                  title={typeof title === 'string' ? title : undefined}
                  href={href}
                >
                  {children}
                  {!String(href || '').match(/^https:\/\/codesandbox\.io\/s\//) && (
                    <ExternalLinkIcon />
                  )}
                </ExternalLink>
              );
            }

            if (String(href || '').match(/\.md(#[a-z0-9-]+){0,1}$/i)) {
              const url = relativeToAbsolute(pathname, String(href || '').replace(/\.md/, ''));

              return (
                <Link to={url} title={title}>
                  {children}
                </Link>
              );
            }

            if (String(href || '').match(/#[a-z0-9-]+$/i)) {
              const anchorName = String(href || '').match(/#([a-z0-9-]+)$/)?.[1] || '';

              return (
                <a
                  onClick={event => {
                    event.preventDefault();
                    const element = document.querySelector(`a[id="${anchorName}"]`);

                    if (element) {
                      const yOffset = -61; // app header height
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                      navigate(`${pathname}#${anchorName}`);
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  title={typeof title === 'string' ? title : undefined}
                  href={href}
                >
                  {children}
                </a>
              );
            }

            return (
              <Link title={typeof title === 'string' ? title : undefined} to={href || ''}>
                {children}
              </Link>
            );
          },
          code: p => {
            const { className, children } = p;

            if (typeof className === 'undefined') {
              return <CodeInline>{String(children).replace(/\n$/, '')}</CodeInline>;
            }

            const language = className.replace(/^lang-/, '');

            return <SyntaxHighlighter language={language as any} code={String(children)} />;
          },
          ...overrides,
        },
      }}
    >
      {children}
    </Markdown>
  );
};

export default MarkdownRender;
