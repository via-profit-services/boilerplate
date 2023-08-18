import * as React from 'react';
import styled from '@emotion/styled';
import DayIcon from 'mdi-react/WeatherSunnyIcon';
import NightIcon from 'mdi-react/WeatherNightIcon';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import ButtonBase from '@via-profit/ui-kit/Button/ButtonBase';
import Cookies from 'js-cookie';

import { uiActions } from '~/redux/slicers/ui';

const Container = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundPrimary.toString()};
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.backgroundPrimary.darken(30).toString()};
  border-radius: 2em;
  display: flex;
  align-items: center;
  padding: 0.25em;
`;

const Button = styled(ButtonBase)<{ $isActive: boolean }>`
  display: flex;
  outline: none;
  box-shadow: none;
  border: 0;
  font-size: 0.8em;
  border-radius: 2em;
  flex: 50%;
  padding: 0.5em 1em;
  text-align: center;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: 600;
  transition: all 120ms ease-out;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  color: ${({ theme, $isActive }) =>
    $isActive
      ? theme.color.accentPrimary.toString()
      : theme.color.textPrimary.alpha(0.6).toString()};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.surface.toString() : 'transparent'};
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
      <Button
        startIcon={<DayIcon size="1.2em" />}
        $isActive={theme === 'standardLight'}
        onClick={handleSetTheme('standardLight')}
      >
        Day
      </Button>
      <Button $isActive={theme === 'standardDark'} onClick={handleSetTheme('standardDark')}>
        <NightIcon size="1.2em" />
        <Label>Night</Label>
      </Button>
    </Container>
  );
};

export default React.forwardRef(ThemeModeSwitcher);
