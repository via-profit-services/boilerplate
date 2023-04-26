import React from 'react';
import styled from '@emotion/styled';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { uiActions } from '~/redux/slicers/ui';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Btn = styled.button<{ $active?: boolean }>`
  font-size: 0.8rem;
  background: ${props => (props.$active ? 'orange' : 'white')};
`;

const selector = createSelector(
  (store: ReduxStore) => store.ui.theme,
  (store: ReduxStore) => store.ui.device,
  (theme, device) => ({ theme, device }),
);

const HeaderToolbar: React.FC = () => {
  const { theme, device } = useSelector(selector);
  const dispatch = useDispatch();

  const switchTheme = () => {
    const themeValue = theme === 'standardLight' ? 'standardDark' : 'standardLight';
    Cookies.set('theme', themeValue);
    dispatch(uiActions.theme(themeValue));
  };

  const switchDevice = () => {
    const deviceValue = device === 'desktop' ? 'mobile' : 'desktop';
    Cookies.set('device', deviceValue);
    dispatch(uiActions.device(deviceValue));
  };

  return (
    <Container>
      <Btn onClick={() => switchTheme()}>{theme}</Btn>
      <Btn onClick={() => switchDevice()}>{device}</Btn>
    </Container>
  );
};

export default HeaderToolbar;
