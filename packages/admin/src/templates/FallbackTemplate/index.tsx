import * as React from 'react';
import { Outlet } from 'react-router-dom';

import BaseTemplate from '~/templates/BaseTemplate';

export type FallbackTemplateProps = {
  readonly children?: React.ReactNode | readonly React.ReactNode[];
};

/**
 * 404 fallback template.\
 * If you pass the children property, then the children will be placed in the body of the template.\
 * Otherwise, there will be an `<Outlet>` component of `react-router-dom` renderer in the template body.
 */
const FallbackTemplate: React.FC<FallbackTemplateProps> = props => {
  const { children } = props;

  return <BaseTemplate>{typeof children !== 'undefined' ? children : <Outlet />}</BaseTemplate>;
};

export default FallbackTemplate;
