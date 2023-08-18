import * as React from 'react';
import styled from '@emotion/styled';

import { TabProps, Tab } from './Tab';

export * from './Tab';
export * from './TabContent';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly onTabChange: React.Dispatch<React.SetStateAction<string>>;
  readonly activeTab: string;
  readonly children:
    | React.ReactElement<TabProps, typeof Tab>
    | React.ReactElement<TabProps, typeof Tab>[];
}

const TabsContainer = styled.div`
  background: ${({ theme }) => theme.color.surface.toString()};
  border-radius: 0.6em 0.6em 0 0;
  display: flex;
  overflow: hidden;
`;

const TabsRef: React.ForwardRefRenderFunction<HTMLDivElement, TabsProps> = (props, ref) => {
  const { onTabChange, activeTab, children, ...otherProps } = props;

  return (
    <TabsContainer {...otherProps} ref={ref}>
      {children}
    </TabsContainer>
  );
};

const Tabs = React.forwardRef(TabsRef);

export { Tabs };
export default Tabs;
