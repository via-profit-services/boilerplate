import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '~/components/ErrorBoundary';
import H3 from '~/components/Typography/H3';
import H4 from '~/components/Typography/H4';
import Paragraph from '~/components/Typography/Paragraph';
import MaskedField from '~/components/MaskedField';

export type CountryCode = 'RU' | 'KZ' | 'UA' | 'JP' | 'US' | 'BY';

const tempaltes: [CountryCode | null, string | null, string, string, RegExp][] = [
  // Russian mask
  ['RU', '7', '+x (xxx) xxx-xx-xx', '+7 (987) 654-32-10', /^\+$/], // must be at first (Default RU)
  ['RU', '7', '8 (xxx) xxx-xx-xx', '8 (987) 654-32-10', /^8[^1]{0,}/], // 8912...
  ['RU', '7', '+7 (xxx) xxx-xx-xx', '+7 (987) 654-32-10', /^\+{0,1}7{0,1}9/], // 912...
  ['RU', '7', '+7 (xxx) xxx-xx-xx', '+7 (987) 654-32-10', /^\+{0,1}7([0-5]|[8-9])[0-9][0-9]/], // +79...

  // Other fucking countries
  ['BY', '375', '+375 (xx) xxx-xx-xx', '+375 (98) 765-43-21', /^\+{0,1}375/],
  ['KZ', '7', '+997 (xx) xxx-xx-xx', '+997 (98) 765-43-21', /^\+{0,1}997/],
  ['KZ', '7', '+7 (xxx) xxx-xx-xx', '+7 (600) 765-43-21', /^\+{0,1}7[6-7][0-9][0-9]/], // +7600 - +7700
  ['UA', '380', '+380 (xx) xxx-xxxx', '+380 (98) 765-4321', /^\+{0,1}380/],
  ['JP', '81', '+81 (xx) xxx-xxxx', '+81 (98) 765-4321', /^\+{0,1}81/],
  ['US', '1', '+1 xxx xxx-xx-xx', '+1 987 654-32-10', /^\+{0,1}1/],

  [null, null, '+x xxx xxx-xx-xx', '+30 987 654-32-10', /^\+{0,1}.*/], // must be at last
];

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const MaskedFields: React.FC = () => {
  const [value, setValue] = React.useState('89122129985');
  const [isValid, setIsValid] = React.useState(false);

  const getTempltate = React.useCallback(
    (str: string) =>
      tempaltes.find(d => {
        const regExp = new RegExp(d[4]);
        const clearedValue = str.replace(/[^\d]/gi, '');

        return regExp.test(clearedValue);
      }) || tempaltes[0],
    [],
  );

  const getMask = React.useCallback(
    (str: string) => {
      const [_countryCode, _callingCode, template] = getTempltate(str);

      return template.split('').map(char => (char === 'x' ? /\d/ : char));
    },
    [getTempltate],
  );

  return (
    <ErrorBoundary>
      <Section>
        <H3>MaskedFields</H3>
        <H4>Phone mask</H4>
        <p>9 (999) 999-99-99</p>
        <p>89122125599</p>
        <p>+79122125599</p>
        <p>8 (9 12)---212 --99 84</p>
        {isValid === true ? 'IS VALID' : 'HUINYA'}
        <MaskedField
          mask={getMask}
          placeholder="+7 (987) 654-32-10"
          value={value}
          onChange={({ text, isValid }) => {
            setValue(text);
            setIsValid(isValid);
          }}
        />
        <Paragraph>Value is «{value}»</Paragraph>
      </Section>
      {/* <Section>
        <H4>NUmber</H4>
        <MaskedField
          value={value}
          mask={input =>
            {

              return [/\d/, /\d/, /\d/, '.', /\d/, /\d/]

              return input
              .trim()
              .replace(/[^0-9,.]/g, '')
              .split('')
              .map(() => /\d/)
            }
          }
          onChange={({ text, isValid }) => {
            setValue(text);
            setIsValid(isValid);
          }}
        />
      </Section> */}
    </ErrorBoundary>
  );
};

export default MaskedFields;
