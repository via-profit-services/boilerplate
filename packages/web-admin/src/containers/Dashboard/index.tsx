import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import Meta from '~/components/Meta';
import Button from '@boilerplate/ui-kit/src/Button';
import ContentArea from '~/components/ContentArea';
// import LexicalComponent from './LexicalEditor';

const selector = createSelector(
  (store: ReduxStore) => store.ui.theme,
  theme => ({ theme }),
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector(selector);
  const [headerTitle, setHeaderTitle] = React.useState('Dashboard');

  return (
    <>
      <Meta header={String(headerTitle)} />

      <ContentArea>
        <Button
          type="button"
          onClick={() => {
            const themeValue = theme === 'standardLight' ? 'standardDark' : 'standardLight';

            Cookies.set('theme', themeValue);
            dispatch({
              type: 'setTheme',
              payload: themeValue,
            });
          }}
        >
          Switch theme
        </Button>

        <Button
          type="button"
          variant="contained"
          onClick={() => {
            const title = new Date().toLocaleString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            setHeaderTitle(title);
          }}
        >
          Set header
        </Button>

        {/* <LexicalComponent /> */}
      </ContentArea>
    </>
  );
};

export default Dashboard;
