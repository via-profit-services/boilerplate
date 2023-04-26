import * as React from 'react';
import styled from '@emotion/styled';

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode | React.ReactNode[];
  readonly active: boolean;
}

const TabContentContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.area};
  box-shadow: ${({ theme }) => theme.shadows.elevation0};
  border-radius: 0 0 0.6em 0.6em;
  padding: 1em;
  overflow-y: auto;
`;

const TabContentRef: React.ForwardRefRenderFunction<HTMLDivElement, TabContentProps> = (
  props,
  ref,
) => {
  const { children, active, ...otherProps } = props;

  if (!active) {
    return null;
  }

  return (
    <TabContentContainer {...otherProps} ref={ref}>
      {children}
    </TabContentContainer>
  );
};
const TabContent = React.forwardRef(TabContentRef);

export default TabContent;

export { TabContent };
