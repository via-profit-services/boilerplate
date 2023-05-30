import * as React from 'react';

import H1 from '@boilerplate/ui-kit/src/Typography/H1';
import Paragraph from '@boilerplate/ui-kit/src/Typography/Paragraph';

const loremIpsum = [
  'Magna nisi ex Lorem laboris cillum laborum do ullamco deserunt cupidatat cillum sit voluptate.',
  'Consequat duis incididunt aliquip excepteur anim ut in.',
  'Culpa ex enim aute dolore mollit veniam incididunt qui commodo consectetur laborum incididunt ipsum.',
  'Tempor ut et ut cillum quis dolor commodo quis proident quis tempor labore consectetur.',
  'Nulla ex ipsum sit irure excepteur culpa enim sunt.',
  'Occaecat non eiusmod incididunt commodo nulla anim aute ipsum.',
  'Deserunt in duis commodo do consequat eiusmod dolor mollit deserunt ullamco tempor.',
  'Veniam do consectetur quis dolore do.',
  'Qui officia voluptate elit irure nisi quis ipsum sit.',
  'Nostrud irure aliquip aliquip ullamco esse.',
  'Minim eu in velit consequat cupidatat cillum do do.',
];

const TextFallback: React.FC = () => (
  <>
    <H1>Text fallback</H1>
    <>
      {[...new Array(60).keys()].map(key => (
        <Paragraph key={key.toString()}>
          {loremIpsum[Math.floor(Math.random() * loremIpsum.length)]}
        </Paragraph>
      ))}
    </>
  </>
);

export default TextFallback;
