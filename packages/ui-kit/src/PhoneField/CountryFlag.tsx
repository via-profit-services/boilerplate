import React from 'react';
import styled from '@emotion/styled';
import Color from 'color';

import UnknownFlag from './flags/UnknownFlag';
import BYFlag from './flags/BYFlag';
import JPFlag from './flags/JPFlag';
import KZFlag from './flags/KZFlag';
import RUFlag from './flags/RUFlag';
import UAFlag from './flags/UAFlag';
import USFlag from './flags/USFlag';

export interface CountryFlagProps extends React.HTMLAttributes<HTMLSpanElement> {
  readonly countryCode: string | null;
}

const CountryFlagContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  border-radius: 100%;
  overflow: hidden;
  margin-left: 0.5em;
  margin-right: 0.5em;
  border: 1px solid ${({ theme }) => Color(theme.colors.textPrimary).fade(0.8).rgb().toString()};
`;

const CountryFlag: React.FC<CountryFlagProps> = props => {
  const { countryCode, ...otherProps } = props;

  const renderFlag = React.useMemo(() => {
    const flagMap: Record<string, React.ReactElement> = {
      RU: <RUFlag />,
      KZ: <KZFlag />,
      UA: <UAFlag />,
      JP: <JPFlag />,
      US: <USFlag />,
      BY: <BYFlag />,
    };

    return countryCode && flagMap[countryCode] ? flagMap[countryCode] : <UnknownFlag />;
  }, [countryCode]);

  return <CountryFlagContainer {...otherProps}>{renderFlag}</CountryFlagContainer>;
};

export default CountryFlag;
