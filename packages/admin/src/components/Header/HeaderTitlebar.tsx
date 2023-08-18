import * as React from 'react';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { Context } from '~/components/Meta/reducer';

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.4rem;
`;

const selector = createSelector(
  (store: ReduxStore) => store.ui.locale,
  locale => ({ locale }),
);

const HeaderTitlebar: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (props, ref) => {
  const { state } = React.useContext(Context);
  const { locale } = useSelector(selector);
  const { header, content } = state;

  return (
    <Container {...props} ref={ref}>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>{header}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Helmet>
      <>{header}</>

      <>{content}</>
    </Container>
  );
};

export default React.forwardRef(HeaderTitlebar);
