import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import DayIcon from 'mdi-react/WeatherSunnyIcon';
import NightIcon from 'mdi-react/WeatherNightIcon';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { uiActions } from '~/redux/slicers/ui';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: 2em;
  display: flex;
  align-items: center;
  padding: 0.25em;
`;

const Button = styled.button<{ $isActive: boolean }>`
  display: flex;
  outline: none;
  border: 0;
  background-color: transparent;
  border-radius: 2em;
  flex: 50%;
  padding: 0.5em 1em;
  opacity: 0.5;
  text-align: center;
  justify-content: center;
  line-height: 1;
  font-weight: 600;
  transition: all 120ms ease-out;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  color: ${({ theme }) => theme.colors.text.default};
  ${props =>
    props.$isActive &&
    css`
      background: ${props.theme.colors.background.area};
      box-shadow: ${props.theme.shadows.elevation0};
      opacity: 1;
      cursor: default;
    `}
`;

const Label = styled.span`
  margin-left: 0.5em;
`;

type Props = React.HTMLAttributes<HTMLDivElement>;

const selector = createSelector(
  (store: ReduxStore) => store.ui.theme,
  theme => ({ theme }),
);

const ThemeModeSwitcher: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (props, ref) => {
  const { theme } = useSelector(selector);
  const dispatch = useDispatch();

  const handleSetTheme =
    (themeValue: ThemeName): React.MouseEventHandler<HTMLButtonElement> =>
    () => {
      Cookies.set('theme', themeValue);
      dispatch(uiActions.theme(themeValue));
    };

  return (
    <Container {...props} ref={ref}>
      <Button $isActive={theme === 'standardLight'} onClick={handleSetTheme('standardLight')}>
        <DayIcon size="1.2em" />
        <Label>Day</Label>
      </Button>
      <Button $isActive={theme === 'standardDark'} onClick={handleSetTheme('standardDark')}>
        <NightIcon size="1.2em" />
        <Label>Night</Label>
      </Button>
    </Container>
  );
};

export default React.forwardRef(ThemeModeSwitcher);
