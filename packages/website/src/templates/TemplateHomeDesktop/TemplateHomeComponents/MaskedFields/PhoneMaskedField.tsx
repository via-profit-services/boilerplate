import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H3 from '@boilerplate/ui-kit/src/Typography/H3';
import MaskedField from '@boilerplate/ui-kit/src/MaskedField';

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

const PhoneMaskedField: React.FC = () => {
  const [value, setValue] = React.useState('89122129985');
  const [isValid, setIsValid] = React.useState(true);

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
    <>
      <ErrorBoundary>
        <Section>
          <H3>Phone Masked Field</H3>
          <MaskedField
            mask={getMask}
            fullWidth
            error={value !== '' && !isValid}
            label="Type a phone number like a «8 912 212 88 99» or a «+7 912-878-22-99»"
            errorText={!isValid ? 'Invalid phone' : undefined}
            parseInput={(v, _m, c) => ({ text: v.replace(/[^0-9+]/g, ''), caret: c || 0 })}
            placeholder="+7 (987) 654-32-10"
            value={value}
            onChange={({ text, isValid }) => {
              setValue(text);
              setIsValid(isValid);
            }}
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeMiterlimit="10"
                  strokeWidth="32"
                  d="M451 374c-15.88-16-54.34-39.35-73-48.76-24.3-12.24-26.3-13.24-45.4.95-12.74 9.47-21.21 17.93-36.12 14.75s-47.31-21.11-75.68-49.39-47.34-61.62-50.53-76.48 5.41-23.23 14.79-36c13.22-18 12.22-21 .92-45.3-8.81-18.9-32.84-57-48.9-72.8C119.9 44 119.9 47 108.83 51.6A160.15 160.15 0 0 0 83 65.37C67 76 58.12 84.83 51.91 98.1s-9 44.38 23.07 102.64 54.57 88.05 101.14 134.49S258.5 406.64 310.85 436c64.76 36.27 89.6 29.2 102.91 23s22.18-15 32.83-31a159.09 159.09 0 0 0 13.8-25.8C465 391.17 468 391.17 451 374z"
                />
              </svg>
            }
          />
        </Section>
      </ErrorBoundary>
    </>
  );
};

export default PhoneMaskedField;
